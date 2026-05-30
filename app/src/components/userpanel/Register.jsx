import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { toast } from "react-toastify"; // ✅ Toastify

function Register() {
  const nav = useNavigate();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    role: ""
  });

  const change = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submit = async (e) => {
    e.preventDefault();
    try {
      const result = await axios.post(
        "http://localhost:1234/api/user/register",
        form
      );
      console.log(result);
      toast.success("✅ Registered successfully! Redirecting to login...");

      setTimeout(() => {
        nav("/log");
      }, 1500);
    } catch (err) {
      console.log(err);
      toast.error(err.response?.data || "❌ Registration failed");
    }
  };

  return (
    <div
      className="container d-flex justify-content-center align-items-center"
      style={{ minHeight: "100vh" }}
    >
      <div
        className="card shadow p-4"
        style={{ maxWidth: "400px", width: "100%" }}
      >
        <h2 className="mb-4 text-center">Register</h2>

        <form onSubmit={submit}>
          <div className="form-floating mb-3">
            <input
              onChange={change}
              name="username"
              type="text"
              className="form-control"
              id="floatingUsername"
              placeholder="Create username"
              required
            />
            <label htmlFor="floatingUsername">Username</label>
          </div>

          <div className="form-floating mb-3">
            <input
              onChange={change}
              name="email"
              type="email"
              className="form-control"
              id="floatingEmail"
              placeholder="Enter email"
              required
            />
            <label htmlFor="floatingEmail">Email address</label>
          </div>

          <div className="form-floating mb-3">
            <input
              onChange={change}
              name="password"
              type="password"
              className="form-control"
              id="floatingPassword"
              placeholder="Create password"
              required
            />
            <label htmlFor="floatingPassword">Password</label>
          </div>

          <div className="mb-3">
            <label htmlFor="roleSelect" className="form-label">
              Select Role
            </label>
            <select
              name="role"
              onChange={change}
              className="form-select"
              id="roleSelect"
              required
            >
              <option value="">Select Role</option>
              <option value="USER">User</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>

          <button className="w-100 btn btn-success btn-lg mb-3" type="submit">
            Register
          </button>

          <div className="text-center">
            <small className="text-muted">
              Already registered? <Link to="/log">Login</Link>
            </small>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Register;
