import { Outlet } from "react-router-dom";




import Header from "../../components/frontend/header/Header";
import Footer from "../../components/frontend/footer/Footer";

const FrontendLayout = () => {
    return (
        <div className="flex min-h-screen flex-col bg-white">
            <Header />

            <main className="flex-1">
                <Outlet />
            </main>

            <Footer />

        
        </div>
    );
};

export default FrontendLayout;