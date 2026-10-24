import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../Contexts/AuthContext"; 
import { API_Config } from "../Config/API-Config";

const NOTIFICATIONS_URL = `${API_Config.Base_URL}/${API_Config.ENDPOINTS.NOTIFICATIONS}`;

const useNotifications = () => {
  const { token } = useContext(AuthContext);

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!token) {
      setNotifications([]);
      setLoading(false);
      return;
    }

    let ignore = false;
    setLoading(true);
    setError(null);

    fetch(NOTIFICATIONS_URL, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (res.status === 401) throw new Error("Please log in first");
        if (!res.ok) throw new Error("Something went wrong");
        return res.json();
      })
      .then((data) => {
        if (ignore) return;
        // console.log(data);
        const list = data?.data?.data || data?.data || [];
        setNotifications(Array.isArray(list) ? list : []);
      })
      .catch((err) => {
        if (!ignore) setError(err.message);
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [token]);

  return { notifications, loading, error };
};

export default useNotifications;