import { HttpError } from "@/utils/customErrors";

// E extends new (message?: string) => Error
export async function catchError<T>(
    promise: Promise<T>,
    // errorsToCatch?: E[]
): Promise<[{ status?: number; message: string } | null, T | null]> {
    try {
        const response = await promise;
        return [null, response];
    } catch (error) {
        if (
            error instanceof HttpError
            // ||
            // errorsToCatch?.some((e) => error instanceof e)
        ) {
            return [
                {
                    status: error.status || 500,
                    message: error.message,
                },
                null,
            ];
        }
        throw error; // Re-throw if not an expected error
    }
}
