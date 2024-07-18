export const CONFIG_NAME = 'saucy';

export const CONFIG: { BASE_URL: string } = {
    BASE_URL: 'https://gitlab.com/',
};

export enum API_ERRORS {
    GET_ALL_MERGE_REQUESTS = 'getAllMRs',
    CURRENT_MERGE_REQUEST_NOTES = 'currentMRNotes',
}

export enum LOG_LEVEL {
    Info,
    Warn,
    Error,
}

export const DEBUG_MODE = true;