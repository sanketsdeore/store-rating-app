import { jwtDecode } from "jwt-decode";
import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext<any>(null);

export function AuthProvider({
    children
}: {
    children: React.ReactNode
}) {
    const [token, setToken] = useState(localStorage.getItem("token"));

    const user: any = token ? jwtDecode(token) : null;

    const login = (token: string) => {
        localStorage.setItem("token", token);
        setToken(token);
    }

    const logout = () => {
        localStorage.removeItem("token");
        setToken(null);
    }

    return (
        <AuthContext.Provider
            value={{
                token,
                user,
                login,
                logout
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    return useContext(AuthContext);
}