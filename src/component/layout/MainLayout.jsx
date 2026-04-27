import HeaderWithAuth from "../../components/layouts/HeaderWithAuth";
import Footer from "../../components/layouts/Footer";

const MainLayout = ({ children }) => {
    return (
        <>
            <HeaderWithAuth />
                <main className="min-h-screen pt-[165px] sm:pt-[165px] md:pt-[170px]">
                    {children}
                </main>
            <Footer />
        </>
    );
};

export default MainLayout;
