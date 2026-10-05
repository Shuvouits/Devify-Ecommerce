import { Routes, Route } from "react-router-dom";

import FrontendLayout from "./layouts/frontend/FrontendLayout";
import Home from "./pages/frontend/Home";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";

const App = () => {
    return (
        <Routes>
            <Route element={<FrontendLayout />}>

                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />

            </Route>
        </Routes>
    );
};

export default App;