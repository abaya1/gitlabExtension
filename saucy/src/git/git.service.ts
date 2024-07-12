import * as vscode from 'vscode';
import { API, GitExtension, Repository } from './git';

export class GitService {
    private _gitApi: API | undefined;
    private _currentBranch: string | undefined;

    public async init(): Promise<void> {
        this._gitApi = await this._getGitAPI();
        this._currentBranch = await this._getCurrentBranch();
        this._gitApi.onDidChangeState(() => {
            console.log('changed-------')
        })
    }

    public async getRepositoryInfo(): Promise<Repository | undefined> {
        if (this._gitApi === undefined) {
            return;
        }
        const uri = await this._gitApi.repositories[0];
        console.log(uri);
        return;
    }

    private async _getGitAPI(): Promise<API> {
        if (!this._gitApi) {
			const gitExtension = vscode.extensions.getExtension<GitExtension>('vscode.git')!.exports;
			const onDidChangeGitExtensionEnablement = (enabled: boolean) => {
				this._gitApi = enabled ? gitExtension.getAPI(1) : undefined;
			};

			gitExtension.onDidChangeEnablement(onDidChangeGitExtensionEnablement);
			onDidChangeGitExtensionEnablement(gitExtension.enabled);

			if (!this._gitApi) {
				throw new Error('vscode.git extension is not enabled.');
			}
		}

		return this._gitApi;
    }

    private async _getCurrentBranch(): Promise<string | undefined> {
        if (this._gitApi === undefined) {
            return;
        }
        return this._gitApi.repositories[0]?.state?.HEAD?.name;
    }

    get currentBranch(): string | undefined {
        return this._currentBranch;
    }
}