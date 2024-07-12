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

	// The command has been defined in the package.json file5
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	const main = vscode.commands.registerCommand('saucy.startSaucy', async () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		const gitController = new GitService();
		await gitController.init();
		await gitController.getRepositoryInfo();
		const branch = gitController.currentBranch;
		let mergeRequestID : string ;

		// user access token 'glpat-5Y_QwysY6Gjg2xStQLpz'
		// project id '34878733'
		const mrPing = setInterval(async () => {
			const mergeRequests = await getAllMRs(CONFIG_REPO_ID, CONFIG_USER_ACCESS_TOKEN);
			mergeRequests.forEach((element : any) => {
				if(element.source_branch === branch) {
					mergeRequestID = element.iid;
					clearInterval(mrPing);
				}
			});
		}, 1000);

		const commentsPing = setInterval(async () => {
			const comments = await currentMRNotes(CONFIG_REPO_ID, CONFIG_USER_ACCESS_TOKEN, mergeRequestID);
			comments.forEach((element : any) => {
				if(element.type === "DiffNote"){
					vscode.window.showInformationMessage(element.body);
				}
				
			});
		}, 1000);
	});

	const highlight = vscode.commands.registerCommand('saucy.highlight', async () => {
		console.log('highlight');
	});

	context.subscriptions.push(main);
	context.subscriptions.push(highlight);
};

// This method is called when your extension is deactivated
export const deactivate = (): void => { };
