import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";

export function useAuth() {
    const {
        user, loading, signup, login, logout, setUser,
        bannedUntil, isBanned
    } =
        useContext(AuthContext);
    return {
        user,
        loading,
        isLoggedIn: !!user && !loading,
        isBanned,
        bannedUntil,
        signup,
        login,
        logout,
        setUser,
    };
}
