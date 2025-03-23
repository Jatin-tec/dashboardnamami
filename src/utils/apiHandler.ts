"use server";
import { HttpError } from "@/utils/customErrors";

const BASE_URL: string = process.env.SERVER_URL || "http://localhost:8000";

// Default headers for all requests
const DEFAULT_HEADERS: Readonly<Record<string, string>> = {
  cache: "no-store",
};

/**
 * Utility function to make API requests
 * @param endpoint - The API endpoint to call
 * @param options - Fetch options including method, headers, body, etc.
 * @param timeout - Timeout in milliseconds (default: 10000ms)
 * @returns A promise that resolves to the response data or custom status handling
 */
const apiRequest = async <ResponseType>(
  endpoint: string,
  options: RequestInit = {},
  timeout: number = 10000,
): Promise<ResponseType | null> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  const config: RequestInit = {
    ...options,
    headers: {
      ...DEFAULT_HEADERS,
      ...(options.headers || {}),
    },
    signal: controller.signal,
  };

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, config);

    if (!response.ok) {
      throw new HttpError(response.status, response.statusText, response.url);
    }

    if (response.status === 204) {
      return null;
    }

    return (await response.json()) as ResponseType;
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new Error("Request timed out");
    }
    if (error instanceof HttpError) {
      throw error;
    }
    throw new HttpError(500, "Internal Server Error", endpoint);
  } finally {
    clearTimeout(timeoutId);
  }
};

/**
 * Helper functions for specific HTTP methods
 */
const apiGet = async <ResponseType>(
  endpoint: string,
  options: RequestInit = {},
): Promise<ResponseType | null> => {
  return apiRequest<ResponseType>(endpoint, {
    method: "GET",
    ...options,
    headers: {
      ...options.headers,
      "Content-Type": "application/json",
    },
  });
};

const apiPost = async <RequestBody, ResponseType>(
  endpoint: string,
  body?: RequestBody,
  options: RequestInit = {},
): Promise<ResponseType | null> => {
  const isFormData = body instanceof FormData;
  return apiRequest<ResponseType>(endpoint, {
    method: "POST",
    body: isFormData ? body : JSON.stringify(body),
    ...options,
    headers: {
      ...options.headers,
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
    },
  });
};

const apiPut = async <RequestBody, ResponseType>(
  endpoint: string,
  body?: RequestBody,
  options: RequestInit = {},
): Promise<ResponseType | null> => {
  const isFormData = body instanceof FormData;
  return apiRequest<ResponseType>(endpoint, {
    method: "PUT",
    body: isFormData ? body : JSON.stringify(body),
    ...options,
    headers: {
      ...options.headers,
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
    },
  });
};

const apiDelete = async <ResponseType>(
  endpoint: string,
  options: RequestInit = {},
): Promise<ResponseType | null> => {
  return apiRequest<ResponseType>(endpoint, {
    method: "DELETE",
    ...options,
    headers: {
      ...options.headers,
      "Content-Type": "application/json",
    },
  });
};

export { apiGet, apiPost, apiPut, apiDelete };
