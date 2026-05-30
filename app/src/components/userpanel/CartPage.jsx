import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify"; // ✅

function CartPage() {
  const [items, setItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await axios.get("http://localhost:1234/api/cart/getcart", {
        withCredentials: true,
      });
      setItems(res.data);
    } catch (err) {
      console.error(err);
      toast.error("❌ Failed to load cart");
    }
  };

  const subtotal = items.reduce(
    (total, item) => total + item.menuItem.price * item.quantity,
    0
  );
  const deliveryFee = subtotal > 0 ? 50 : 0;
  const tax = subtotal * 0.05;
  const totalAmount = subtotal + deliveryFee + tax;

  const del = async (id) => {
    try {
      await axios.delete(`http://localhost:1234/api/cart/delete/${id}`, {
        withCredentials: true,
      });
      toast.info("🗑️ Item removed");
      fetchData();
    } catch (err) {
      console.error(err);
      toast.error("❌ Failed to remove item");
    }
  };

  const updateQuantity = async (id, newQuantity) => {
    if (newQuantity <= 0) {
      del(id);
      return;
    }

    try {
      await axios.put(
        `http://localhost:1234/api/cart/update/${id}`,
        { quantity: newQuantity },
        { withCredentials: true }
      );
      toast.success("✅ Quantity updated");
      fetchData();
    } catch (err) {
      console.error(err);
      toast.error("❌ Failed to update quantity");
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="mb-4">Your Cart</h1>
      <div className="row">
        {/* Cart Items */}
        <div className="col-md-8 mb-4">
          <table className="table table-bordered table-striped">
            <thead className="table-dark">
              <tr>
                <th>Name</th>
                <th>Category</th>
                <th>Description</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center">
                    No items in cart
                  </td>
                </tr>
              ) : (
                items.map((item) => (
                  <tr key={item.id}>
                    <td>{item.menuItem.name}</td>
                    <td>{item.menuItem.category}</td>
                    <td>{item.menuItem.description}</td>
                    <td>₹{item.menuItem.price}</td>
                    <td>
                      <div className="d-flex align-items-center">
                        <button
                          className="btn btn-outline-secondary btn-sm"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                        >
                          -
                        </button>
                        <span className="mx-2">{item.quantity}</span>
                        <button
                          className="btn btn-outline-secondary btn-sm"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                        >
                          +
                        </button>
                      </div>
                    </td>
                    <td>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => del(item.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Order Summary */}
        <div className="col-md-4">
          <div className="card">
            <div className="card-body">
              <h4 className="card-title mb-3">Order Summary</h4>
              <div className="d-flex justify-content-between">
                <span>Subtotal:</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="d-flex justify-content-between">
                <span>Delivery Fee:</span>
                <span>₹{deliveryFee.toFixed(2)}</span>
              </div>
              <div className="d-flex justify-content-between">
                <span>Tax (5%):</span>
                <span>₹{tax.toFixed(2)}</span>
              </div>
              <hr />
              <div className="d-flex justify-content-between fw-bold">
                <span>Total:</span>
                <span>₹{totalAmount.toFixed(2)}</span>
              </div>
              <button
                className="btn btn-primary w-100 mt-3"
                disabled={items.length === 0}
                onClick={() => navigate("/checkout")}
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CartPage;
