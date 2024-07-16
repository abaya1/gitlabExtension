import * as vscode from 'vscode';
import { GitService } from './services/git/git.service';
import { GitLabService } from './services/gitlab/gitlab.service';
import { CONFIG_REPO_ID, CONFIG_USER_ACCESS_TOKEN } from './shared/constants';
import { DocumentDecorator } from './models/editor/decorator';
import { EventEmitter } from 'events';

// user access token 'glpat-5Y_QwysY6Gjg2xStQLpz'
// project id '34878733'

const commentsUpdateEmitter = new EventEmitter();

export const activate = async (context: vscode.ExtensionContext): Promise<void> => {

    console.log('Congratulations, your extension "saucy" is now active!');
    const gitController = new GitService();
    await gitController.init(context.subscriptions);
    let branch: string | undefined = '';
    let commentsList = new Map<string, { resolved: string; position: PositionType }>();
    let processComments = false;

    const gitLabService = new GitLabService(CONFIG_REPO_ID, CONFIG_USER_ACCESS_TOKEN);

    const main = vscode.commands.registerCommand('saucy.startSaucy', async () => {
        let mergeRequestID: string = '';

        (async function pingMergeRequest() {
            try {
                const mergeRequests = await gitLabService.getAllMRs();
                if (mergeRequests && mergeRequests !== "getAllMRsAPIEPICFAIL") {
                    await gitController.getRepositoryInfo();
                    if (branch !== gitController.currentBranch) {
                        branch = gitController.currentBranch;
                        mergeRequestID = '';
                        commentsList.clear();
                    }
                    console.log('Branch:', branch);
                    mergeRequests.forEach((element: any) => {
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
                    if (comments && comments.length > 0 && comments !== "currentMRNotesAPIEPICFAIL") {
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
                                        commentsList.set(element.id, { resolved: element.resolved, position: element.position });
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
        if (!editor) {return;}
        const relativePath = vscode.workspace.asRelativePath(editor.document.uri.fsPath);
        
        const commentsPerFile = Array.from(commentsList.entries()).filter(comment => comment[1].position.new_path === relativePath);
        
        commentsPerFile.forEach(comment => {
                DocumentDecorator.decorate(comment[1].position.line_range.start.new_line, comment[1].position.line_range.end.new_line);
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
