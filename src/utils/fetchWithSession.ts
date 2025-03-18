import { getSession, logout } from "@/lib/auth/session";
import { ActionResponse } from "@/types/generic";
import { catchError } from "@/utils/catchError";
import { apiPost, apiPut } from "./apiHandler";

type RequestFunction<Body, Response> =
    | ((endpoint: string, options?: RequestInit) => Promise<Response | null>)
    | ((
        endpoint: string,
        body?: Body,
        options?: RequestInit,
    ) => Promise<Response | null>);

export async function fetchWithSession<Body = undefined, Data = unknown>(
    requestFunction: RequestFunction<Body, Data>,
    endpoint: string,
    body?: Body,
    options: RequestInit = {},
): Promise<ActionResponse<Data | null>> {
    const session = await getSession();
    if (!session) {
        return {
            message: "User not logged in",
            code: 401,
            status: "error",
            data: null,
        };
    }

    // Dynamically determine the arguments based on the function signature
    const isBodyRequired =
        requestFunction === apiPost || requestFunction === apiPut;
    const headers = {
        ...options.headers,
        Authorization: `Bearer ${session.tokens.access}`,
    };

    const [error, data] = await catchError(
        isBodyRequired
            ? (
                requestFunction as (
                    endpoint: string,
                    body: Body,
                    options?: RequestInit,
                ) => Promise<Data | null>
            )(endpoint, body!, { ...options, headers })
            : (
                requestFunction as (
                    endpoint: string,
                    options?: RequestInit,
                ) => Promise<Data | null>
            )(endpoint, {
                ...options,
                headers,
            }),
    );

    if (error) {
        // if (error.status === 401) logout();
        return {
            message: error.message,
            code: error.status ?? 500,
            status: "error",
            data: null,
        };
    }

    return {
        message: "Request successful",
        code: 200,
        status: "success",
        data,
    };
}
