"use server";
import { apiGet } from "@/utils/apiHandler";
import { fetchWithSession } from "@/utils/fetchWithSession";
// types
import { State } from "@/types/types";

export const getStates = async () => {
    const response = await fetchWithSession<null, State[]>(apiGet, `/api/service/states`);
    return response;
}
