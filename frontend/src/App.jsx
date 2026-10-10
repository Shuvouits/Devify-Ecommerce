import { Routes, Route, Navigate } from "react-router-dom";

import FrontendLayout from "./layouts/frontend/FrontendLayout";
import CustomerLayout from "./layouts/customer/CustomerLayout";
import AdminLayout from "./layouts/admin/AdminLayout";
import VendorLayout from "./layouts/vendor/VendorLayout";
import AdminSettingsLayout from "./layouts/settings/AdminSettingsLayout";

import RoleRoute from "./components/auth/RoleRoute";
import ScrollToTop from "./components/common/ScrollToTop";

import Home from "./pages/frontend/Home";
import NotFound from "./pages/frontend/NotFound";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import SocialLoginCallback from "./pages/auth/SocialLoginCallback";

import CustomerDashboard from "./layouts/customer/Dashboard";
import AdminDashboard from "./layouts/admin/Dashboard";
import VendorDashboard from "./layouts/vendor/Dashboard";

import EmailSettings from "./pages/admin/settings/EmailSettings";
import SocialLoginSettings from "./pages/admin/settings/social-login/SocialLoginSettings";

const App = () => {
    return (
        <>
            <ScrollToTop />
            <Routes>
                {/* FRONTEND / PUBLIC */}
                <Route element={<FrontendLayout />}>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/reset-password" element={<ResetPassword />} />

                    {/* Google OAuth Callback */}
                    <Route path="/auth/social/callback" element={<SocialLoginCallback />} />

                    {/* CUSTOMER */}
                    <Route element={<RoleRoute allowedRoles={["customer"]} />}>
                        <Route path="/account" element={<CustomerLayout />}>
                            <Route index element={<CustomerDashboard />} />
                        </Route>
                    </Route>

                    {/* 404 */}
                    <Route path="*" element={<NotFound />} />
                </Route>

                {/* ADMIN */}
                <Route element={<RoleRoute allowedRoles={["admin"]} />}>
                    {/* Admin Dashboard Workspace */}
                    <Route path="/admin" element={<AdminLayout />}>
                        <Route index element={<Navigate to="/admin/dashboard" replace />} />
                        <Route path="dashboard" element={<AdminDashboard />} />
                    </Route>

                    {/* Admin Settings Workspace */}
                    <Route path="/admin/settings" element={<AdminSettingsLayout />}>
                        <Route index element={<Navigate to="/admin/settings/email" replace />} />
                        <Route path="email" element={<EmailSettings />} />
                        <Route path="social-login" element={<SocialLoginSettings />} />
                    </Route>
                </Route>

                {/* VENDOR */}
                <Route element={<RoleRoute allowedRoles={["vendor"]} />}>
                    <Route path="/vendor" element={<VendorLayout />}>
                        <Route index element={<VendorDashboard />} />
                    </Route>
                </Route>
            </Routes>
        </>
    );
};

export default App;