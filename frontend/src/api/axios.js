import axios from "axios";

/*
|--------------------------------------------------------------------------
| API BASE URL
|--------------------------------------------------------------------------
*/

const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL ||
    "http://127.0.0.1:8000/api";


/*
|--------------------------------------------------------------------------
| AXIOS INSTANCE
|--------------------------------------------------------------------------
*/

const api = axios.create({
    baseURL: API_BASE_URL,

    headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
    },
});


/*
|--------------------------------------------------------------------------
| REQUEST INTERCEPTOR
|--------------------------------------------------------------------------
|
| Every request will automatically include the JWT token.
|
*/

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },

    (error) => {
        return Promise.reject(error);
    }
);


/*
|--------------------------------------------------------------------------
| TOKEN REFRESH
|--------------------------------------------------------------------------
*/

let refreshPromise = null;

const refreshAccessToken = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
        throw new Error("No authentication token found.");
    }

    if (!refreshPromise) {
        refreshPromise = axios
            .post(
                `${API_BASE_URL}/auth/refresh`,
                {},
                {
                    headers: {
                        Accept: "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            )
            .then((response) => {
                const newToken =
                    response.data?.data?.access_token;

                if (!newToken) {
                    throw new Error(
                        "New access token was not returned."
                    );
                }

                localStorage.setItem(
                    "token",
                    newToken
                );

                return newToken;
            })
            .finally(() => {
                refreshPromise = null;
            });
    }

    return refreshPromise;
};


/*
|--------------------------------------------------------------------------
| RESPONSE INTERCEPTOR
|--------------------------------------------------------------------------
|
| If access token becomes invalid/expired:
|
| 1. Try refresh once
| 2. Save new JWT
| 3. Retry original request
| 4. If refresh fails, remove authentication data
|
*/

api.interceptors.response.use(
    (response) => {
        return response;
    },

    async (error) => {
        const originalRequest = error.config;

        const status =
            error.response?.status;

        if (
            status === 401 &&
            originalRequest &&
            !originalRequest._retry
        ) {
            /*
            |--------------------------------------------------------------------------
            | Do not refresh these authentication requests
            |--------------------------------------------------------------------------
            */

            const excludedRoutes = [
                "/auth/login",
                "/auth/register",
                "/auth/forgot-password",
                "/auth/reset-password",
                "/auth/refresh",
            ];

            const isExcludedRoute =
                excludedRoutes.some((route) =>
                    originalRequest.url?.includes(route)
                );

            if (isExcludedRoute) {
                return Promise.reject(error);
            }

            originalRequest._retry = true;

            try {
                const newToken =
                    await refreshAccessToken();

                originalRequest.headers.Authorization =
                    `Bearer ${newToken}`;

                return api(originalRequest);
            } catch (refreshError) {
                localStorage.removeItem("token");

                return Promise.reject(
                    refreshError
                );
            }
        }

        return Promise.reject(error);
    }
);


export default api;