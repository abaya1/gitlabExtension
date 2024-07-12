import * as vscode from 'vscode';

export const CONFIG_NAME = 'saucy';
export const CONFIG_REPO_ID: string = `${vscode.workspace.getConfiguration(CONFIG_NAME).get('repoID')}`;
export const CONFIG_USER_ACCESS_TOKEN: string = `${vscode.workspace.getConfiguration(CONFIG_NAME).get('userAccessToken')}`;

// All the plugin settings
export const CONFIG: { BASE_URL: string } = {
    BASE_URL: 'https://gitlab.com/',
};
