import axios from "axios";
import { log } from "../../models/system/logger";
import { API_ERRORS, CONFIG, DEBUG_MODE } from "../../shared/constants";
import { loadFile } from "../../utils/vscodeUtils";

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
        if (DEBUG_MODE) {
            log.debug("Getting sample MRs");
            return loadFile('mocks/sampleMRs.json');
        }
        try {
            const response = await axios.get(`${this._baseUrl}/projects/${this._projectId}/merge_requests?state=opened`, {
                headers: {'PRIVATE-TOKEN': this._userAccessToken}
            });
            if(response && response.data) {
                return response.data;
            }
        } catch (error) {
            log.error("Failed to get all Merge Requests", error);
            throw new Error(API_ERRORS.GET_ALL_MERGE_REQUESTS);
        }
    }

    public async currentMRNotes(mergeRequestId: string): Promise<any> {
        if (DEBUG_MODE) {
            log.debug("Getting sample MR Notes");
            return loadFile('mocks/sampleMR-Notes.json');
        }
        try {
            const response = await axios.get(`${this._baseUrl}/projects/${this._projectId}/merge_requests/${mergeRequestId}/notes`, {
                headers: {'PRIVATE-TOKEN': this._userAccessToken}
            });
            if(response && response.data) {
                return response.data;
            }
        } catch (error) {
            log.error("Failed to get current MR Notes", error);
            throw new Error(API_ERRORS.CURRENT_MERGE_REQUEST_NOTES);
        }
    }
}
