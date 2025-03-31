"use server";
import { apiGet } from "@/utils/apiHandler";
import { fetchWithSession } from "@/utils/fetchWithSession";
// types
import { ActionResponse } from "@/types/generic";
import { Captain } from "@/types/types";

export const getCaptains = async (): Promise<ActionResponse<Captain[] | null>> => {
    const response = await fetchWithSession<null, Captain[]>(apiGet, `/api/service/user/captain`);
    return response;
};
