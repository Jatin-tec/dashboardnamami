"use server";
import { apiGet } from "@/utils/apiHandler";
import { fetchWithSession } from "@/utils/fetchWithSession";
// types
import { ActionResponse } from "@/types/generic";
import { SubscriptionType } from "@/types/types";

export const getSubscriptions = async (): Promise<ActionResponse<SubscriptionType[] | null>> => {
    const response = await fetchWithSession<null, SubscriptionType[]>(apiGet, `/api/service/subscription-type`);
    return response;
};

export const getServicesId = async (id: string): Promise<ActionResponse<SubscriptionType | null>> => {
    const response = await fetchWithSession<null, SubscriptionType>(apiGet, `/api/service/subscription-type/${id}`);
    return response;
}
