"use server";
import { apiGet } from "@/utils/apiHandler";
import { fetchWithSession } from "@/utils/fetchWithSession";
// types
import { ActionResponse } from "@/types/generic";
import { User } from "@/types/types";

export const getCaptains = async (): Promise<ActionResponse<User[] | null>> => {
    const response = await fetchWithSession<null, User[]>(apiGet, `/api/service/user/captain`);
    return response;
};
