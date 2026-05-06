import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { getDefaultRoute } from "../utils/constants";
import { LoadingSpinner } from "./ui";

const PublicRoute = ({ children, redirectTo }) => {
  const { isAuthenticated, loading, user } = useAuth();

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600">Memuat...</p>
        </div>
      </div>
    );
  }

  // Redirect authenticated users to the intended route.
  // If redirectTo is not provided, route is resolved from user role.
  if (isAuthenticated) {
    const targetRoute = redirectTo || getDefaultRoute(user?.role);
    return <Navigate to={targetRoute} replace />;
  }

  return children;
};

export default PublicRoute;
