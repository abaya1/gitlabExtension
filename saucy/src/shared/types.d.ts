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

interface MergeRequestElement {
    source_branch: string;
    iid: string;
}