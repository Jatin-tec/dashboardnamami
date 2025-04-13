"use server";
import { apiGet } from "@/utils/apiHandler";
import { fetchWithSession } from "@/utils/fetchWithSession";
// types
import { ActionResponse } from "@/types/generic";
import { SubscriptionType, Service } from "@/types/types";

export const getServices = async (): Promise<ActionResponse<Service[] | null>> => {
    const response = await fetchWithSession<null, Service[]>(apiGet, `/api/service/services`);
    return response;
}

export const getServicesDetail = async (service_code: string): Promise<ActionResponse<Service | null>> => {
    const response = await fetchWithSession<null, Service>(apiGet, `/api/service/service/${service_code}`);
    return response;
}

export const getSubscriptions = async (): Promise<ActionResponse<SubscriptionType[] | null>> => {
    const response = await fetchWithSession<null, SubscriptionType[]>(apiGet, `/api/service/subscription-type`);
    return response;
};

export const getServicesId = async (id: string): Promise<ActionResponse<SubscriptionType | null>> => {
    const response = await fetchWithSession<null, SubscriptionType>(apiGet, `/api/service/subscription-type/${id}`);
    return response;
}
