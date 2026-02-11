import HeaderWithAuth from "../../components/layouts/HeaderWithAuth";
import Footer from "../../components/layouts/Footer";
import { Outlet } from "react-router-dom";

const MainLayout = ({children}) => {
    return (
        <>
            <HeaderWithAuth />
            <main className="min-h-100vh">
                {children}
            </main>
            <Footer />
        </>
    );
};

export default MainLayout;
