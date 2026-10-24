import { useEffect, useState } from "react";
import { API_Config } from "../Config/API-Config";

const useCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    const url = `${API_Config.Base_URL}/${API_Config.ENDPOINTS.CATEGORIES}`;

    fetch(url, { headers: { Accept: "application/json" } })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch categories");
        return res.json();
      })
      .then((data) => {
        // console.log("Categories response:", data); 
        const list = data?.data?.data || data?.data || data;
        setCategories(Array.isArray(list) ? list : []);
      })
      .catch((err) => setErrorMsg(err.message))
      .finally(() => setLoading(false));
  }, []);

  return { categories, loading, errorMsg };
};

export default useCategories;