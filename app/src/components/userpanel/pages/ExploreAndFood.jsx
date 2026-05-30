import { useRef, useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../../contexts/CartContext";
import { toast } from "react-toastify";
import { categories } from "../../../assets/assets";

function ExploreAndFood() {
  const scrollRef = useRef(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedVegType, setSelectedVegType] = useState(null); // NEW
  const [minPrice, setMinPrice] = useState(0); // NEW
  const [maxPrice, setMaxPrice] = useState(1000); // NEW

  const [items, setItems] = useState([]);
  const { setCartCount } = useCart();
  const navigate = useNavigate();

  const scrollLeft = () => {
    scrollRef.current.scrollBy({
      left: -300,
      behavior: "smooth",
    });
  };

  const scrollRight = () => {
    scrollRef.current.scrollBy({
      left: 300,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("http://localhost:1234/api/admin/getall", {
          withCredentials: true,
        });
        setItems(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, []);

  const addToCart = async (menuItemId) => {
    const role = localStorage.getItem("role");

    if (!role || role === "admin") {
      toast.info("⚠️ Please sign in as a customer to add items to your cart.", {
        onClose: () => navigate("/log"),
      });
      return;
    }

    try {
      await axios.post(
        "http://localhost:1234/api/cart/add",
        null,
        {
          params: {
            menuItemId: menuItemId,
            quantity: 1,
          },
          withCredentials: true,
        }
      );

      const countRes = await axios.get("http://localhost:1234/api/cart/count", {
        withCredentials: true,
      });
      setCartCount(countRes.data);

      toast.success("✅ Item added to your cart!");
    } catch (err) {
      console.log(err);
      toast.error("❌ Something went wrong. Please try again.");
    }
  };

  // ✅ Combined filters
  async function fetchFilteredItems(selectedCategory, selectedVegType, minPrice, maxPrice) {
    try {
      const params = {};

      if (selectedCategory && selectedCategory.toLowerCase() !== "all") {
        params.category = selectedCategory.toLowerCase();
      }

      if (selectedVegType && selectedVegType.toLowerCase() !== "all") {
        params.type = selectedVegType.toLowerCase(); // assuming backend uses 'type' for veg/non-veg
      }

      if (minPrice != null) {
        params.minPrice = minPrice;
      }

      if (maxPrice != null) {
        params.maxPrice = maxPrice;
      }

      const response = await axios.get("http://localhost:1234/api/admin/filter", {
        params: params,
      });

      return response.data; // filtered items from backend

    } catch (error) {
      console.error("Error fetching filtered items:", error);
      return [];
    }
  }
  const [filteredItems, setFilteredItems] = useState([]);

  useEffect(() => {
    const loadFilteredItems = async () => {
      const data = await fetchFilteredItems(selectedCategory, selectedVegType, minPrice, maxPrice);
      setFilteredItems(data);
    };
    loadFilteredItems();
  }, [selectedCategory, selectedVegType, minPrice, maxPrice]);

  return (
    <div className="explore-menu position-relative">
      <h1 className="d-flex align-items-center justify-content-between">
        Explore our menu
        <div className="d-flex">
          <i
            className="bi bi-arrow-left-circle scroll-icon"
            onClick={scrollLeft}
            style={{ cursor: "pointer", fontSize: "2rem", marginRight: "10px" }}
          ></i>
          <i
            className="bi bi-arrow-right-circle scroll-icon"
            onClick={scrollRight}
            style={{ cursor: "pointer", fontSize: "2rem" }}
          ></i>
        </div>
      </h1>
      <p>Explore curated lists of dishes from top categories</p>

      {/* CATEGORIES SCROLL */}
      <div
        ref={scrollRef}
        className="d-flex gap-4 overflow-auto explore-menu-list py-2"
        style={{ scrollBehavior: "smooth" }}
      >
        {categories.map((item) => (
          <div
            key={item.category}
            className={`text-center flex-shrink-0 ${
              selectedCategory === item.category ? "border border-primary rounded-circle" : ""
            }`}
            onClick={() => setSelectedCategory(item.category)}
            style={{ cursor: "pointer" }}
          >
            <img
              src={item.icon}
              alt={item.category}
              style={{
                width: "150px",
                height: "150px",
                objectFit: "cover",
                borderRadius: "50%",
                display: "block",
              }}
            />
            <p className="mt-2">{item.category}</p>
          </div>
        ))}
      </div>

      <div className="d-flex flex-wrap align-items-center gap-3">

  {/* Veg/Non-Veg Filter with gap between buttons */}
<div className="btn-group mb-3" style={{ gap: '8px' }}>
  <button
    className={`btn btn-sm ${selectedVegType === null ? "btn-primary" : "btn-outline-primary"}`}
    onClick={() => setSelectedVegType(null)}
  >
    All
  </button>
  <button
    className={`btn btn-sm ${selectedVegType === "veg" ? "btn-success" : "btn-outline-success"}`}
    onClick={() => setSelectedVegType("veg")}
  >
    Veg
  </button>
  <button
    className={`btn btn-sm ${selectedVegType === "non-veg" ? "btn-danger" : "btn-outline-danger"}`}
    onClick={() => setSelectedVegType("non-veg")}
  >
    Non-Veg
  </button>
</div>

{/* Price Range Filter */}
<div className="d-flex align-items-center gap-2 mb-3">
  <input
    type="number"
    min="0"
    value={minPrice}
    onChange={(e) => setMinPrice(Number(e.target.value))}
    className="form-control form-control-sm"
    style={{ width: "80px" }}
    placeholder="Min ₹"
  />
  <span>to</span>
  <input
    type="number"
    min="0"
    value={maxPrice}
    onChange={(e) => setMaxPrice(Number(e.target.value))}
    className="form-control form-control-sm"
    style={{ width: "80px" }}
    placeholder="Max ₹"
  />
</div>



</div>


      {/* FOOD DISPLAY */}
      <div className="container py-4">
        <h2 className="mb-4">
          {selectedCategory ? `${selectedCategory} Items` : "All Items"}
        </h2>
        <div className="row">
          {filteredItems.map((item) => (
            <div key={item.id} className="col-md-4 mb-4 d-flex">
              <div className="card shadow-sm rounded-4 overflow-hidden w-100">
                <img
                  src={`http://localhost:1234/api/admin/images/${item.imageUrl}`}
                  className="card-img-top"
                  alt={item.name}
                  style={{ height: "200px", objectFit: "cover" }}
                />
                <div className="card-body">
                  <h5 className="card-title">{item.name}</h5>
                  <p className="card-text text-muted" style={{ minHeight: "48px" }}>
                    {item.description}
                  </p>
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="h5 mb-0">
                      ₹ {item.price.toLocaleString("en-IN")}
                    </span>
                    <div>
                      <i className="bi bi-star-fill text-warning"></i>
                      <i className="bi bi-star-fill text-warning"></i>
                      <i className="bi bi-star-fill text-warning"></i>
                      <i className="bi bi-star-fill text-warning"></i>
                      <i className="bi bi-star-half text-warning"></i>
                      <small className="text-muted ms-1">(4.5)</small>
                    </div>
                  </div>
                </div>
                <div className="card-footer bg-light border-0 d-flex justify-content-center">
                  <button
                    className="btn btn-outline-primary btn-sm"
                    onClick={() => addToCart(item.id)}
                  >
                    <i className="bi bi-cart"></i> Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
          {filteredItems.length === 0 && (
            <p>No items found for your filters.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default ExploreAndFood;
