import { useContext, useState } from "react";
import { AuthContext } from "../../Contexts/AuthContext";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import logo from "../../imgs/logo.svg";
import avatar from "../../imgs/Avatar.png";
import { FaBoxArchive } from "react-icons/fa6";

import NotificationBell from "../../components/Header/Notifications";
import {
  MdShoppingCart,
  MdOutlineInventory2,
  MdOutlineShoppingCart,
} from "react-icons/md";
import { NavLink } from "react-router";
import Offcanvas from "react-bootstrap/Offcanvas";
import {
  FaRegUser,
  FaUser,
  FaHeart,
  FaRegHeart,
  FaHome,
  FaList,
  FaHeadset,
  FaGlobe,
} from "react-icons/fa";
import { IoBusiness } from "react-icons/io5";
import { useTranslation } from "react-i18next";
import SearchBox from "./SearchBox";
import { useOrder } from "../../Contexts/OrdersContext";
import { useCart } from "../../Contexts/CartContext";
import { useFavourite } from "../../Contexts/FavouriteContext"; 
import OffcanvasCart from "../OffcanvasCart";

const CartBadge = ({ count }) =>
  count > 0 ? (
    <span
      className="position-absolute badge rounded-pill"
      style={{
        top: "-8px",
        right: "-10px",
        backgroundColor: "#F0345D",
        fontSize: "10px",
      }}
    >
      {count}
    </span>
  ) : null;

