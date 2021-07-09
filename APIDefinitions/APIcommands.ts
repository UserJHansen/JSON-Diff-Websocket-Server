export enum Command {
    UNSET = -1,
    GET = 0,
    SET = 1,
}

export enum Area {
    Unset = -1,
    URL = 0,
    FullListStats = 1,
    Cookies = 2,
}

export interface APIcommand {
    command: number;
    area: number;
    value?: string | Array<string> | Array<number>;
}