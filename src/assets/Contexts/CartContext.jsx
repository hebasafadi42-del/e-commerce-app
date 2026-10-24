import React, { createContext, useContext, useState, useEffect } from "react";
import { AuthContext } from "./AuthContext";
import { API_Config } from "../Config/API-Config";

const CartContext = createContext();

const CART_URL = `${API_Config.Base_URL}/${API_Config.ENDPOINTS.CART}`;

const COUPONS = {
  MAY26: { type: "percent", value: 10 }, 
};

export const CartProvider = ({ children }) => {
  const { token } = useContext(AuthContext);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState(null); 

  const fetchCart = () => {
    if (!token) {
      setCartItems([]);
      return Promise.resolve();
    }

    setLoading(true);
    return fetch(CART_URL, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        return response.json();
      })
      .then((data) => {
        setCartItems(data.data || data.items || data);
      })
      .catch((error) => {
        console.error("Failed to fetch cart items:", error.message);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchCart();
    if (!token) setAppliedCoupon(null);
  }, [token]);

  const addToCart = (productId, quantity = 1, productVariantId = null) => {
    if (!token) return Promise.resolve();

    const payload = { product_id: productId, quantity };
    if (productVariantId) payload.product_variant_id = productVariantId;

    return fetch(CART_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then((response) => {
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        return response.json();
      })
      .then(() => fetchCart()) 
      .catch((error) => {
        console.error("Failed to add item to cart:", error.message);
      });
  };

  const removeFromCart = (cartItemId) => {
    if (!token) return;

    fetch(`${CART_URL}/${cartItemId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        return response.json();
      })
      .then(() => {
        setCartItems((prev) => prev.filter((item) => item.id !== cartItemId));
      })
      .catch((error) => {
        console.error("Failed to remove item from cart:", error.message);
      });
  };

  const updateQuantity = (cartItemId, newQty) => {
    const qty = Math.max(1, Number(newQty) || 1);
    setCartItems((prev) =>
      prev.map((item) => (item.id === cartItemId ? { ...item, quantity: qty } : item))
    );
  };

  const applyCoupon = (code) => {
    const key = (code || "").trim().toUpperCase();
    const coupon = COUPONS[key];
    if (!coupon) {
      return { success: false, message: "Invalid coupon code" };
    }
    setAppliedCoupon({ code: key, ...coupon });
    return { success: true, message: "Coupon applied successfully" };
  };

  const removeCoupon = () => setAppliedCoupon(null);

  const cartCount = Array.isArray(cartItems) ? cartItems.length : 0;

  return (
    <CartContext.Provider
      value={{
        cartItems,
        loading,
        cartCount,
        appliedCoupon,
        fetchCart,
        addToCart,
        removeFromCart,
        updateQuantity,
        applyCoupon,
        removeCoupon,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);