"use server";
import { apiGet, apiPost } from "@/utils/apiHandler";
import { fetchWithSession } from "@/utils/fetchWithSession";
// types
import { ActionResponse, FormFieldConfig } from "@/types/generic";
import { Customer } from "@/types/types";
import { revalidatePath } from "next/cache";


export const getCustomers = async (): Promise<ActionResponse<Customer[] | null>> => {
    const response = await fetchWithSession<null, Customer[]>(apiGet, `/api/service/user/customer`);
    return response;
};

export const getCustomerById = async (id: string): Promise<ActionResponse<Customer | null>> => {
    console.log('/api/service/user/${id}')
    const response = await fetchWithSession<null, Customer>(apiGet, `/api/service/user/${id}/`);
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
    const response = await fetchWithSession<CustomerRequest, Customer>(apiPost, `/api/service/user/customer/`, customer);
    revalidatePath(`/customers`);
    return response;
}

export const getFormFields = async () => {
    const response = await fetchWithSession<null, FormFieldConfig[]>(apiGet, `/api/auth/fields/customer`);
    return response;
}
