import { useEffect, useState } from "react";
import { getProfileRequest, updateProfileRequest } from "../api/users.js";
import { useAuth } from "../hooks/useAuth.js";

export function ProfilePage() {
  const { accessToken, updateStoredUser } = useAuth();
  const [form, setForm] = useState({ name: "", password: "" });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    async function loadProfile() {
      try {
        const response = await getProfileRequest(accessToken);
        setProfile(response.user);
        setForm((current) => ({ ...current, name: response.user.name }));
      } catch (requestError) {
        setError(requestError.response?.data?.message || "Unable to load profile");
      }
    }

    loadProfile();
  }, [accessToken]);

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");
    setError("");

    try {
      const payload = {
        name: form.name
      };

      if (form.password.trim()) {
        payload.password = form.password;
      }

      const response = await updateProfileRequest(accessToken, payload);
      setProfile(response.user);
      setForm((current) => ({ ...current, password: "" }));
      updateStoredUser(response.user);
      setMessage("Profile updated successfully");
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to update profile");
    }
  }

  if (!profile) {
    return <div className="panel">Loading profile...</div>;
  }

  return (
    <section className="stack-lg">
      <div className="section-header">
        <div>
          <p className="eyebrow">My Profile</p>
          <h2>{profile.name}</h2>
        </div>
      </div>

      <article className="panel stack">
        <div className="detail-grid">
          <div>
            <span className="detail-label">Email</span>
            <p>{profile.email}</p>
          </div>
          <div>
            <span className="detail-label">Role</span>
            <p>{profile.role}</p>
          </div>
          <div>
            <span className="detail-label">Status</span>
            <p>{profile.status}</p>
          </div>
          <div>
            <span className="detail-label">Last updated</span>
            <p>{new Date(profile.updatedAt).toLocaleString()}</p>
          </div>
        </div>

        <form className="stack" onSubmit={handleSubmit}>
          <label>
            <span>Name</span>
            <input
              onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
              value={form.name}
            />
          </label>
          <label>
            <span>New Password</span>
            <input
              minLength={8}
              onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
              placeholder="Leave blank to keep your current password"
              type="password"
              value={form.password}
            />
          </label>
          {message && <p className="success-text">{message}</p>}
          {error && <p className="error-text">{error}</p>}
          <button className="primary-button" type="submit">
            Save Profile
          </button>
        </form>
      </article>
    </section>
  );
}
