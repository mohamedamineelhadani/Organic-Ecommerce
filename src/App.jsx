import React, { useState, useEffect } from "react";
import { ShoppingBag } from "lucide-react";
import Header from "./layouts/Header";
import Footer from "./layouts/Footer";
import Home from "./pages/Home";
import About from "./pages/About";
import Steps from "./pages/Steps";
import Products from "./pages/Products";
import Questions from "./pages/Questions";
import Contact from "./pages/Contact";
import AuthSystem from "./auth/AuthSystem";
import Cart from "./components/Cart";
import Orders from "./pages/Orders";
import ScrollToTop from "./components/ScrollToTop";
import CheckoutPage from "./components/Checkout";
import { useCart } from "./context/CartContext";

function App() {
  const [login, setLogin] = useState(false);
  const [cart, setCart] = useState(false);
  const [checkout, setCheckout] = useState(false);
  const { cartCount } = useCart();

  const openLogin = () => setLogin(true);
  const closeLogin = () => setLogin(false);
  const openCart = () => setCart(true);
  const closeCart = () => setCart(false);
  const openCheckout = () => {
    setCart(false);
    setCheckout(true);
  };
  const closeCheckout = () => setCheckout(false);

  useEffect(() => {
    if (checkout || cart || login) {
      document.body.classList.add("remove-scroll");
    } else {
      document.body.classList.remove("remove-scroll");
    }
    return () => document.body.classList.remove("remove-scroll");
  }, [checkout, cart, login]);




  return (
    <>
      <Header openLogin={openLogin} />
      <main className="main">
        <Home />
        <About />
        <Steps />
        <Products />
        <Questions />
        <Contact />
        <Orders />
        <Cart display={cart} closeCart={closeCart} openCheckout={openCheckout} />
        <CheckoutPage display={checkout} closeCheckout={closeCheckout} />
        <div className="main-btns">
          <button onClick={openCart} className="open-cart-btn">
            <ShoppingBag className="icon" />
            {cartCount > 0 && (
              <span className="cart-btn-badge">{cartCount}</span>
            )}
          </button>
          <ScrollToTop />
        </div>
        <AuthSystem display={login} closeLogin={closeLogin} />
      </main>
      <Footer />
    </>
  );
}

export default App;