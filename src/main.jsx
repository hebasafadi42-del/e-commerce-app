import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { BrowserRouter, Routes, Route } from "react-router";
import "./i18n";
import "./index.css";
import App from "./App.jsx";
import { OrderProvider } from "./assets/Contexts/OrdersContext.jsx";
import { AuthProvider } from "./assets/Contexts/AuthContext.jsx";
import { ThemeProvider } from "./assets/Contexts/ThemeContext.jsx";
import { CartProvider } from "./assets/Contexts/CartContext.jsx";
import { AdminProvider } from "./assets/Contexts/AdminContext.jsx";
import { FavouriteProvider } from "./assets/Contexts/FavouriteContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
    <AdminProvider>
       <AuthProvider>
        <OrderProvider>
          <ThemeProvider>
            <FavouriteProvider>
             <CartProvider>
              <App />
            </CartProvider>
            </FavouriteProvider>
          </ThemeProvider>
        </OrderProvider>
      </AuthProvider>
    </AdminProvider>
    </BrowserRouter>
  </StrictMode>,
);
