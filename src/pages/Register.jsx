import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import customFetch from "../../utils/api";
import toast from "react-hot-toast";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      await customFetch.post("api/auth/register", { name, email, password });
      toast.success("Registration successful! Please log in.");
      navigate("/login");
    } catch (error) {
      const errorMessage =
        error.response?.data?.error || "Registration failed. Please try again.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      <h1 className="register-title">Register</h1>
      <form className="register-form" onSubmit={handleRegister}>
        <div className="form-row">
          <label className="form-label" htmlFor="name">
            Name
          </label>
          <input
            className="form-input"
            type="text"
            id="name"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="name"
            aria-label="Full Name"
            required
          />
        </div>
        <div className="form-row">
          <label className="form-label" htmlFor="email">
            Email
          </label>
          <input
            className="form-input"
            type="email"
            id="email"
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
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
            aria-label="Password"
            minLength="8"
            required
          />
        </div>
        <div className="form-row">
          <label className="form-label" htmlFor="confirmPassword">
            Confirm Password
          </label>
          <input
            className="form-input"
            type="password"
            id="confirmPassword"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            autoComplete="new-password"
            aria-label="Confirm Password"
            required
          />
        </div>

        <button className="register-button" type="submit" disabled={loading}>
          {loading ? <div className="loading small"></div> : "Register"}
        </button>
      </form>

      <p className="login-register-link">
        Already registered? <Link to="/login">Login</Link>
      </p>
    </div>
  );
};

export default Register;
