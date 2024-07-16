import * as vscode from 'vscode';
import { GitService } from './services/git/git.service';
import { GitLabService } from './services/gitlab/gitlab.service';
import { ApiErrors, CONFIG_REPO_ID, CONFIG_USER_ACCESS_TOKEN } from './shared/constants';
import { DocumentDecorator } from './models/editor/decorator';
import { EventEmitter } from 'events';

const commentsUpdateEmitter = new EventEmitter();

export const activate = async (context: vscode.ExtensionContext): Promise<void> => {

    console.log('Congratulations, your extension "saucy" is now active!');
    const gitController = new GitService();
    await gitController.init(context.subscriptions);
    let branch: string | undefined = '';
    let commentsList = new Map<string, MergeRequestComment>();
    let processComments = false;

    const gitLabService = new GitLabService(CONFIG_REPO_ID, CONFIG_USER_ACCESS_TOKEN);

    const main = vscode.commands.registerCommand('saucy.startSaucy', async () => {
        let mergeRequestID: string = '';

        (async function pingMergeRequest() {
            try {
                const mergeRequests = await gitLabService.getAllMRs();
                if (mergeRequests && mergeRequests !== ApiErrors.getAllMRs) {
                    await gitController.getRepositoryInfo();
                    if (branch !== gitController.currentBranch) {
                        branch = gitController.currentBranch;
                        mergeRequestID = '';
                        commentsList.clear();
                    }
                    console.log('Branch:', branch);
                    mergeRequests.forEach((element: MergeRequestElement) => {
                        if (element.source_branch === branch) {
                            mergeRequestID = element.iid;
                        }
                    });
                }
            } catch (error) {
                console.error("Error fetching MRs:", error);
            }
            setTimeout(pingMergeRequest, 10000);
        })();

        (async function pingComments() {
            try {
                if (mergeRequestID !== '') {
                    const comments = await gitLabService.currentMRNotes(mergeRequestID);
                    if (comments && comments.length > 0 && comments !== ApiErrors.currentMRNotes) {
                        let shouldBatchEmitEvent = false;
                        comments.forEach((element: any) => {
                            if (element.type === "DiffNote" && element.resolvable) {
                                const file = element.position.new_path.split('/').pop();
                                if (element.resolved && commentsList.has(element.id)) {
                                    commentsList.delete(element.id);
                                    vscode.window.showInformationMessage(`a comment has been resolved 🥵 \n ${file}`);
                                } else {
                                    if (!element.resolved && !commentsList.has(element.id)) {
                                        vscode.window.showInformationMessage(`you have received a new comment 🤨 \n ${file}`);
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
                            console.log('Emitting commentsUpdated event');
                            commentsUpdateEmitter.emit('commentsUpdated');
                        }
                    }
                }
            } catch (error) {
                console.error("Error fetching comments:", error);
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
