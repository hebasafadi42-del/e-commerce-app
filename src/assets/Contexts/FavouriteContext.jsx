import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { AuthContext } from "../Contexts/AuthContext";
import { API_Config } from "../Config/API-Config";

const FAVOURITE_URL = `${API_Config.Base_URL}/${API_Config.ENDPOINTS.FAVOURITES}`;

const FavouriteContext = createContext(null);

const getProductId = (fav) => fav.product_id ?? fav.product?.id ?? fav.id;

export const FavouriteProvider = ({ children }) => {
  const { token } = useContext(AuthContext);
  const [favourites, setFavourites] = useState([]);
  const [loading, setLoading] = useState(false);

  const headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  const fetchFavourites = useCallback(async () => {
    if (!token) {
      setFavourites([]);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(FAVOURITE_URL, { headers });
      if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
      const json = await res.json();
      const raw = json.data ?? json.favorites ?? json;
      setFavourites(
        Array.isArray(raw) ? raw : Array.isArray(raw?.data) ? raw.data : [],
      );
    } catch (e) {
      console.error("Failed to fetch favourites:", e.message);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchFavourites();
  }, [fetchFavourites]);

  const isFavourite = (productId) =>
    favourites.some((f) => String(getProductId(f)) === String(productId));

  const toggleFavourite = async (productId) => {
    if (!token) return { success: false, message: "Please log in first" };

    const existing = favourites.find(
      (f) => String(getProductId(f)) === String(productId),
    );

    try {
      if (existing) {
       
        const deleteId = existing.id;

        setFavourites((prev) => prev.filter((f) => f !== existing));
        const res = await fetch(`${FAVOURITE_URL}/${deleteId}`, {
          method: "DELETE",
          headers,
        });
        if (!res.ok) {
          setFavourites((prev) => [...prev, existing]);
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
      } else {
        const res = await fetch(FAVOURITE_URL, {
          method: "POST",
          headers,
          body: JSON.stringify({ product_id: productId }),
        });
        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
        await fetchFavourites(); 
      }
      return { success: true };
    } catch (e) {
      console.error("Failed to toggle favourite:", e.message);
      return { success: false, message: e.message };
    }
  };

  return (
    <FavouriteContext.Provider
      value={{
        favourites,
        favouritesCount: favourites.length,
        loading,
        isFavourite,
        toggleFavourite,
        fetchFavourites,
      }}
    >
      {children}
    </FavouriteContext.Provider>
  );
};

export const useFavourite = () => useContext(FavouriteContext);