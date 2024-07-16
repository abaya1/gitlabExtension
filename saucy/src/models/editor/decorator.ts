import * as vscode from 'vscode';

const highlightDecoration = vscode.window.createTextEditorDecorationType({
    backgroundColor: 'rgba(123, 45, 67, 0.8)',
    isWholeLine: true,
});

//TODO not painting for multiple comments on same file
export class DocumentDecorator {
    private static _decoratedEditors = new Set<vscode.TextEditor>();

    public static decorate(startLine: number, endLine: number): void {
        const activeEditor = vscode.window.activeTextEditor;
        if (!activeEditor || startLine <= 0 || endLine <= 0) {
            return;
        }

        const range = new vscode.Range(startLine - 1, 0, endLine - 1, Number.MAX_VALUE);

        activeEditor.setDecorations(highlightDecoration, [range]);

        DocumentDecorator._decoratedEditors.add(activeEditor);
    }

    public static removeDecorations(): void {
        DocumentDecorator._decoratedEditors.forEach(editor => {
            editor.setDecorations(highlightDecoration, []);
        });
        // DocumentDecorator._decoratedEditors.clear();
    }
}


