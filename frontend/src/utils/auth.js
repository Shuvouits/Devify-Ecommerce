export const getDashboardPath = (role) => {
    switch (role) {
        case "admin":
            return "/admin";

        case "vendor":
            return "/vendor";

        case "customer":
            return "/account";

        default:
            return "/";
    }
};


export const saveAuth = (token, user) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
};


export const clearAuth = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
};


export const getStoredUser = () => {
    try {
        const user = localStorage.getItem("user");

        return user
            ? JSON.parse(user)
            : null;

    } catch {
        return null;
    }
};