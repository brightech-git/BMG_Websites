import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import Layout from "./Layout";
import { AlertCircle } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname,
    );
  }, [location.pathname]);

  return (
    <Layout>
      <div className="min-h-96 flex items-center justify-center">
        <div className="text-center space-y-6">
          <div className="flex justify-center">
            <AlertCircle size={64} className="text-red-500" />
          </div>
          <div>
            <h1 className="text-5xl font-bold text-gray-900 mb-2">404</h1>
            <p className="text-xl text-gray-600 mb-2">Oops! Page not found</p>
            <p className="text-gray-600 mb-8">
              The page you're looking for doesn't exist or has been moved.
            </p>
          </div>
          <div className="flex gap-4 justify-center">
            <Link
              to="/"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors"
            >
              Return to Home
            </Link>
            <Link
              to="/profile"
              className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50 font-semibold py-3 px-8 rounded-lg transition-colors"
            >
              Go to Profile
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default NotFound;
