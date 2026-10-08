import { Routes, Route, Navigate } from "react-router-dom";

import FrontendLayout from "./layouts/frontend/FrontendLayout";
import CustomerLayout from "./layouts/customer/CustomerLayout";

import VendorLayout from "./layouts/vendor/VendorLayout";

import RoleRoute from "./components/auth/RoleRoute";

import Home from "./pages/frontend/Home";
import NotFound from "./pages/frontend/NotFound";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";




import CustomerDashboard from "./layouts/customer/Dashboard";
import AdminDashboard from "./layouts/admin/Dashboard";
import VendorDashboard from "./layouts/vendor/Dashboard";
import AdminLayout from "./layouts/admin/AdminLayout";
import ScrollToTop from "./components/common/ScrollToTop";
import EmailSettings from "./pages/admin/settings/EmailSettings";
import AdminSettingsLayout from "./layouts/settings/AdminSettingsLayout";
import ResetPassword from "./pages/auth/ResetPassword";

const App = () => {
    return (
        <>

            <ScrollToTop />

            <Routes>
                <Route element={<FrontendLayout />}>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />

                    <Route element={<RoleRoute allowedRoles={["customer"]} />}>
                        <Route path="/account" element={<CustomerLayout />}>
                            <Route index element={<CustomerDashboard />} />
                        </Route>
                    </Route>

                    <Route path="/reset-password" element={<ResetPassword />} />

                    <Route path="*" element={<NotFound />} />
                </Route>

                <Route element={<RoleRoute allowedRoles={["admin"]} />}>
                    <Route path="/admin" element={<AdminLayout />}>
                        <Route path="dashboard" element={<AdminDashboard />} />
                    </Route>

                    {/* Settings Workspace */}

                    <Route path="/admin/settings" element={<AdminSettingsLayout />}>
                        <Route index element={<Navigate to="/admin/settings/email" replace />} />
                        <Route path="email" element={<EmailSettings />} />
                    </Route>

                </Route>

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