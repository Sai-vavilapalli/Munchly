import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify"; // ✅ Toastify

function Order() {
  const [orderData, setOrderData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("http://localhost:1234/api/order/getorder", {
          withCredentials: true,
        });

        // Sort most recent first (highest ID)
        const sorted = res.data.slice().sort(
          (a, b) => b.order.id - a.order.id
        );

        setOrderData(sorted);
      } catch (err) {
        console.error(err);
        toast.error("❌ Failed to fetch orders");
      }
    };

    fetchData();
  }, []);

  const handleHome = async () => {
    try {
      await axios.delete("http://localhost:1234/api/order/clearCart", {
        withCredentials: true,
      });
      toast.success("✅ Cart cleared! Redirecting to home...");
      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (err) {
      console.error(err);
      toast.error("❌ Something went wrong while clearing the cart");
    }
  };

  return (
    <div className="container my-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold">Your Orders</h2>
        <button className="btn btn-primary" onClick={handleHome}>
          Back to Home
        </button>
      </div>

      {orderData.length > 0 ? (
        orderData.map((orderBlock) => {
          const { order, items } = orderBlock;
          const itemList = items
            .map((item) => `${item.menuItem.name} × ${item.quantity}`)
            .join(", ");

          return (
            <div key={order.id} className="card mb-4 shadow-sm">
              <div className="card-body">
                <div className="d-flex justify-content-between mb-2">
                  <span
                    className={`badge ${
                      order.orderStatus === "Pending"
                        ? "bg-warning text-dark"
                        : order.orderStatus === "Delivered"
                        ? "bg-success"
                        : "bg-secondary"
                    }`}
                  >
                    {order.orderStatus}
                  </span>
                  <span className="text-muted small">
                    {order.createdAt
                      ? new Date(order.createdAt).toLocaleString()
                      : ""}
                  </span>
                </div>
                <p className="mb-1">
                  <strong>Items:</strong> {itemList}
                </p>
                <p className="mb-1">
                  <strong>Address:</strong> {order.address}
                </p>
                <p className="mb-1">
                  <strong>Contact:</strong> {order.contactNumber}
                </p>
                <p className="mb-0">
                  <strong>Payment:</strong> {order.paymentMethod}
                </p>
              </div>
            </div>
          );
        })
      ) : (
        <div className="alert alert-info">
          <strong>No orders found.</strong> You haven’t placed any orders yet.
        </div>
      )}
    </div>
  );
}

export default Order;
