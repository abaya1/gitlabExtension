import * as vscode from 'vscode';

export class DocumentDecorator {
   
    private _editor: vscode.TextEditor | undefined;

    public decorate(startLine: number, endLine: number): void {
        this._editor = vscode.window.activeTextEditor;

        if(!this._editor || startLine <= 0 || endLine <= 0) {
            return;
        }
        const range = new vscode.Range(startLine - 1 , 0 , endLine - 1, Number.MAX_VALUE);

        const highlightDecoration = vscode.window.createTextEditorDecorationType(<vscode.DecorationRenderOptions>{
            backgroundColor: 'rgba(123, 45, 67, 0.8)', //TODO get colors from settings
            isWholeLine : true
        });

        this._editor.setDecorations(highlightDecoration, [range]);
    }


}