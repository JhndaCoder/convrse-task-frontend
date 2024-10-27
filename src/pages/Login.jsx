import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import customFetch from "../../utils/api";
import toast from "react-hot-toast";
import { jwtDecode } from "jwt-decode";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await customFetch.post("api/auth/login", {
        email,
        password,
      });
      const decodedToken = jwtDecode(data.token);
      const expirationTime = decodedToken.exp * 1000;

      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);
      localStorage.setItem("tokenExpiration", expirationTime);
      toast.success("Logged in successfully!");

      navigate(data.role === "admin" ? "/admin" : "/");
    } catch (error) {
      toast.error(error.response?.data?.error || "Login failed");
      localStorage.removeItem("token");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const tokenExpiration = localStorage.getItem("tokenExpiration");
    if (tokenExpiration && Date.now() > tokenExpiration) {
      localStorage.clear();
      toast.error("Session expired. Please log in again.");
      navigate("/login");
    }
  }, [navigate]);

  return (
    <div className="login-page">
      <h1 className="login-title">Login</h1>
      <form
        className="login-form"
        onSubmit={handleLogin}
        aria-label="Login Form"
      >
        <div className="form-row">
          <label className="form-label" htmlFor="email">
            Email
          </label>
          <input
            className="form-input"
            type="email"
            id="email"
            name="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            aria-label="Email Address"
            required
          />
        </div>
        <div className="form-row">
          <label className="form-label" htmlFor="password">
            Password
          </label>
          <input
            className="form-input"
            type="password"
            id="password"
            name="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            aria-label="Password"
            required
            disabled={loading}
          />
        </div>
        <button
          className="login-button"
          type="submit"
          aria-label="Login Button"
        >
          {loading ? <div className="loading small"></div> : "Login"}
        </button>
      </form>
      <p className="login-register-link">
        Not registered?{" "}
        <Link to="/register" aria-label="Register Page Link">
          Register
        </Link>
      </p>
    </div>
  );
};

export default Login;
