export interface ActionResponse<Data> {
    message: string;
    code: number;
    status: "success" | "error";
    data: Data | null;
}

export interface PagenatedResponse<T> {
    count: number;
    next: string | null;
    previous: string | null;
    results: T[];
}