const WepNavbar = () => {
  const { ordersCount } = useOrder();
  const { token } = useContext(AuthContext);
  const { cartCount } = useCart();
  const { favouritesCount } = useFavourite(); 

  const { t, i18n } = useTranslation();
  const isArabic = i18n.resolvedLanguage === "ar";

  const toggleLanguage = () => {
    i18n.changeLanguage(isArabic ? "en" : "ar");
  };

  const [showCart, setShowCart] = useState(false);
  const handleCloseCart = () => setShowCart(false);
  const handleShowCart = () => setShowCart(true);

  return (
    <Navbar expand="lg" className="backGroung-white ">
      <Container>
        <div className="d-flex align-items-center gap-2">
          <Navbar.Toggle
            aria-controls="offcanvasNavbar-expand-lg"
            className="border-0 p-0 me-2"
          />
          <Navbar.Brand href="/">
            <img src={logo} alt="logo" />
          </Navbar.Brand>
        </div>

        <div className="ms-lg-5 order-lg-0 order-md-0 order-1 my-lg-0 my-3">
          <SearchBox />
        </div>

        <div className="d-lg-none d-flex gap-3 align-items-center">
          <NavLink to="/favourites" className="text-dark position-relative">
            <FaHeart className="fs-2" style={{ color: "#F0345D" }} />
            {favouritesCount > 0 && (
              <span
                className="position-absolute badge rounded-pill"
                style={{
                  top: "-8px",
                  right: "-10px",
                  backgroundColor: "#F0345D",
                  fontSize: "10px",
                }}
              >
                {favouritesCount}
              </span>
            )}
          </NavLink>
          <button
            type="button"
            className="btn btn-link text-dark p-0 text-decoration-none position-relative"
            onClick={handleShowCart}
          >
            <MdOutlineShoppingCart className="fs-2" />
            <CartBadge count={cartCount} />
          </button>
          <NavLink to="/profile" className="text-dark">
            <FaRegUser className="fs-2" />
          </NavLink>
        </div>

        <Navbar.Offcanvas
          id="offcanvasNavbar-expand-lg"
          aria-labelledby="offcanvasNavbarLabel-expand-lg"
          placement="end"
        >
          <Offcanvas.Header closeButton className="px-5 py-3 bg-body-secondary">
            <div>
              <NavLink to="/">
                <img src={avatar} alt="avatar" />
              </NavLink>
              <div className="d-flex align-items-center mt-3">
                <NavLink to="/Sigin" className="nav-link">
                  {t("header.sign_in")}
                </NavLink>
                <span className="mx-2 ">|</span>
                <NavLink to="/Login" className="nav-link">
                  {t("header.register")}
                </NavLink>
              </div>
            </div>
          </Offcanvas.Header>

          <Offcanvas.Body>
            <Nav className="ms-auto d-lg-flex d-none gap-4 align-items-center">
              <NavLink
                to="/profile"
                className="d-flex flex-column align-items-center text-muted mt-2"
              >
                <FaUser className="fs-5" />
                <span>{t("header.profile")}</span>
              </NavLink>
              {token && (
                <div className="d-flex flex-column align-items-center text-muted">
                  <NotificationBell />
                  <span>{t("header.notifications")}</span>
                </div>
              )}

              <NavLink
                to="/favourites"
                className="position-relative d-flex flex-column align-items-center text-muted mt-2 text-decoration-none"
              >
                <span className="position-relative">
                  <FaHeart className="fs-5"  />
                  {favouritesCount > 0 && (
                    <span
                      className="position-absolute  badge d-flex align-items-center justify-content-center rounded-circle"
                      style={{
                        width: "20px",
                        height: "20px",
                        top: "-10px",
                        right:"-10px",
                        backgroundColor: "#F0345D",
                        fontSize: "10px",
                      }}
                    >
                      {favouritesCount}
                    </span>
                  )}
                </span>
                <span>{t("header.favorites") || "Favorites"}</span>
              </NavLink>

              <NavLink
                to="/orders"
                className="position-relative d-flex flex-column align-items-center text-muted mt-2"
              >
                <FaBoxArchive className="fs-5" />
                <span>{t("header.orders")}</span>
                {ordersCount > 0 && (
                  <span
                    className="position-absolute end-0 badge d-flex align-items-center justify-content-center rounded-circle"
                     style={{
                        width: "20px",
                        height: "20px",
                        top: "-10px",
                        backgroundColor: "#F0345D",
                        fontSize: "10px",
                      }}
                  >
                    {ordersCount}
                  </span>
                )}
              </NavLink>

              <button
                type="button"
                className="btn btn-link text-muted text-decoration-none d-flex flex-column align-items-center p-0 mt-2 shadow-none"
                onClick={handleShowCart}
              >
                <span className="position-relative">
                  <MdShoppingCart className="fs-5" />
                  <CartBadge count={cartCount} />
                </span>
                <span>{t("header.my_cart")}</span>
              </button>
            </Nav>

            <Nav className="flex-column py-2 d-lg-none">
              <NavLink to="/" className="nav-link d-flex align-items-center gap-3 px-3 py-2 text-muted">
                <FaHome className="text-muted fs-5 opacity-75" />
                <span className="fw-semibold">{t("header.home")}</span>
              </NavLink>
              <NavLink to="/" className="nav-link d-flex align-items-center gap-3 px-3 py-2 text-muted">
                <FaList className="text-muted fs-5 opacity-75" />
                <span className="fw-semibold">{t("header.categories")}</span>
              </NavLink>
              <NavLink to="/favourites" className="nav-link d-flex align-items-center gap-3 px-3 py-2 text-muted">
                <FaHeart className="fs-5"  />
                <span className="fw-semibold">{t("header.favorites") || "Favorites"}</span>
              </NavLink>
              <NavLink to="/orders" className="nav-link d-flex align-items-center gap-3 px-3 py-2 text-muted">
                <MdOutlineInventory2 className="text-muted fs-5 opacity-75" />
                <span className="fw-semibold">{t("header.my_orders")}</span>
              </NavLink>

              <hr className="my-2 text-muted opacity-25" />

              <NavLink to="/" className="nav-link d-flex align-items-center gap-3 px-3 py-2">
                <FaHeadset className="text-muted fs-5 opacity-75" />
                <span className="fw-semibold">{t("header.contact_us")}</span>
              </NavLink>
              <NavLink to="/" className="nav-link d-flex align-items-center gap-3 px-3 py-2 ">
                <IoBusiness className="text-muted fs-5 opacity-75" />
                <span className="fw-semibold">{t("header.about")}</span>
              </NavLink>

              <hr className="my-2 text-muted opacity-25" />

              <NavLink to="/" className="nav-link px-3 py-2 ">
                <span className="fw-semibold">{t("header.user_agreement")}</span>
              </NavLink>
              <NavLink to="/" className="nav-link px-3 py-2 ">
                <span className="fw-semibold">{t("header.partnership")}</span>
              </NavLink>
              <NavLink to="/" className="nav-link px-3 py-2 ">
                <span className="fw-semibold">{t("header.privacy_policy")}</span>
              </NavLink>
              <hr className="my-2 text-muted opacity-25" />

              <button
                type="button"
                onClick={toggleLanguage}
                aria-label={t("change_language")}
                className="btn btn-outline-secondary btn-sm d-flex align-items-center justify-content-center gap-2 rounded-pill mx-3 my-2"
              >
                <FaGlobe className="fs-6" />
                <span>{isArabic ? "English" : "العربية"}</span>
              </button>
            </Nav>
          </Offcanvas.Body>
        </Navbar.Offcanvas>
      </Container>

      <OffcanvasCart show={showCart} handleClose={handleCloseCart} />
    </Navbar>
  );
};

export default WepNavbar;