import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import Button from "react-bootstrap/Button";
import { NavLink } from "react-router";
import CategoryDropdown from "./CategoryDropdown";
import { useTranslation } from "react-i18next";
import { FaGlobe } from "react-icons/fa6";
import { useTheme } from "../../Contexts/ThemeContext";

const MainNav = () => {
    const { theme, toggleTheme } = useTheme();

  const { t, i18n } = useTranslation();
  const isArabic = i18n.resolvedLanguage === "ar";

  const toggleLanguage = () => {
    i18n.changeLanguage(isArabic ? "en" : "ar");
  };

  return (
    <Navbar
      expand="lg"
      className="d-lg-block d-none border-top border-bottom border-2 border-light-subtle py-2 backGroung-white"
    >
      <Container
        fluid="xxl"
        className="d-flex align-items-center justify-content-between"
      >
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto align-items-center">
            <CategoryDropdown />
            <NavLink to="/" className="nav-link fw-semibold">
              {t("nav.hot_offers")}
            </NavLink>
            <NavLink to="/" className="nav-link fw-semibold">
              {t("nav.gift_boxes")}
            </NavLink>
            <NavLink to="/about-us" className="nav-link fw-semibold">
              {t("nav.about_us")}
            </NavLink>
            <NavDropdown
              title={t("nav.help")}
              id="basic-nav-dropdown"
              className="fw-semibold"
            >
              <NavDropdown.Item as={NavLink} to="/contact-us">
                {t("nav.contact_us")}
              </NavDropdown.Item>
              <NavDropdown.Item as={NavLink} to="/returns-refunds">
                {t("nav.returns_refunds")}
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>

          <Button
            variant="outline-secondary"
            size="sm"
            onClick={toggleLanguage}
            aria-label={t("change_language")}
            className="d-flex align-items-center gap-2 rounded-pill px-3 py-1 fw-medium border-1 shadow-sm ms-auto"
          >
            <FaGlobe className="fs-5" />
            <span>{isArabic ? "English" : "العربية"}</span>
          </Button>
          <Button
      variant={theme === "light" ? "outline-dark" : "outline-light"}
      onClick={toggleTheme}
      className="ms-3 rounded-4 p-2"
    >
      {theme === "light" ? "🌙" : "☀️"}
    </Button>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default MainNav;
