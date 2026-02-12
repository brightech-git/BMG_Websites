import HeaderWithAuth from "../../components/layouts/HeaderWithAuth";
import Footer from "../../components/layouts/Footer";

const MainLayout = ({ children }) => {
    return (
        <>
            <HeaderWithAuth />
                <main className="min-h-screen pt-[160px] sm:pt-[150px] md:pt-[150px]">
                    {children}
                </main>
            <Footer />
        </>
    );
};

export default MainLayout;
