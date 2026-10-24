import { NavLink, Outlet, Link } from "react-router";
import { MdLogout, MdStorefront, MdDashboard } from "react-icons/md";
import { useAdmin } from "../../Contexts/AdminContext";
import { RESOURCES } from "../../AdminConfig/adminConfig";
import "./admin.css";


const AdminLayout = () => {
  const { logout } = useAdmin();

  return (
    <div className="adm-shell">
      <aside className="adm-side">
        <div className="adm-brand"> Admin</div>

        <nav className="adm-nav" aria-label="Admin sections">
          <NavLink to="/admin" end>
            <MdDashboard size={20} />
            <span>Dashboard</span>
          </NavLink>

          {Object.values(RESOURCES).map((cfg) => {
            const Icon = cfg.icon;
            return (
              <NavLink key={cfg.route} to={`/admin/${cfg.route}`}>
                <Icon size={20} />
                <span>{cfg.plural}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="adm-side__foot">
          <Link to="/" className="adm-side__link">
            <MdStorefront size={20} /> <span>Back to store</span>
          </Link>
          <button type="button" className="adm-side__link" onClick={logout}>
            <MdLogout size={20} /> <span>Log out</span>
          </button>
        </div>
      </aside>

      <main className="adm-main">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;