import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getUserRequest } from "../api/users.js";
import { useAuth } from "../hooks/useAuth.js";

function formatActor(actor) {
  if (!actor) {
    return "System";
  }

  return `${actor.name} (${actor.email})`;
}

export function UserDetailPage() {
  const { userId } = useParams();
  const { accessToken } = useAuth();
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadUser() {
      try {
        const response = await getUserRequest(accessToken, userId);
        setUser(response.user);
      } catch (requestError) {
        setError(requestError.response?.data?.message || "Unable to load user");
      }
    }

    loadUser();
  }, [accessToken, userId]);

  if (error) {
    return <div className="panel error-text">{error}</div>;
  }

  if (!user) {
    return <div className="panel">Loading user details...</div>;
  }

  return (
    <section className="stack-lg">
      <div className="section-header">
        <div>
          <p className="eyebrow">Audit Detail</p>
          <h2>{user.name}</h2>
        </div>
      </div>

      <article className="panel">
        <div className="detail-grid">
          <div>
            <span className="detail-label">Email</span>
            <p>{user.email}</p>
          </div>
          <div>
            <span className="detail-label">Role</span>
            <p>{user.role}</p>
          </div>
          <div>
            <span className="detail-label">Status</span>
            <p>{user.status}</p>
          </div>
          <div>
            <span className="detail-label">Created</span>
            <p>{new Date(user.createdAt).toLocaleString()}</p>
          </div>
          <div>
            <span className="detail-label">Updated</span>
            <p>{new Date(user.updatedAt).toLocaleString()}</p>
          </div>
          <div>
            <span className="detail-label">Created By</span>
            <p>{formatActor(user.createdBy)}</p>
          </div>
          <div>
            <span className="detail-label">Updated By</span>
            <p>{formatActor(user.updatedBy)}</p>
          </div>
        </div>
      </article>
    </section>
  );
}
