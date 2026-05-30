import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify"; // ✅

export default function CheckoutPage() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({
    address: "",
    contactNumber: "",
    notes: "",
    paymentMethod: "COD",
  });

  const [upiApp, setUpiApp] = useState("");
  const [upiId, setUpiId] = useState("");
  const [selectedBank, setSelectedBank] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCVV, setCardCVV] = useState("");

  const upiApps = [
    { name: "PhonePe", url: "/payment-logos/phonepe.png" },
    { name: "Google Pay", url: "/payment-logos/googlepay.png" },
    { name: "Paytm", url: "/payment-logos/paytm.png" },
    { name: "BHIM", url: "/payment-logos/bhim.png" },
    { name: "Amazon Pay", url: "/payment-logos/amazonpay.png" },
  ];

  const banks = [
    { name: "HDFC", url: "/payment-logos/hdfc.png" },
    { name: "ICICI", url: "/payment-logos/icici.png" },
    { name: "SBI", url: "/payment-logos/sbi.png" },
    { name: "Axis", url: "/payment-logos/axis.png" },
    { name: "Kotak", url: "/payment-logos/kotak.png" },
  ];

  useEffect(() => {
    const fetchCart = async () => {
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
    fetchCart();
  }, []);

  const subtotal = items.reduce(
    (total, item) => total + item.menuItem.price * item.quantity,
    0
  );
  const deliveryFee = subtotal > 0 ? 50 : 0;
  const tax = subtotal * 0.05;
  const totalAmount = subtotal + deliveryFee + tax;

  const change = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        address: form.address,
        contactNumber: form.contactNumber,
        notes: form.notes,
        paymentMethod: form.paymentMethod,
        totalAmount: totalAmount,
      };
      await axios.post(
        "http://localhost:1234/api/order/checkout",
        payload,
        { withCredentials: true }
      );
      toast.success("✅ Order placed successfully!");
      setTimeout(() => navigate("/orders"), 1500);
    } catch (err) {
      console.error(err);
      toast.error("❌ Something went wrong during checkout");
    }
  };

  return (
    <div className="container my-5">
      <h2 className="mb-4 fw-bold">Checkout</h2>
      <div className="row g-4">
        {/* Left: Delivery & Payment */}
        <div className="col-md-7">
          <div className="card shadow p-4">
            <h4 className="mb-3">Delivery Address</h4>
            <div className="mb-3">
              <textarea
                name="address"
                className="form-control"
                rows="3"
                placeholder="Enter your delivery address"
                onChange={change}
                required
              ></textarea>
            </div>

            <h4 className="mb-3">Contact Details</h4>
            <div className="mb-3">
              <input
                name="contactNumber"
                type="text"
                className="form-control"
                placeholder="Contact Number"
                onChange={change}
                required
              />
            </div>

            <h4 className="mb-3">Order Notes</h4>
            <div className="mb-3">
              <textarea
                name="notes"
                className="form-control"
                rows="2"
                placeholder="Any special instructions?"
                onChange={change}
              ></textarea>
            </div>

            <h4 className="mb-3">Payment Method</h4>
            <div className="mb-3">
              {[
                { method: "COD", label: "Cash On Delivery", icon: "💵" },
                { method: "UPI", label: "UPI", icon: "📲" },
                { method: "NetBanking", label: "Net Banking", icon: "🏦" },
                { method: "Card", label: "Debit Card", icon: "💳" },
                { method: "Wallet", label: "Wallet", icon: "👛" },
              ].map((pm) => (
                <div className="form-check mb-2" key={pm.method}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={pm.method}
                    className="form-check-input"
                    checked={form.paymentMethod === pm.method}
                    onChange={change}
                  />
                  <label className="form-check-label">
                    {pm.icon} {pm.label}
                  </label>
                </div>
              ))}

              {form.paymentMethod === "UPI" && (
                <div className="mt-3">
                  <h6>Choose UPI App</h6>
                  <div className="d-flex gap-3 flex-wrap mb-3">
                    {upiApps.map((app) => (
                      <div
                        key={app.name}
                        onClick={() => setUpiApp(app.name)}
                        className={`p-2 border rounded ${
                          upiApp === app.name ? "border-primary shadow" : ""
                        }`}
                        style={{
                          cursor: "pointer",
                          width: "90px",
                          textAlign: "center",
                        }}
                      >
                        <img
                          src={app.url}
                          alt={app.name}
                          width="40"
                          height="40"
                        />
                        <div className="small">{app.name}</div>
                      </div>
                    ))}
                  </div>
                  {upiApp && (
                    <>
                      <label className="form-label">Enter UPI ID</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="example@upi"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                      />
                    </>
                  )}
                </div>
              )}

              {form.paymentMethod === "NetBanking" && (
                <div className="mt-3">
                  <h6>Select Bank</h6>
                  <div className="d-flex gap-3 flex-wrap mb-3">
                    {banks.map((bank) => (
                      <div
                        key={bank.name}
                        onClick={() => setSelectedBank(bank.name)}
                        className={`p-2 border rounded ${
                          selectedBank === bank.name
                            ? "border-primary shadow"
                            : ""
                        }`}
                        style={{
                          cursor: "pointer",
                          width: "90px",
                          textAlign: "center",
                        }}
                      >
                        <img
                          src={bank.url}
                          alt={bank.name}
                          width="50"
                          height="50"
                        />
                        <div className="small">{bank.name}</div>
                      </div>
                    ))}
                  </div>
                  {selectedBank && (
                    <p>You’ll be redirected to {selectedBank}'s portal.</p>
                  )}
                </div>
              )}

              {form.paymentMethod === "Card" && (
                <div className="mt-3">
                  <h6>Card Details</h6>
                  <div className="mb-3">
                    <label>Card Number</label>
                    <input
                      className="form-control"
                      placeholder="1234 5678 9012 3456"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                    />
                  </div>
                  <div className="row mb-3">
                    <div className="col">
                      <label>Expiry</label>
                      <input
                        className="form-control"
                        placeholder="MM/YY"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                      />
                    </div>
                    <div className="col">
                      <label>CVV</label>
                      <input
                        className="form-control"
                        type="password"
                        placeholder="123"
                        value={cardCVV}
                        onChange={(e) => setCardCVV(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={handleCheckout}
              className="btn btn-success w-100"
            >
              Place Order
            </button>
          </div>
        </div>

        {/* Right: Order Summary */}
        <div className="col-md-5">
          <div className="card shadow p-4">
            <h4 className="mb-3">Order Summary</h4>
            {items.length === 0 ? (
              <p>Your cart is empty.</p>
            ) : (
              <>
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="d-flex justify-content-between mb-2"
                  >
                    <div>
                      {item.menuItem.name} × {item.quantity}
                    </div>
                    <div>₹{item.menuItem.price * item.quantity}</div>
                  </div>
                ))}
                <hr />
                <div className="d-flex justify-content-between mb-2">
                  <span>Subtotal:</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span>Delivery Fee:</span>
                  <span>₹{deliveryFee.toFixed(2)}</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span>Tax (5%):</span>
                  <span>₹{tax.toFixed(2)}</span>
                </div>
                <hr />
                <div className="d-flex justify-content-between fw-bold fs-5">
                  <span>Total:</span>
                  <span>₹{totalAmount.toFixed(2)}</span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
