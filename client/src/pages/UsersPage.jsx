import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  createUserRequest,
  deactivateUserRequest,
  getUsersRequest,
  updateUserRequest
} from "../api/users.js";
import { UserForm } from "../components/UserForm.jsx";
import { useAuth } from "../hooks/useAuth.js";

export function UsersPage() {
  const { accessToken, user } = useAuth();
  const [users, setUsers] = useState([]);
  const [meta, setMeta] = useState({ page: 1, totalPages: 1 });
  const [filters, setFilters] = useState({ search: "", role: "", status: "", page: 1 });
  const [selectedUser, setSelectedUser] = useState(null);
  const [generatedPassword, setGeneratedPassword] = useState("");
  const [error, setError] = useState("");
  const [createFormKey, setCreateFormKey] = useState(0);

  async function loadUsers(nextFilters = filters) {
    try {
      const response = await getUsersRequest(accessToken, nextFilters);
      setUsers(response.items);
      setMeta(response.meta);
      setError("");
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to load users");
    }
  }

  useEffect(() => {
    loadUsers();
  }, []);

  async function handleCreate(payload) {
    try {
      const response = await createUserRequest(accessToken, payload);
      setGeneratedPassword(response.generatedPassword || "");
      setError("");
      setCreateFormKey((current) => current + 1);
      await loadUsers({ ...filters, page: 1 });
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to create user");
    }
  }

  async function handleUpdate(payload) {
    try {
      await updateUserRequest(accessToken, selectedUser.id, payload);
      setSelectedUser(null);
      await loadUsers();
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to update user");
    }
  }

  async function handleDeactivate(userId) {
    try {
      await deactivateUserRequest(accessToken, userId);
      await loadUsers();
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to deactivate user");
    }
  }

  async function handleSearchSubmit(event) {
    event.preventDefault();
    const nextFilters = { ...filters, page: 1 };
    setFilters(nextFilters);
    await loadUsers(nextFilters);
  }

  return (
    <section className="stack-lg">
      <div className="section-header">
        <div>
          <p className="eyebrow">User Directory</p>
          <h2>Manage accounts</h2>
          <p className="muted-panel">
            Admins can create users. Managers can search, view, and update non-admin users.
          </p>
        </div>
      </div>

      <div className="content-grid">
        {user.role === "admin" && (
          <article className="panel">
            <h3>Create user</h3>
            <UserForm key={createFormKey} allowAdminRole={user.role === "admin"} onSubmit={handleCreate} />
            {generatedPassword && <p className="success-text">Generated password: {generatedPassword}</p>}
          </article>
        )}

        {user.role === "manager" && (
          <article className="panel">
            <h3>Manager access</h3>
            <p className="muted-panel">
              Your role can review and update non-admin users, but account creation and deletion stay
              restricted to admins.
            </p>
          </article>
        )}

        {selectedUser && (
          <article className="panel">
            <h3>Edit user</h3>
            <UserForm
              initialValues={selectedUser}
              allowAdminRole={user.role === "admin"}
              mode="edit"
              onCancel={() => setSelectedUser(null)}
              onSubmit={handleUpdate}
            />
          </article>
        )}
      </div>

      <article className="panel">
        <form className="toolbar" onSubmit={handleSearchSubmit}>
          <input
            onChange={(event) => setFilters((current) => ({ ...current, search: event.target.value }))}
            placeholder="Search by name or email"
            value={filters.search}
          />
          <select onChange={(event) => setFilters((current) => ({ ...current, role: event.target.value }))} value={filters.role}>
            <option value="">All roles</option>
            <option value="admin">Admin</option>
            <option value="manager">Manager</option>
            <option value="user">User</option>
          </select>
          <select
            onChange={(event) => setFilters((current) => ({ ...current, status: event.target.value }))}
            value={filters.status}
          >
            <option value="">All statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <button className="secondary-button" type="submit">
            Apply
          </button>
        </form>

        {error && <p className="error-text">{error}</p>}

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((entry) => (
                <tr key={entry.id}>
                  <td>{entry.name}</td>
                  <td>{entry.email}</td>
                  <td>
                    <span className={`badge badge-${entry.role}`}>{entry.role}</span>
                  </td>
                  <td>{entry.status}</td>
                  <td className="action-row">
                    <Link className="inline-link" to={`/users/${entry.id}`}>
                      View
                    </Link>
                    {(user.role === "admin" || entry.role !== "admin") && (
                      <button className="text-button" onClick={() => setSelectedUser(entry)} type="button">
                        Edit
                      </button>
                    )}
                    {(user.role === "admin" || entry.role !== "admin") && entry.status === "active" && (
                      <button className="text-button danger-text" onClick={() => handleDeactivate(entry.id)} type="button">
                        Deactivate
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="toolbar">
          <span>
            Page {meta.page} of {meta.totalPages || 1}
          </span>
          <div className="button-row">
            <button
              className="secondary-button"
              disabled={filters.page <= 1}
              onClick={async () => {
                const nextFilters = { ...filters, page: filters.page - 1 };
                setFilters(nextFilters);
                await loadUsers(nextFilters);
              }}
              type="button"
            >
              Previous
            </button>
            <button
              className="secondary-button"
              disabled={filters.page >= meta.totalPages}
              onClick={async () => {
                const nextFilters = { ...filters, page: filters.page + 1 };
                setFilters(nextFilters);
                await loadUsers(nextFilters);
              }}
              type="button"
            >
              Next
            </button>
          </div>
        </div>
      </article>
    </section>
  );
}
