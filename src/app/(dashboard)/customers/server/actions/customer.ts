"use server";
import { apiGet, apiPost } from "@/utils/apiHandler";
import { fetchWithSession } from "@/utils/fetchWithSession";
// types
import { ActionResponse } from "@/types/generic";
import { Customer } from "@/types/types";

export const getCustomers = async (): Promise<ActionResponse<Customer[] | null>> => {
    const response = await fetchWithSession<null, Customer[]>(apiGet, `/api/service/customer`);
    return response;
};

export const getCustomerById = async (id: string): Promise<ActionResponse<Customer | null>> => {
    const response = await fetchWithSession<null, Customer>(apiGet, `/api/service/customer/${id}`);
    return response;
}

interface CustomerRequest {
    name: string;
    email: string;
    phone_number: string;
    state: string;
    city: string;
    address: string;
}

export const createCustomer = async (customer: CustomerRequest): Promise<ActionResponse<Customer | null>> => {
    const response = await fetchWithSession<CustomerRequest, Customer>(apiPost, `/api/service/customer`, customer);
    return response;
}