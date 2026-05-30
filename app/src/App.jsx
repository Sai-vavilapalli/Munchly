import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import 'bootstrap/dist/css/bootstrap.min.css'; // Bootstrap styles first
import './index.css'; // Your custom theme next
import './app.css';


import "bootstrap-icons/font/bootstrap-icons.css";

import Home from "./components/adminpanel/homepage/Home";
import Admindashboard from "./components/adminpanel/Admindashboard";
import Sidebar from "./components/adminpanel/homepage/Sidebar";
import Menubar from "./components/adminpanel/homepage/Menubar";

import Homepage from "./components/userpanel/Homepage";
import Register from "./components/userpanel/Register";
import Login from "./components/userpanel/Login";
import CartPage from "./components/userpanel/CartPage";
import Orderpage from "./components/userpanel/Orderpage";
import CheckoutPage from "./components/userpanel/Checkout";
import Explore from "./components/Explore";

import AddFood from "./components/adminpanel/pages/AddFood";
import ListFood from "./components/adminpanel/pages/ListFood";
import AdminOrder from "./components/adminpanel/pages/adminorder";
import Navbar from "./components/userpanel/pages/navbar";
import Carousel from "./components/userpanel/pages/Carousel";
import ExploreMenu from "./components/userpanel/pages/ExploreMenu";
import Fooddisplay from "./components/userpanel/pages/Fooddisplay";

import { CartProvider } from "./contexts/CartContext";
import ExploreAndFood from "./components/userpanel/pages/ExploreAndFood";
import About from "./components/userpanel/pages/About";

function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        {/* ✅ Correct place for global ToastContainer */}
        <ToastContainer position="top-right" autoClose={2000} />
        
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/home" element={<Home />} />
          <Route path="/admin" element={<Admindashboard />} />
          <Route path="/sidebar" element={<Sidebar />} />
          <Route path="/menubar" element={<Menubar />} />

          <Route path="/homepage" element={<Homepage />} />
          <Route path="/navbar" element={<Navbar />} />
          <Route path="/carousel" element={<Carousel />} />
          <Route path="/exploremenu" element={<ExploreMenu />} />
          <Route path="/fooddisplay" element={<Fooddisplay />} />
          <Route path="/exploreandfood" element={<ExploreAndFood />} />
          <Route path="/about" element={<About />} />

          <Route path="/reg" element={<Register />} />
          <Route path="/log" element={<Login />} />
          <Route path="/orders" element={<Orderpage />} />
          <Route path="/cart" element={<CartPage />} />

          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/explore" element={<Explore />} />

          <Route path="/addfood" element={<AddFood />} />
          <Route path="/listfood" element={<ListFood />} />
          <Route path="/adminorder" element={<AdminOrder />} />
        </Routes>
      </BrowserRouter>
    </CartProvider>
  );
}

export default App;
