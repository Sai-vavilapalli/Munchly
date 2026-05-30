import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { toast } from "react-toastify"; // ✅ Import Toastify

function Login() {
  const nav = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const change = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submit = async (e) => {
    e.preventDefault();
    try {
      const result = await axios.post(
        "http://localhost:1234/api/user/login",
        form,
        { withCredentials: true }
      );
      console.log(result.data);

      if (result.data.role) {
        toast.success(`✅ Login successful! Role: ${result.data.role}`);

        localStorage.setItem("role", result.data.role);
        localStorage.setItem("email", result.data.email);

        setTimeout(() => {
          if (result.data.role === "ADMIN") {
            nav("/admin");
          } else {
            nav("/");
          }
        }, 1500);
      } else {
        toast.error(result.data || "Login failed");
      }
    } catch (err) {
      console.log(err);
      toast.error(err.response?.data || "Login failed");
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
        <h2 className="mb-4 text-center">Sign In</h2>

        <form onSubmit={submit}>
          <div className="form-floating mb-3">
            <input
              onChange={change}
              name="email"
              type="email"
              className="form-control"
              id="floatingInput"
              placeholder="name@example.com"
              required
            />
            <label htmlFor="floatingInput">Email address</label>
          </div>

          <div className="form-floating mb-3">
            <input
              onChange={change}
              name="password"
              type="password"
              className="form-control"
              id="floatingPassword"
              placeholder="Password"
              required
            />
            <label htmlFor="floatingPassword">Password</label>
          </div>

          <button className="w-100 btn btn-primary btn-lg mb-3" type="submit">
            Sign In
          </button>

          <div className="text-center">
            <small className="text-muted">
              Don’t have an account? <Link to="/reg">Register</Link>
            </small>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
