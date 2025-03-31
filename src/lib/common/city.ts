"use server";
import { apiGet } from "@/utils/apiHandler";
import { fetchWithSession } from "@/utils/fetchWithSession";
// types
import { City } from "@/types/types";

export const getCities = async ({ state_id }: {state_id: number}) => {
    const response = await fetchWithSession<null, City[]>(apiGet, `/api/service/cities/${state_id}`);
    return response;
}
