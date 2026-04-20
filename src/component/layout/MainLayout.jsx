import HeaderWithAuth from "../../components/layouts/HeaderWithAuth";
import Footer from "../../components/layouts/Footer";

const MainLayout = ({ children }) => {
    return (
        <>
            <HeaderWithAuth />
                <main className="min-h-screen pt-[180px] sm:pt-[180px] md:pt-[200px]">
                    {children}
                </main>
            <Footer />
        </>
    );
};

export default MainLayout;
