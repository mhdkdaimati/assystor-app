import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const authName = localStorage.getItem("auth_name");
  const authToken = localStorage.getItem("auth_token");

  if (!authName || !authToken) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;