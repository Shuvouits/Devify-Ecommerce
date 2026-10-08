import {
    Navigate,
    Outlet,
} from "react-router-dom";

import {
    useEffect,
    useState,
} from "react";

import api from "../../api/axios";

import {
    clearAuth,
    getDashboardPath,
    saveAuth,
} from "../../utils/auth";


const RoleRoute = ({ allowedRoles }) => {
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);


    useEffect(() => {
        let mounted = true;

        const verifyAuth = async () => {
            const token = localStorage.getItem("token");

            if (!token) {
                if (mounted) {
                    setLoading(false);
                }

                return;
            }

            try {
                const response = await api.get("/auth/me");

                const authenticatedUser =
                    response.data?.data?.user;

                if (!authenticatedUser) {
                    clearAuth();

                    if (mounted) {
                        setLoading(false);
                    }

                    return;
                }

                saveAuth(
                    token,
                    authenticatedUser
                );

                if (mounted) {
                    setUser(authenticatedUser);
                }

            } catch {
                clearAuth();

            } finally {
                if (mounted) {
                    setLoading(false);
                }
            }
        };


        verifyAuth();


        return () => {
            mounted = false;
        };

    }, []);


    /*
    |--------------------------------------------------------------------------
    | VERIFYING AUTH
    |--------------------------------------------------------------------------
    */

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-white">

                <div className="flex flex-col items-center gap-3">

                    <div className="h-8 w-8 animate-spin rounded-full border-[3px] border-[#dce6ff] border-t-[#286bd7]" />

                    <span className="text-[13px] text-[#7a8491]">
                        Checking account...
                    </span>

                </div>

            </div>
        );
    }


    /*
    |--------------------------------------------------------------------------
    | NOT LOGGED IN
    |--------------------------------------------------------------------------
    */

    if (!user) {
        return (
            <Navigate
                to="/login"
                replace
            />
        );
    }


    /*
    |--------------------------------------------------------------------------
    | WRONG ROLE
    |--------------------------------------------------------------------------
    */

    if (!allowedRoles.includes(user.role)) {
        return (
            <Navigate
                to={getDashboardPath(user.role)}
                replace
            />
        );
    }


    /*
    |--------------------------------------------------------------------------
    | AUTHORIZED
    |--------------------------------------------------------------------------
    */

    return <Outlet />;
};


export default RoleRoute;