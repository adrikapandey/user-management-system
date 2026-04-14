import { useMemo } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";

const messages = {
  admin: {
    title: "Administrator control center",
    body: "Manage roles, review all users, and oversee account lifecycle events from one place."
  },
  manager: {
    title: "Manager workspace",
    body: "Review and maintain non-admin users while keeping admin-only actions protected."
  },
  user: {
    title: "Personal account dashboard",
    body: "View and maintain your own profile while access to other accounts stays restricted."
  }
};

export function DashboardPage() {
  const { user } = useAuth();

  const cards = useMemo(() => {
    if (user.role === "admin") {
      return [
        { title: "User Directory", value: "Create, update, filter, and deactivate accounts", link: "/users" },
        { title: "Security Model", value: "JWT auth with backend RBAC enforcement" },
        { title: "Audit Trail", value: "Created by and updated by fields visible on user detail pages" }
      ];
    }

    if (user.role === "manager") {
      return [
        { title: "User Directory", value: "View and update non-admin users", link: "/users" },
        { title: "Profile Tools", value: "Maintain your own account details", link: "/profile" },
        { title: "Permissions", value: "Admin routes remain hidden and blocked" }
      ];
    }

    return [
      { title: "My Profile", value: "Update your name and password safely", link: "/profile" },
      { title: "Access Scope", value: "You can only manage your own account" },
      { title: "Security", value: "Protected routes and token-based sessions" }
    ];
  }, [user.role]);

  return (
    <section className="stack-lg">
      <div className="hero-card">
        <p className="eyebrow">Dashboard</p>
        <h2>{messages[user.role].title}</h2>
        <p>{messages[user.role].body}</p>
      </div>

      <div className="card-grid">
        {cards.map((card) => (
          <article className="info-card" key={card.title}>
            <h3>{card.title}</h3>
            <p>{card.value}</p>
            {card.link && (
              <Link className="inline-link" to={card.link}>
                Open
              </Link>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}
