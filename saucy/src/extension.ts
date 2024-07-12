import * as vscode from 'vscode';
import { GitService } from './git/git.service';
import { currentMRNotes, getAllMRs } from './gitLabPing';
import { CONFIG_REPO_ID, CONFIG_USER_ACCESS_TOKEN } from './shared/constants';
import { DocumentDecorator } from './models/editor/decorator';

export const activate = async (context: vscode.ExtensionContext): Promise<void> => {

	console.log('Congratulations, your extension "saucy" is now active!');
	const gitController = new GitService();
	await gitController.init(context.subscriptions);
	let commentsList = new Map<string, {resolved: string, lines: {} }> 

	const main = vscode.commands.registerCommand('saucy.startSaucy', async () => {
		let mergeRequestID : string = '' ;

		const mrPing = setInterval(async () => {
			const mergeRequests = await getAllMRs(CONFIG_REPO_ID, CONFIG_USER_ACCESS_TOKEN);

			if(mergeRequests &&mergeRequests!=="getAllMRsAPIEPICFAIL"){
				await gitController.getRepositoryInfo();
				const branch = gitController.currentBranch;
				console.log(branch);
				console.log(mergeRequests);
				mergeRequests.forEach((element : any) => {
					if(element.source_branch === branch) {
						mergeRequestID = element.iid;
					}
				});
			}

		}, 10000);

		const commentsPing = setInterval(async () => {
			if(mergeRequestID != '') {
				const comments = await currentMRNotes(CONFIG_REPO_ID, CONFIG_USER_ACCESS_TOKEN, mergeRequestID);
				console.log(comments);
				if(comments && comments.length >0 && comments!=="currentMRNotesAPIEPICFAIL"){
					comments && comments.forEach((element : any) => {
						if(element.type === "DiffNote" && element.resolvable){
							if(element.resolved && commentsList.has(element.id)) {
							    commentsList.delete(element.id);
							}
							else {
								if(!commentsList.has(element.id)) {
									//display toast
									commentsList.set(element.id, {resolved: element.resolved, lines: element.line_range})
								}
							} 
						}
					});
				}
			}
		}, 10000);
	});

	const highlight = vscode.commands.registerCommand('saucy.highlight', async () => {
		const decorator = new DocumentDecorator();
		//decorator.decorate(1, 10);
	});


	context.subscriptions.push(main);
	context.subscriptions.push(highlight);
};

// This method is called when your extension is deactivated
export const deactivate = (): void => { };
