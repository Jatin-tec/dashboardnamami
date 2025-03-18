/**
 * Custom error class to handle HTTP errors
 */
export class HttpError extends Error {
    status: number;
    statusText: string;
    url: string;

    constructor(status: number, statusText: string, url: string) {
        super(`HTTP Error: ${status} ${statusText} for URL ${url}`);
        this.status = status;
        this.statusText = statusText;
        this.url = url;
    }
}
