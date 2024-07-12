import { workspace } from 'vscode';

export async function checkFileOpenInCurrentContext(file: string): Promise<boolean> {
    return workspace.textDocuments.some(doc => workspace.asRelativePath(doc.fileName) === file);
}