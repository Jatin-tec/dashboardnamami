"use server";
import { cookies } from "next/headers";
import { encrypt, decrypt } from "@/utils/auth";
import { apiPost } from "@/utils/apiHandler";
import { catchError } from "@/utils/catchError";
import { UserResponse } from "@/types/types";

interface loginForm {
    email: string,
    password: string
}

export async function login(formData: loginForm) {
    const user = {
        email: formData.email,
        password: formData.password,
    };
    const [error, response] = await catchError(apiPost<loginForm, UserResponse>("/api/auth/login/", user));
    console.log(error, response, 'error, response');
    if (error) return { message: error.status === 401 ? "Invalid email or password" : error.message, status: "destructive" };
    if (response) {
        const cookieStore = await cookies();
        const expires = new Date(Date.now() + 1000 * 60 * 60 * 24 * 365);
        const session = await encrypt(response);
        cookieStore.set({
            name: "session",
            value: session,
            httpOnly: true,
            expires,
        });
        return { message: "Login successful", status: "success" };
    }
    return { message: "An error occurred", status: "destructive" };
}

export async function getSession() {
    const cookieStore = await cookies();
    const session = cookieStore.get("session")?.value;
    if (!session) return null;
    return await decrypt(session);
}

export async function logout() {
    const cookieStore = await cookies();
    cookieStore.set({
        name: "session",
        value: "",
        maxAge: 0,
    });
}
