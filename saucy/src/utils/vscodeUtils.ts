import { workspace } from 'vscode';
import { log } from '../models/system/logger';
import { CONFIG_NAME } from '../shared/constants';

export function loadFile(file: string) {
    const fs = require('fs');
    const path = require('path');
    const rawData = fs.readFileSync(path.join(__dirname, '..', '..', file));
    return JSON.parse(rawData);
}

export async function checkFileOpenInCurrentContext(file: string): Promise<boolean> {
    return workspace.textDocuments.some(doc => workspace.asRelativePath(doc.fileName) === file);
}

export function getRepoId(): string {
    const repoId = workspace.getConfiguration(CONFIG_NAME).get<string>('repoID');
    if (repoId === undefined) {
        log.warn("Repo ID is not defined.");
        return '';
    }
    return repoId;
}

export function getUserAccessToken(): string {
    const accessToken = workspace.getConfiguration(CONFIG_NAME).get<string>('userAccessToken');
    if (accessToken === undefined) {
        log.warn("User access token is not defined.");
        return '';
    }
    return accessToken;
}