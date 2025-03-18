export interface UserResponse {
    user: {
        name: string;
        email: string;
        role: string;
        phone_number: string;
    };
    tokens: {
        access: string;
        refresh: string;
    };
}
