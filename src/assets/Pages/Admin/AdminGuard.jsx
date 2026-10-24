import { Navigate, useLocation } from "react-router";
import { useAdmin } from "../../Contexts/AdminContext";


const AdminGuard = ({ children }) => {
  const { isAuthed } = useAdmin();
  const location = useLocation();

  if (!isAuthed) {
    return <Navigate to="/admin/login" replace state={{ from: location }} />;
  }
  return children;
};

export default AdminGuard;
