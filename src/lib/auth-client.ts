import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
    baseURL: "https://annashah-physical-ai-auth.hf.space"
});

export const getSessionToken = async () => {
    // 1. Try to get from active session (cookies)
    try {
        const session = await authClient.getSession();
        if (session.data?.session?.token) {
            return session.data.session.token;
        }
    } catch (e) {
        // Ignore error, try fallback
    }

    // 2. Fallback to localStorage
    if (typeof localStorage !== 'undefined') {
        return localStorage.getItem('auth_token');
    }

    return null;
};
