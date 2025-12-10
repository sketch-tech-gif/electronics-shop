import { useState } from "react";
import "./AdminLogin.css";

function AdminLogin({ onSuccess, onClose }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Admin password - change this to your desired password
  const ADMIN_PASSWORD = "admin123";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Simple client-side validation (for production, use proper backend auth)
    if (password === ADMIN_PASSWORD) {
      onSuccess();
      setPassword("");
    } else {
      setError("Invalid password. Please try again.");
      setPassword("");
    }

    setLoading(false);
  };

  return (
    <div className="admin-login-overlay">
      <div className="admin-login-modal">
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            autoFocus
            disabled={loading}
          />
          {error && <div className="login-error">{error}</div>}
          <button type="submit" disabled={loading}>
            Login
          </button>
          <button type="button" onClick={onClose} disabled={loading}>
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
}

export default AdminLogin;
