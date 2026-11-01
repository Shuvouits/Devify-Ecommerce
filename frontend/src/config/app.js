const ENV_API_URL =
    import.meta.env.VITE_API_BASE_URL;

if (!ENV_API_URL) {
    throw new Error(
        "VITE_API_BASE_URL is not defined in frontend .env"
    );
}

export const API_BASE_URL =
    ENV_API_URL.replace(/\/+$/, "");

export const BACKEND_URL =
    API_BASE_URL.replace(/\/api$/, "");