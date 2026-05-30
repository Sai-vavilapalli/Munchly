import Sidebar from "../homepage/Sidebar";
import Menubar from "../homepage/Menubar";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify"; // ✅ import toast
import "bootstrap/dist/css/bootstrap.min.css";

function AdminOrder() {
  const [orderData, setOrderData] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await axios.get(
        "http://localhost:1234/api/order/getorder",
        { withCredentials: true }
      );

      const sortedOrders = res.data.sort((a, b) => b.order.id - a.order.id);
      setOrderData(sortedOrders);
    } catch (err) {
      console.error(err);
      toast.error("❌ Failed to fetch orders");
    }
  };

  const handleStatusChange = (orderId, newStatus) => {
    const updatedOrders = orderData.map((orderBlock) => {
      if (orderBlock.order.id === orderId) {
        return {
          ...orderBlock,
          order: {
            ...orderBlock.order,
            orderStatus: newStatus,
          },
        };
      }
      return orderBlock;
    });

    setOrderData(updatedOrders);
  };

  const updateStatus = async (orderId, newStatus) => {
    try {
      await axios.put(
        `http://localhost:1234/api/order/updateStatus/${orderId}`,
        { status: newStatus },
        { withCredentials: true }
      );

      toast.success("✅ Order status updated successfully");
    } catch (err) {
      console.error(err);
      toast.error("❌ Failed to update order status");
    }
  };

  return (
    <div className="d-flex" id="wrapper">
      <Sidebar />

      <div id="page-content-wrapper" className="w-100">
        <Menubar />

        <div className="container mt-4">
          <h2 className="mb-4">All Orders</h2>

          {orderData.length > 0 ? (
            <div className="row">
              {orderData.map((orderBlock) => {
                const itemNames = orderBlock.items
                  .map((item) => item.menuItem.name)
                  .join(", ");
                const currentStatus = orderBlock.order.orderStatus;

                return (
                  <div
                    className="col-md-6 col-lg-4 mb-4"
                    key={orderBlock.order.id}
                  >
                    <div className="card shadow-sm h-100">
                      <div className="card-body">
                        <h5 className="card-title">Order</h5>
                        <p className="card-text">
                          <strong>Status:</strong>{" "}
                          <span className="badge bg-secondary">
                            {currentStatus}
                          </span>
                          <br />
                          <strong>Address:</strong> {orderBlock.order.address}
                          <br />
                          <strong>Contact:</strong>{" "}
                          {orderBlock.order.contactNumber}
                          <br />
                          <strong>Items:</strong> {itemNames}
                        </p>

                        <div className="mb-2">
                          <label className="form-label">
                            Update Status:
                          </label>
                          <select
                            className="form-select"
                            value={currentStatus}
                            onChange={(e) =>
                              handleStatusChange(
                                orderBlock.order.id,
                                e.target.value
                              )
                            }
                          >
                            <option value="Pending">Pending</option>
                            <option value="Preparing">Preparing</option>
                            <option value="Delivered">Delivered</option>
                          </select>
                        </div>
                        <button
                          className="btn btn-sm btn-primary"
                          onClick={() =>
                            updateStatus(
                              orderBlock.order.id,
                              orderBlock.order.orderStatus
                            )
                          }
                        >
                          Update Status
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="alert alert-info">No orders found.</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminOrder;
