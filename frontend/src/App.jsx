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
import Profile from "./pages/profile/Profile";
import TwoFactorChallenge from "./pages/auth/TwoFactorChallenge";
import AiConfiguration from "./pages/admin/settings/AiConfiguration";
import BrandIndex from "./pages/admin/brands/BrandIndex";
import BrandCreate from "./pages/admin/brands/BrandCreate";
import BrandEdit from "./pages/admin/brands/BrandEdit";
import CategoryCreate from "./pages/admin/categories/CategoryCreate";
import CategoryIndex from "./pages/admin/categories/CategoryIndex";
import CategoryEdit from "./pages/admin/categories/CategoryEdit";



const App = () => {
    return (
        <>
            <ScrollToTop />
            <Routes>
                {/* FRONTEND / PUBLIC */}
                <Route element={<FrontendLayout />}>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/two-factor-challenge"  element={<TwoFactorChallenge />} />

                    <Route path="/register" element={<Register />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/reset-password" element={<ResetPassword />} />

                    {/* Google OAuth Callback */}
                    <Route path="/auth/social/callback" element={<SocialLoginCallback />} />

                    {/* CUSTOMER */}
                    <Route element={<RoleRoute allowedRoles={["customer"]} />}>
                        <Route path="/account" element={<CustomerLayout />}>
                            <Route index element={<CustomerDashboard />} />
                            <Route path="profile" element={<Profile />} />
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
                        <Route path="profile" element={<Profile />} />
                        <Route path="brands" element={<BrandIndex />} />

                        <Route path="brands/create" element={<BrandCreate />} />

                        <Route path="brands/:id/edit" element={<BrandEdit />} />

                        <Route  path="categories/create"  element={<CategoryCreate />} />

                        <Route path="categories" element={<CategoryIndex />} />

                        <Route path="categories/:id/edit" element={<CategoryEdit />} />

                    </Route>

                  

                    {/* Admin Settings Workspace */}
                    <Route path="/admin/settings" element={<AdminSettingsLayout />}>
                        <Route index element={<Navigate to="/admin/settings/email" replace />} />
                        <Route path="email" element={<EmailSettings />} />
                        <Route path="social-login" element={<SocialLoginSettings />} />
                        <Route path="ai" element={<AiConfiguration />} />
                    </Route>
                </Route>

                {/* VENDOR */}
                <Route element={<RoleRoute allowedRoles={["vendor"]} />}>
                    <Route path="/vendor" element={<VendorLayout />}>
                        <Route index element={<VendorDashboard />} />
                        <Route path="profile" element={<Profile />} />
                    </Route>
                </Route>
            </Routes>
        </>
    );
};

export default App;