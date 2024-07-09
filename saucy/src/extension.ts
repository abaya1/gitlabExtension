// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import axios from 'axios';
import * as vscode from 'vscode';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export const activate = async (context: vscode.ExtensionContext): Promise<void> => {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "saucy" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	const disposable = vscode.commands.registerCommand('saucy.helloWorld', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		vscode.window.showInformationMessage('Hello Tariq!');
	});

	const getDateToast = vscode.commands.registerCommand('saucy.getDateToast', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		const date = Date();

		vscode.window.showInformationMessage(`The date is ${date}`);
	});

	context.subscriptions.push(disposable);
	
	axios.get("qewf;owqheilkcl");

	context.subscriptions.push(getDateToast);
};

// This method is called when your extension is deactivated
export const deactivate = (): void => { };
