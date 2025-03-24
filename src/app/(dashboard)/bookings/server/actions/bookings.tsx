"use server";
import { apiGet } from "@/utils/apiHandler";
import { fetchWithSession } from "@/utils/fetchWithSession";
// types
import { ActionResponse } from "@/types/generic";
import { Booking } from "@/types/types";

export const getBookings = async (): Promise<ActionResponse<Booking[] | null>> => {
    const response = await fetchWithSession<null, Booking[]>(apiGet, `/api/service/bookings`);
    return response;
};

export const getBookingsById = async (id: string): Promise<ActionResponse<Booking | null>> => {
    const response = await fetchWithSession<null, Booking>(apiGet, `/api/service/booking/${id}`);
    return response;
}
