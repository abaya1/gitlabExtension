import * as vscode from 'vscode';

const highlightDecoration = vscode.window.createTextEditorDecorationType({
    backgroundColor: new vscode.ThemeColor('editor.findMatchBackground'),
    overviewRulerLane: vscode.OverviewRulerLane.Full,
	rangeBehavior: vscode.DecorationRangeBehavior.OpenOpen,
    isWholeLine: true,
});

//TODO not painting for multiple comments on same file
export class DocumentDecorator {
    private static _decoratedEditors = new Map<vscode.TextEditor, vscode.DecorationOptions[]>();

    public static decorate(startLine: number, endLine: number, textContent: string): void {
        const activeEditor = vscode.window.activeTextEditor;
        if (!activeEditor || startLine <= 0 || endLine <= 0) {
            return;
        }

        const range = new vscode.Range(startLine - 1, 0, endLine - 1, Number.MAX_VALUE);
        const decorationOption: vscode.DecorationOptions = {
            range,
            hoverMessage: textContent,
            //renderOptions: {}
        };

        const existingDecorations = this._decoratedEditors.get(activeEditor) || [];
        existingDecorations.push(decorationOption);
        this._decoratedEditors.set(activeEditor, existingDecorations);

        activeEditor.setDecorations(highlightDecoration, existingDecorations);
    }

    public static removeDecorations(): void {
        this._decoratedEditors.forEach((_, editor) => {
            editor.setDecorations(highlightDecoration, []);
            this._decoratedEditors.delete(editor);
        });
    }
}
