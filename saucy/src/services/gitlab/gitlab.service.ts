import axios from "axios";
import { ApiErrors, CONFIG } from "../../shared/constants";

export class GitLabService {
    private _baseUrl: string;
    private _userAccessToken: string;
    private _projectId: string;

    constructor(projectId: string, userAccessToken: string) {
        this._baseUrl = `${CONFIG.BASE_URL}/api/v4`;
        this._userAccessToken = userAccessToken;
        this._projectId = projectId;
    }

    public async getAllMRs(): Promise<any> {
        try {
            const response = await axios.get(`${this._baseUrl}/projects/${this._projectId}/merge_requests?state=opened`, {
                headers: {'PRIVATE-TOKEN': this._userAccessToken}
            });
            if(response && response.data) {
                console.log("Getting MRs");
                return response.data;
            }
        } catch (error) {
            console.error("Failed to get all Merge Requests", error);
            throw new Error(ApiErrors.getAllMRs);
        }
    }

    public async currentMRNotes(mergeRequestId: string): Promise<any> {
        try {
            const response = await axios.get(`${this._baseUrl}/projects/${this._projectId}/merge_requests/${mergeRequestId}/notes`, {
                headers: {'PRIVATE-TOKEN': this._userAccessToken}
            });
            if(response && response.data) {
                console.log("Getting current MR Notes");
                return response.data;
            }
        } catch (error) {
            console.error("Failed to get current MR Notes", error);
            throw new Error(ApiErrors.currentMRNotes);
        }
    }
}
