// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { GitService } from './git/git.service';

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
		vscode.window.showInformationMessage(`The current branch is ${gitController.currentBranch}`);
	});

	context.subscriptions.push(main);
};

// This method is called when your extension is deactivated
export const deactivate = (): void => { };
