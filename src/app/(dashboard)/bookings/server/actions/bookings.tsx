"use server";
import { apiGet } from "@/utils/apiHandler";
import { fetchWithSession } from "@/utils/fetchWithSession";
// types
import { ActionResponse } from "@/types/generic";
import { Booking, Captain, Customer, SubscriptionType } from "@/types/types";

export const getBookings = async (): Promise<ActionResponse<Booking[] | null>> => {
    const response = await fetchWithSession<null, Booking[]>(apiGet, `/api/service/bookings/`);
    return response;
};

export const getBookingsById = async (id: string): Promise<ActionResponse<Booking | null>> => {
    const response = await fetchWithSession<null, Booking>(apiGet, `/api/service/booking/${id}`);
    return response;
}

export const getSubscriptions = async (selectedCity: string): Promise<ActionResponse<SubscriptionType[] | null>> => {
    const response = await fetchWithSession<null, SubscriptionType[]>(apiGet, `/api/service/subscription-type/city/${selectedCity}`);
    return response;
};

export const getCustomers = async (selectedCity: string): Promise<ActionResponse<Customer[] | null>> => {
    const response = await fetchWithSession<null, Customer[]>(apiGet, `/api/service/user/customer/city/${selectedCity}`)
    return response;
};

export const getCaptains = async (selectedCity: string): Promise<ActionResponse<Captain[] | null>> => {
    const response = await fetchWithSession<null, Captain[]>(apiGet, `/api/service/user/captain/city/${selectedCity}`);
    return response;
};