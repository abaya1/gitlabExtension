import * as vscode from 'vscode';
import { GitService } from './git/git.service';
import { currentMRNotes, getAllMRs } from './gitLabPing';
import { CONFIG_REPO_ID, CONFIG_USER_ACCESS_TOKEN } from './shared/constants';

export const activate = async (context: vscode.ExtensionContext): Promise<void> => {

	console.log('Congratulations, your extension "saucy" is now active!');
	const gitController = new GitService();
	await gitController.init(context.subscriptions);
	let branch : string | undefined = ''
	let commentsList = new Map<string, {resolved: string, position: {}}> 

	const main = vscode.commands.registerCommand('saucy.startSaucy', async () => {
		let mergeRequestID : string = '' ;

		const mrPing = setInterval(async () => {
			const mergeRequests = await getAllMRs(CONFIG_REPO_ID, CONFIG_USER_ACCESS_TOKEN);
			console.log(commentsList)
			if(mergeRequests &&mergeRequests!=="getAllMRsAPIEPICFAIL"){
				await gitController.getRepositoryInfo();
				if(branch != gitController.currentBranch ) {
					branch = gitController.currentBranch;
					mergeRequestID = ''
					commentsList.clear();
				} 
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
									vscode.window.showInformationMessage('you have received a new comment 🤨')
									commentsList.set(element.id, {resolved: element.resolved, position: element.position})
								}
							} 
						}
					});
				}
			}
		}, 10000);
	});

	context.subscriptions.push(main);
};

// This method is called when your extension is deactivated
export const deactivate = (): void => { };
