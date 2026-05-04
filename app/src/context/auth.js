import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        loadStoredUser();
        // logout()
    }, []);

    const loadStoredUser = async () => {
        try {
            const stored = await AsyncStorage.getItem("user");
            if (stored) {
                setUser(JSON.parse(stored));
            }
        } catch (err) {
            console.log("Load user error:", err);
        }
    };

    const login = async (data) => {
        try {
            await AsyncStorage.setItem("user", JSON.stringify(data));
            setUser(data);
        } catch (err) {
            console.log("Login storage error:", err);
        }
    };

    const loginUserwithoutremember = (data) => {
        setUser(data);
    };

    const logout = async () => {
        try {
            await AsyncStorage.removeItem("user");
            setUser(null);
        } catch (err) {
            console.log("Logout error:", err);
        }
    };

    return (
        <AuthContext.Provider
            value={{ user, login, loginUserwithoutremember, logout, setUser }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used inside AuthProvider");
    return context;
};
