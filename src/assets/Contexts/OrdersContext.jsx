import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { AuthContext } from "./AuthContext";
import { API_Config } from "../Config/API-Config";
import {
  normalizeOrder,
  unwrapList,
  unwrapOne,
} from "../Pages/Orders/Orderutils";

export const OrderContext = createContext();

const ORDER_URL = `${API_Config.Base_URL}/${API_Config.ENDPOINTS?.ORDER || "order"}`;

const errorFrom = async (res) => {
  const body = await res.json().catch(() => null);
  return new Error(body?.message || `HTTP error! Status: ${res.status}`);
};

export const OrderProvider = ({ children }) => {
  const { token } = useContext(AuthContext);

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const authHeaders = {
    Authorization: `Bearer ${token}`,
    Accept: "application/json",
  };

  const fetchOrders = useCallback(async () => {
    if (!token) {
      setOrders([]);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(ORDER_URL, { headers: authHeaders });
      if (!res.ok) throw await errorFrom(res);
      const json = await res.json();
      setOrders(unwrapList(json).map(normalizeOrder));
    } catch (e) {
      console.error("Failed to fetch orders:", e.message);
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const fetchOrderById = async (id) => {
    const res = await fetch(`${ORDER_URL}/${id}`, { headers: authHeaders });
    if (!res.ok) throw await errorFrom(res);
    return normalizeOrder(unwrapOne(await res.json()));
  };

  const cancelOrder = async (id, comment) => {
    const res = await fetch(`${ORDER_URL}/${id}`, {
      method: "DELETE",
      headers: { ...authHeaders, "Content-Type": "application/json" },
      body: JSON.stringify({ comment }),
    });
    if (!res.ok) throw await errorFrom(res);
    await fetchOrders();
  };

  const placeOrder = async ({
    note,
    payment_type,
    address_id,
    coupon_code,
  }) => {
    const payload = { note, payment_type, address_id };
    if (coupon_code) payload.coupon_code = coupon_code;

    const res = await fetch(ORDER_URL, {
      method: "POST",
      headers: { ...authHeaders, "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw await errorFrom(res);
    const json = await res.json();
    await fetchOrders();
    return json;
  };

  const ordersCount = orders.length;

  const [OrderIds, setOrderIds] = useState(() => {
    const SavedOrders = localStorage.getItem("OrderedProducts");
    return SavedOrders ? JSON.parse(SavedOrders) : [];
  });

  useEffect(() => {
    localStorage.setItem("OrderedProducts", JSON.stringify(OrderIds));
  }, [OrderIds]);

  const addOrder = (id) => {
    setOrderIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
  };
  const removeOrder = (id) => {
    setOrderIds((prev) => prev.filter((item) => item !== id));
  };

  return (
    <OrderContext.Provider
      value={{
        orders,
        loading,
        error,
        ordersCount,
        fetchOrders,
        fetchOrderById,
        cancelOrder,
        placeOrder,
        OrderIds,
        addOrder,
        removeOrder,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export const useOrder = () => useContext(OrderContext);