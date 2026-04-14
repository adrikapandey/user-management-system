import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";

export function AppLayout() {
  const { user, logout } = useAuth();

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div>
          <p className="eyebrow">Purple Merit Assessment</p>
          <h1>User Management</h1>
          <p className="sidebar-copy">Secure access, role-aware workflows, and a clean admin experience.</p>
        </div>

        <nav className="nav-list">
          <NavLink to="/">Dashboard</NavLink>
          {(user.role === "admin" || user.role === "manager") && <NavLink to="/users">Users</NavLink>}
          <NavLink to="/profile">My Profile</NavLink>
        </nav>

        <div className="sidebar-footer">
          <div className="user-chip">
            <span>{user.name}</span>
            <small>{user.role}</small>
          </div>
          <button className="secondary-button" onClick={logout} type="button">
            Logout
          </button>
        </div>
      </aside>

      <main className="main-panel">
        <Outlet />
      </main>
    </div>
  );
}
