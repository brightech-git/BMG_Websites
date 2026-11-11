import HeaderWithAuth from "../../components/layouts/HeaderWithAuth";
import Footer from "../../components/layouts/Footer";

const MainLayout = ({ children }) => {
    return (
        <>
            <HeaderWithAuth />
                <main className="min-h-screen">
                    {children}
                </main>
            <Footer />
        </>
    );
};

export default MainLayout;
