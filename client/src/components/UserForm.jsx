import { useEffect, useState } from "react";

const initialState = {
  name: "",
  email: "",
  role: "user",
  status: "active",
  password: ""
};

export function UserForm({ mode = "create", initialValues, onSubmit, onCancel, allowAdminRole = true }) {
  const [form, setForm] = useState(initialState);

  useEffect(() => {
    if (initialValues) {
      setForm({
        name: initialValues.name || "",
        email: initialValues.email || "",
        role: initialValues.role || "user",
        status: initialValues.status || "active",
        password: ""
      });
    }
  }, [initialValues]);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    const payload = {
      name: form.name,
      email: form.email,
      role: form.role,
      status: form.status
    };

    if (form.password) {
      payload.password = form.password;
    }

    onSubmit(payload);
  }

  return (
    <form className="stack" onSubmit={handleSubmit}>
      <div className="form-grid">
        <label>
          <span>Name</span>
          <input name="name" onChange={handleChange} required value={form.name} />
        </label>
        <label>
          <span>Email</span>
          <input name="email" onChange={handleChange} required type="email" value={form.email} />
        </label>
        <label>
          <span>Role</span>
          <select name="role" onChange={handleChange} value={form.role}>
            {allowAdminRole && <option value="admin">Admin</option>}
            <option value="manager">Manager</option>
            <option value="user">User</option>
          </select>
        </label>
        <label>
          <span>Status</span>
          <select name="status" onChange={handleChange} value={form.status}>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </label>
        <label className="full-width">
          <span>{mode === "create" ? "Password (optional)" : "New Password (optional)"}</span>
          <input
            minLength={8}
            name="password"
            onChange={handleChange}
            placeholder="Leave blank to keep existing behavior"
            type="password"
            value={form.password}
          />
        </label>
      </div>

      <div className="button-row">
        <button className="primary-button" type="submit">
          {mode === "create" ? "Create User" : "Save Changes"}
        </button>
        {onCancel && (
          <button className="secondary-button" onClick={onCancel} type="button">
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
