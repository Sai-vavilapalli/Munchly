import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";
import { useCart } from "../../../contexts/CartContext";

function Navbar() {
  const navigate = useNavigate();
  const role = localStorage.getItem("role"); // "admin" or "user" or null

  const { cartCount, setCartCount } = useCart();

  useEffect(() => {
    const fetchCartCount = async () => {
      if (!role || role === "admin") {
        setCartCount(0);
        return;
      }
      try {
        const response = await axios.get(
          "http://localhost:1234/api/cart/count",
          { withCredentials: true }
        );
        setCartCount(response.data);
      } catch (error) {
        console.error("Failed to fetch cart count", error);
        setCartCount(0);
      }
    };

    fetchCartCount();
  }, [role, setCartCount]);

  const handleLogout = () => {
    localStorage.clear();
    setCartCount(0);
    navigate("/");
  };

  return (
    <nav className="navbar bg-body-tertiary">
      <div className="container-fluid d-flex align-items-center justify-content-between">
        <div className="d-flex align-items-center">
          <Link className="navbar-brand me-4" to="/">
            <img 
              src="/assets/munchly.png" 
              alt="Munchly Logo" 
              style={{ height: "60px", width: "auto" }} 
            />

          </Link>

          <div className="d-flex">
            {role === "admin" ? (
              <>
                <Link className="nav-link me-3" to="/home">
                  Dashboard
                </Link>
                <Link className="nav-link me-3" to="/admin/orders">
                  Orders
                </Link>
              </>
            ) : (
              <>
                <Link className="nav-link active me-3" to="/">
                  Home
                </Link>
                <Link className="nav-link me-3" to="/Fooddisplay">
                  Explore
                </Link>
                <Link className="nav-link me-3" to="/about">
                  About Us
                </Link>
              </>
            )}
          </div>
        </div>

        <div className="d-flex align-items-center gap-3">
          {/* ✅ Orders for user (right side) */}
          {role && role !== "admin" && (
            <Link to="/orders" className="nav-link">
              Orders
            </Link>
          )}

          {/* ✅ Cart for user */}
          {role && role !== "admin" && (
            <Link
              to="/cart"
              className="text-decoration-none position-relative"
            >
              <i className="bi bi-cart4" style={{ fontSize: "1.5rem" }}></i>
              {cartCount > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                  {cartCount}
                </span>
              )}
            </Link>
          )}

          {role ? (
            <button
              className="btn btn-outline-danger"
              onClick={handleLogout}
            >
              Log Out
            </button>
          ) : (
            <button
              className="btn btn-outline-primary"
              onClick={() => navigate("/log")}
            >
              Sign In
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
