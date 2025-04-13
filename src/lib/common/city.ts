"use server";
import { apiGet } from "@/utils/apiHandler";
import { fetchWithSession } from "@/utils/fetchWithSession";

import { cookies } from "next/headers";
// types
import { City } from "@/types/types";

export const getCitiesById = async ({ state_id }: { state_id: number }) => {
    const response = await fetchWithSession<null, City[]>(apiGet, `/api/service/cities/${state_id}`);
    return response;
}

export const getCities = async () => {
    const response = await fetchWithSession<null, City[]>(apiGet, `/api/service/accessible-cities/`, null, { next: { revalidate: 3600 } });
    return response;
}

export const setSelectedCity = async (city: City) => {
    const cookieStore = await cookies();
    cookieStore.set("selected_city", JSON.stringify(city));
}

export const getSelectedCity = async () => {
    const cookieStore = await cookies();
    const selected_city = cookieStore.get("selected_city");
    return selected_city ? JSON.parse(selected_city?.value) : { id: 0, name: "All" };
}
