import { useContext } from "react";
import { useTranslation } from "react-i18next";
import { AuthContext } from "../../../Contexts/AuthContext";
import { Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router";
import Avatar from "../../../imgs/Avatar.png";
import useCategories from "../../../Hooks/useCategories";


const MainSec1 = () => {
  const { user, token, logout } = useContext(AuthContext);
  const { t } = useTranslation();
    const { categories} = useCategories();
    const MAX_CATEGORIES = 8;



  return (
    <Container className="backGroung-white border-style my-4 rounded-1 p-4">
      <Row className="gy-3">
        <Col
          xs={6}
          sm={6}
          md={6}
          lg={2}
          className="order-lg-1 order-md-3 order-3"
        >
          <div className="d-lg-flex d-md-flex d-none flex-column gap-2">
            {categories.slice(0, MAX_CATEGORIES).map((item) => (
              <Link
                className="p-2 categ-Hover text-muted rounded-2"
                 key={item.id}
                to={`/category/${item.id}`}
              >
               {item.name}
              </Link>
            ))}
          </div>
        </Col>

        <Col
          xs={12}
          sm={12}
          md={6}
          lg={3}
          className="order-lg-3 order-md-2 order-2"
        >
          <Row>
            <Col md={12} lg={12}>
              <div className="Group1 light-blur-bg p-3 rounded-2 mb-4">
                <div className="avatar d-flex align-items-center gap-2">
                  <img src={Avatar} alt="Avatar" />
                  <p className="m-0 fw-medium">
                    {t("home.greeting", {
                      name: token ? user?.name : t("home.guest"),
                    })}
                    <br />
                    {t("home.get_started")}
                  </p>
                </div>

                {!token && (
                  <Link
                    to="/log-up"
                    className="btn-hover text-white d-flex align-items-center justify-content-center p-2 bg-gradientButton rounded-3 my-2"
                  >
                    {t("home.join_now")}
                  </Link>
                )}

                {token ? (
                  <button
                    type="button"
                    onClick={logout}
                    className="btn-hover d-flex align-items-center justify-content-center p-2 bg-white text-pink rounded-3 my-2 border-0 w-100"
                  >
                    {t("home.log_out")}
                  </button>
                ) : (
                  <Link
                    to="/log-in"
                    className="btn-hover d-flex align-items-center justify-content-center p-2 bg-white text-pink rounded-3 my-2"
                  >
                    {t("home.log_in")}
                  </Link>
                )}
              </div>
            </Col>

            <Col xs={6} sm={6} md={6} lg={12}>
              <div
                style={{ backgroundColor: "#F38332" }}
                className="d-lg-block   Group2 px-3 py-4 rounded-2 my-lg-2 mb-lg-3 mb-md-0 mb-3"
              >
                <Link to="/" className="text-white font-size">
                  {t("home.promo_discount")}
                </Link>
              </div>
            </Col>

            <Col xs={6} sm={6} md={6} lg={12}>
              <div
                style={{ backgroundColor: "#F0728D" }}
                className="d-lg-block   Group2 px-3 py-4 rounded-2"
              >
                <Link to="/" className="text-white font-size">
                  {t("home.promo_quotes")}
                </Link>
              </div>
            </Col>
          </Row>
        </Col>

        <Col sm={12} md={12} lg={7}  className="order-lg-2 order-md-1 order-1">
          <div className="bg-image p-5">
           
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default MainSec1;
