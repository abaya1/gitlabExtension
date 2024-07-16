interface MergeRequestElement {
    source_branch: string;
    iid: string;
}
interface PositionType {
    base_sha: string;
    start_sha: string;
    head_sha: string;
    old_path: string;
    new_path: string;
    position_type: string;
    old_line?: number;
    new_line: number;
    line_range: {
        start: {
            line_code: string;
            type: string;
            old_line?: number;
            new_line: number;
        };
        end: {
            line_code: string;
            type: string;
            old_line?: number;
            new_line: number;
        };
    };
}

interface Author { 
    id: number;
    username: string;
    name: string;
    state: string;
    avatar_url: string;
    web_url: string;
}

interface MergeRequestComment {
    type: string;
    body: string;
    attachment: null;
    author: Author
    created_at: string;
    updated_at: string;
    system: boolean;
    noteable_id: number;
    noteable_type: string;
    project_id: number;
    commit_id: null;
    position: PositionType;
    resolvable: boolean;
    resolved: boolean;
    resolved_by: {
        id: number;
        username: string;
        name: string;
        state: string;
        locked: boolean;
        avatar_url: string;
        web_url: string;
    };
    resolved_at: string;
    confidential: boolean;
    internal: boolean;
    imported: boolean;
    imported_from: string;
    noteable_iid: number;
    commands_changes: {};
}