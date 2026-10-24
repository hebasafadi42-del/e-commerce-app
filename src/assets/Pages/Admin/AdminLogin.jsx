import { useState } from "react";
import { Alert, Button, Form, Spinner } from "react-bootstrap";
import { Navigate, useLocation } from "react-router";
import { useAdmin } from "../../Contexts/AdminContext";
import "./admin.css";

const AdminLogin = () => {
  const { isAuthed, login } = useAdmin();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/admin";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

 
  if (isAuthed) return <Navigate to={from} replace />;

  const submit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(email.trim(), password);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="adm-login">
      <Form className="adm-card adm-login__card" onSubmit={submit}>
        <h1 className="adm-login__title">Admin sign in</h1>
        <p className="text-muted mb-4">Use your admin Email and Password</p>

        {error && (
          <Alert variant="danger" className="py-2 small">
            {error}
          </Alert>
        )}

        <Form.Group className="mb-3" controlId="adm-email">
          <Form.Label className="small fw-semibold">Email</Form.Label>
          <Form.Control
            type="email"
            autoComplete="username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoFocus
          />
        </Form.Group>

        <Form.Group className="mb-4" controlId="adm-password">
          <Form.Label className="small fw-semibold">Password</Form.Label>
          <Form.Control
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </Form.Group>

        <Button type="submit" className="adm-btn-primary w-100 py-2" disabled={loading}>
          {loading ? <Spinner size="sm" animation="border" /> : "Sign in"}
        </Button>
      </Form>
    </div>
  );
};

export default AdminLogin;
