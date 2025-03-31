import { JWTPayload } from "jose";
import { UserResponse } from "@/types/types";

export interface ActionResponse<Data> {
    message: string;
    code: number;
    status: "success" | "error";
    data: Data | null;
}

export interface PagenatedResponse<T> {
    count: number;
    next: string | null;
    previous: string | null;
    results: T[];
}


export interface Session extends JWTPayload {
    user: UserResponse["user"];
    tokens: UserResponse["tokens"];
}

export interface FormFieldConfig {
    field_name: string;
    api_value: string;
    field_type: string;
    help_text: string | null;
    is_required: boolean;
    applicable_roles: number[];
    show_in_list: boolean;
    options: Array<{ value: string; label: string }>;
}
