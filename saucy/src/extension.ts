// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { GitService } from './git/git.service';
import { currentMRNotes, getAllMRs } from './gitLabPing';
import { CONFIG_REPO_ID, CONFIG_USER_ACCESS_TOKEN } from './shared/constants';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export const activate = async (context: vscode.ExtensionContext): Promise<void> => {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "saucy" is now active!');
	const gitController = new GitService();
	await gitController.init(context.subscriptions);

	// The command has been defined in the package.json file5
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	const main = vscode.commands.registerCommand('saucy.startSaucy', async () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
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
						if(element.type === "DiffNote"){
							vscode.window.showInformationMessage(element.body);
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
