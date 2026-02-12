import { Outlet } from "react-router-dom";
import HeaderWithAuth from "../../components/layouts/HeaderWithAuth";
import Footer from "../../components/layouts/Footer";

const MainHeaderLayout = () => {
    return (
        <>
            <HeaderWithAuth />
            <main className="min-h-screen -pt-[150px] ">
                <Outlet />
            </main>
            <Footer />
        </>
    );
};

export default MainHeaderLayout;
