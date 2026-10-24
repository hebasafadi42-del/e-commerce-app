import { Button, Col } from "react-bootstrap";
import { Link } from "react-router";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { BsCartPlus, BsCartDash } from "react-icons/bs";

import RatingStars from "./RatingStars";
import { useFavourite } from "../../Contexts/FavouriteContext";
import { useCart } from "../../Contexts/CartContext";

const BRAND = "#F0345D";

const FALLBACK_IMG =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120"><rect width="120" height="120" fill="#EEE"/></svg>`
  );

const formatPrice = (value) => {
  const n = Number(value);
  return Number.isFinite(n) ? n.toFixed(2) : "0.00";
};

const ProductsCardItem = ({ item, isList }) => {
  const { isFavourite, toggleFavourite } = useFavourite();
  const { cartItems, addToCart, removeFromCart } = useCart();

  
  const isFav = isFavourite(item.id);

 
  const cartItem = (Array.isArray(cartItems) ? cartItems : []).find(
    (ci) => String(ci.product_id ?? ci.product?.id) === String(item.id)
  );
  const inCart = !!cartItem;

  const handleCartClick = () => {
    if (inCart) {
      removeFromCart(cartItem.id);
    } else {
      addToCart(item.id, 1);
    }
  };

  const name = item.name ?? item.title ?? "";
  const hasRating = item.rating !== undefined && item.rating !== null;
  const detailsPath = `/product/${item.id}`;

  const cartButton = (
    <Button
      variant="light"
      onClick={handleCartClick}
      className="border p-2 rounded-2"
      style={{
        borderColor: BRAND,
        backgroundColor: inCart ? BRAND : "transparent",
      }}
      title={inCart ? "Remove from Cart" : "Add to Cart"}
      aria-label={inCart ? "Remove from Cart" : "Add to Cart"}
    >
      {inCart ? (
        <BsCartDash style={{ color: "#fff" }} />
      ) : (
        <BsCartPlus style={{ color: BRAND }} />
      )}
    </Button>
  );

  const heartButton = (
    <Button
      variant="light"
      onClick={() => toggleFavourite(item.id)}
      style={{ borderColor: BRAND }}
      className="border p-2 rounded-2 bg-transparent"
      title={isFav ? "Remove from Favorites" : "Add to Favorites"}
      aria-label={isFav ? "Remove from Favorites" : "Add to Favorites"}
    >
      {isFav ? (
        <FaHeart style={{ color: BRAND }} />
      ) : (
        <FaRegHeart style={{ color: BRAND }} />
      )}
    </Button>
  );

  const priceBlock = (
    <div>
      <span className="fw-bold fs-5 me-2">${formatPrice(item.price)}</span>
      {item.oldPrice && (
        <span className="text-muted text-decoration-line-through small">
          ${formatPrice(item.oldPrice)}
        </span>
      )}
    </div>
  );

  const ratingBlock = hasRating && (
    <div className="d-flex align-items-center gap-1 small mb-2">
      <RatingStars rating={item.rating} />
      <span className="fw-semibold text-warning ms-1">{item.rating}</span>
      {isList && item.ordersCount && (
        <span className="text-secondary">{item.ordersCount} orders</span>
      )}
    </div>
  );

  return (
    <Col xs={12} sm={6} md={12} lg={isList ? 12 : 4} className="mb-4">
      <div
        className={`cardsHover backGroung-white border rounded-2 h-100 overflow-hidden ${
          isList ? "d-lg-flex align-items-center p-3" : "d-flex flex-column"
        }`}
      >
        <div
          className={`pic text-center flex-shrink-0 d-flex align-items-center justify-content-center ${
            isList ? "me-4" : "p-4 border-bottom"
          }`}
          style={{
            width: isList ? "180px" : "100%",
            height: isList ? "180px" : "220px",
          }}
        >
          <img
            style={{ width: "100%", height: "100%", objectFit: "contain" }}
            src={item.image || FALLBACK_IMG}
            alt={name}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = FALLBACK_IMG;
            }}
          />
        </div>

        <div className={`flex-grow-1 ${isList ? "" : "p-3 text-start"}`}>
          {!isList ? (
            <>
              <div className="d-flex align-items-center justify-content-between mb-2">
                {priceBlock}
                <div className="d-flex gap-2">
                  {cartButton}
                  {heartButton}
                </div>
              </div>

              {ratingBlock}

              <h6 className="fw-normal text-secondary mb-0 small">{name}</h6>

              <Link
                to={detailsPath}
                className="d-inline-block fw-semibold small mt-3 text-decoration-none"
                style={{ color: BRAND }}
              >
                View details
              </Link>
            </>
          ) : (
            <>
              <div className="d-flex align-items-start justify-content-between">
                <h6 className="fw-semibold mb-1">{name}</h6>
                <div className="d-flex gap-2">
                  {cartButton}
                  {heartButton}
                </div>
              </div>

              <div className="mb-2">{priceBlock}</div>

              {ratingBlock}

              {item.description && (
                <p
                  className="text-muted small mb-2 text-truncate-2"
                  style={{ maxWidth: "600px" }}
                >
                  {item.description}
                </p>
              )}

              <Link
                to={detailsPath}
                className="fw-semibold small text-decoration-none"
                style={{ color: BRAND }}
              >
                View details
              </Link>
            </>
          )}
        </div>
      </div>
    </Col>
  );
};

export default ProductsCardItem;