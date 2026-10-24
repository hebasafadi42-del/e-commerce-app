import { useNavigate } from "react-router";
import {
  Offcanvas,
  ListGroup,
  Image,
  Badge,
  Button,
  Spinner,
} from "react-bootstrap";
import { FiTrash2, FiShoppingBag } from "react-icons/fi";
import { useCart } from "../Contexts/CartContext";
import { Link } from "react-router";

const BRAND = "#f0345d";

const OffcanvasCart = ({ show, handleClose }) => {
  const navigate = useNavigate();
  const { cartItems, loading, removeFromCart } = useCart();

  const items = Array.isArray(cartItems) ? cartItems : [];
  const unitPrice = (item) => item.price || item.product?.price || 0;

  const subTotal = items.reduce(
    (sum, item) => sum + unitPrice(item) * item.quantity,
    0,
  );

  const handleCheckout = () => {
    handleClose();
    navigate("/cart");
  };

  return (
    <Offcanvas
      show={show}
      onHide={handleClose}
      placement="end"
      style={{ width: "min(400px, 100vw)" }}
      aria-labelledby="cartOffcanvasLabel"
    >
      <Offcanvas.Header closeButton className="border-bottom px-4 py-3">
        <Offcanvas.Title
          id="cartOffcanvasLabel"
          className="fw-bold d-flex align-items-center gap-2"
        >
          Your Shopping Bag
          {items.length > 0 && (
            <Badge pill bg="danger" className="fs-6 fw-semibold">
              {items.length}
            </Badge>
          )}
        </Offcanvas.Title>
      </Offcanvas.Header>

      <Offcanvas.Body className="p-0">
        {loading ? (
          <div className="h-100 d-flex align-items-center justify-content-center">
            <Spinner animation="border" variant="danger" />
          </div>
        ) : items.length === 0 ? (
          <div className="h-100 d-flex flex-column align-items-center justify-content-center text-center text-muted px-4">
            <span
              className="d-flex align-items-center justify-content-center rounded-circle bg-danger-subtle text-danger mb-3"
              style={{ width: "72px", height: "72px" }}
            >
              <FiShoppingBag size={30} />
            </span>
            <h6 className="fw-bold text-body mb-1">Shopping Bag is empty</h6>
            <p className="small mb-4">Items you add will show up here.</p>
            <Button
              as={Link}
               to="/product-categories"
              variant="outline-danger"
              className="px-4 rounded-3"
              onClick={handleClose}
            >
              Continue shopping
            </Button>
          </div>
        ) : (
          <ListGroup variant="flush">
            {items.map((item) => {
              const name = item.title || item.product?.name;
              const category =
                item.category ||
                item.product?.category?.name ||
                "Special category";

              return (
                <ListGroup.Item
                  key={item.id}
                  className="d-flex align-items-center gap-3 px-4 py-3"
                >
                  <div className="position-relative flex-shrink-0">
                    <Image
                      src={item.image || item.product?.image}
                      alt={name}
                      rounded
                      width={72}
                      height={72}
                      className="object-fit-cover bg-light"
                    />
                    <Badge
                      pill
                      bg="danger"
                      className="position-absolute top-0 start-100 translate-middle border border-2 border-white"
                    >
                      {item.quantity}
                    </Badge>
                  </div>

                  <div className="flex-grow-1" style={{ minWidth: 0 }}>
                    <h6 className="fw-bold mb-0 text-truncate">{name}</h6>
                    <small className="text-muted d-block text-truncate">
                      {category}
                    </small>
                    <Button
                      variant="link"
                      size="sm"
                      className="p-0 mt-2 text-decoration-none d-inline-flex align-items-center gap-1"
                      style={{ color: BRAND }}
                      onClick={() => removeFromCart(item.id)}
                      title="Remove item"
                    >
                      <FiTrash2 />
                      Delete
                    </Button>
                  </div>

                  <span
                    className="fw-bold text-nowrap align-self-start"
                    style={{ color: BRAND }}
                  >
                    {unitPrice(item) * item.quantity} AED
                  </span>
                </ListGroup.Item>
              );
            })}
          </ListGroup>
        )}
      </Offcanvas.Body>

      {items.length > 0 && (
        <div className="border-top backGroung-white px-4 py-3 shadow-sm">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <span className="fw-semibold fs-5">SubTotal</span>
            <span className="fw-bold fs-5" style={{ color: BRAND }}>
              {subTotal} AED
            </span>
          </div>
          <Button
            variant="danger"
            className="w-100 py-3 rounded-3 border-0 fw-semibold"
            style={{
              backgroundImage: "linear-gradient(to right, #F0345D, #DDA3B0)",
            }}
            onClick={handleCheckout}
          >
            Checkout
          </Button>
        </div>
      )}
    </Offcanvas>
  );
};

export default OffcanvasCart;