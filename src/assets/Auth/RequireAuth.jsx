import { useContext } from "react";
import { Navigate, useLocation } from "react-router";
import { AuthContext } from "../Contexts/AuthContext";


const RequireAuth = ({ children }) => {
  const { token } = useContext(AuthContext);
  const location = useLocation();

  if (!token) {
    return <Navigate to="/log-in" replace state={{ from: location }} />;
  }
  return children;
};

export default RequireAuth;
