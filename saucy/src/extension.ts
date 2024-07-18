import { EventEmitter } from 'events';
import * as vscode from 'vscode';
import { DocumentDecorator } from './models/editor/decorator';
import { log } from './models/system/logger';
import { GitService } from './services/git/git.service';
import { GitLabService } from './services/gitlab/gitlab.service';
import { API_ERRORS, DEBUG_MODE } from './shared/constants';
import { getRepoId, getUserAccessToken } from './utils/vscodeUtils';

const commentsUpdateEmitter = new EventEmitter();

export const activate = async (context: vscode.ExtensionContext): Promise<void> => {

    log.debug('Congratulations, your extension "saucy" is now active!');
    const gitController = new GitService();
    await gitController.init(context.subscriptions);
    let branch: string | undefined = '';
    let commentsList = new Map<string, MergeRequestComment>();
    let processComments = false;

    const gitLabService = new GitLabService(getRepoId(), getUserAccessToken());

    const main = vscode.commands.registerCommand('saucy.startSaucy', async () => {
        let mergeRequestID: string = DEBUG_MODE ? '0' : '';
        let debugModeExecuted = DEBUG_MODE ? true : false;

        (async function pingMergeRequest() {
            log.debug('pingMergeRequest');
            if (!DEBUG_MODE && debugModeExecuted) {
                return;
            }

            try {
                const mergeRequests = await gitLabService.getAllMRs();

                if (!DEBUG_MODE) {
                    await gitController.getRepositoryInfo();

                    if (branch !== gitController.currentBranch || DEBUG_MODE) {
                        branch = gitController.currentBranch;
                        mergeRequestID = '';
                        commentsList.clear();
                    }

                    mergeRequests.forEach((element: MergeRequestElement) => {
                        if (element.source_branch === branch) {
                            mergeRequestID = element.iid;
                        }
                    });
                }
            } catch (error) {
                log.error("Error fetching MRs:", error);
            }

            setTimeout(pingMergeRequest, 10000);
        })();

        (async function pingComments() {
            log.debug('pingComments');
            try {
                if (mergeRequestID !== '') {
                    const comments = await gitLabService.currentMRNotes(mergeRequestID);
                    if (comments && comments.length > 0 && comments !== API_ERRORS.CURRENT_MERGE_REQUEST_NOTES) {
                        let shouldBatchEmitEvent = false;
                        comments.forEach((element: any) => {
                            let file = vscode.window.activeTextEditor?.document.fileName;

                            if (DEBUG_MODE) {
                                file = element.position.new_path.split('/').pop();
                            }

                            if (element.type === "DiffNote" && element.resolvable) {
                                if (element.resolved && commentsList.has(element.id)) {
                                    commentsList.delete(element.id);
                                    vscode.window.showInformationMessage(`A comment has been resolved 🥵\n${file}`);
                                } else {
                                    if (!element.resolved && !commentsList.has(element.id)) {
                                        vscode.window.showInformationMessage(`You have received a new comment 🤨\n${file}`);
                                        commentsList.set(element.id, element);
                                        processComments = true;
                                    }
                                    if (!DEBUG_MODE && !element.resolved) {
                                        commentsList.set(element.id, element);
                                        processComments = true;
                                    }
                                }
                            }
                        });
                        if (processComments) {
                            shouldBatchEmitEvent = true;
                            processComments = false;
                        }
                        if (shouldBatchEmitEvent) {
                            log.debug('Emitting commentsUpdated event');
                            commentsUpdateEmitter.emit('commentsUpdated');
                        }
                    }
                }
            } catch (error) {
                log.error("Error fetching comments:", error);
            }
            setTimeout(pingComments, 10000);
        })();
    });

    const highlightComments = () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            return;
        }

        const relativePath = vscode.workspace.asRelativePath(editor.document.uri.fsPath).split('/').pop();
        if(DEBUG_MODE){
            DocumentDecorator.decorate(2, 10, `${commentsList.entries().next().value[1].body} 🔥 - ${commentsList.entries().next().value[1].author.username}`);
            return;
        }
        Array.from(commentsList.entries())
            .filter(([_, comment]) => comment.position.new_path.split('/').pop() === relativePath)
            .forEach(([_, { body, position, author }]) => {
                const { start, end } = position.line_range;
                DocumentDecorator.decorate(start.new_line, end.new_line, `${body} 🔥 - ${author.username}`);
            });
    };

    commentsUpdateEmitter.on('commentsUpdated', highlightComments);

    vscode.window.onDidChangeActiveTextEditor(() => {
        DocumentDecorator.removeDecorations();
        highlightComments();
    });

    context.subscriptions.push(main);
};

export const deactivate = (): void => { };
