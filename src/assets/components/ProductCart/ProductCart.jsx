import { useState } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router';
import { useCart } from '../../Contexts/CartContext';
import CartItemCard from '../ProductCart/CartItemCard';
import DiscountSec from "../../Pages/PrdctDetails/DiscountSec"
import WepFooter from "../Footer/WepFooter"
import WepNavbar from "../Header/WepNavbar"
import paymentlogo1 from "../../imgs/paymentlogo1.png"
import paymentlogo2 from "../../imgs/paymentlogo2.png"
import paymentlogo3 from "../../imgs/paymentlogo3.png"
import paymentlogo4 from "../../imgs/paymentlogo4.png"
import paymentlogo5 from "../../imgs/paymentlogo5.png"

const ProductCart = () => {
  const {
    cartItems,
    loading,
    removeFromCart,
    updateQuantity,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
  } = useCart();

  const [couponInput, setCouponInput] = useState('');
  const [couponMsg, setCouponMsg] = useState(null);

  const subtotal = cartItems && cartItems.length > 0
    ? cartItems.reduce(
        (sum, item) =>
          sum +
          Number(item.price || item.product?.price || 0) *
            Number(item.quantity || 1),
        0
      )
    : 0;

  const discount =
    appliedCoupon && subtotal > 0
      ? appliedCoupon.type === 'percent'
        ? (subtotal * appliedCoupon.value) / 100
        : Math.min(appliedCoupon.value, subtotal)
      : 0;

  const tax = subtotal > 0 ? 5.0 : 0.0;
  const total = subtotal - discount + tax;

  const handleApplyCoupon = () => {
    setCouponMsg(applyCoupon(couponInput));
  };

  const handleRemoveCoupon = () => {
    removeCoupon();
    setCouponInput('');
    setCouponMsg(null);
  };

  return (
    <>
      <WepNavbar />
      <Container className="my-5">
        <h4 className="fw-bold mb-4">My cart ({cartItems?.length || 0})</h4>

        <Row className="gy-4">
          <Col lg={8}>
            <div className="border rounded-3 bg-white overflow-hidden shadow-sm">
              {loading ? (
                <div className="text-center p-5">
                  <div className="spinner-border text-danger" role="status"></div>
                </div>
              ) : !cartItems || cartItems.length === 0 ? (
                <p className="text-center text-muted p-5 m-0">Your shopping cart is empty</p>
              ) : (
                cartItems.map((item) => (
                  <CartItemCard
                    key={item.id}
                    item={item}
                    onRemove={removeFromCart}
                    onUpdateQuantity={updateQuantity}
                  />
                ))
              )}

              <div className="d-flex justify-content-between align-items-center p-3 backGroung-white border-top">
                <Link
                  to="/product-categories"
                  className="bg-gradientButton btn btn-sm px-4 py-2 text-white text-decoration-none"
                >
                  ← Back to shop
                </Link>
              </div>
            </div>
          </Col>

          <Col lg={4}>
            <div className="border rounded-3 p-3 backGroung-white mb-3 shadow-sm">
              <p className="text-muted small mb-2">Have a coupon?</p>
              <div className="input-group input-group-sm">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Add coupon"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  disabled={!!appliedCoupon}
                />
                {appliedCoupon ? (
                  <button
                    className="btn btn-outline-secondary"
                    type="button"
                    onClick={handleRemoveCoupon}
                  >
                    Remove
                  </button>
                ) : (
                  <button
                    className="btn btn-outline-danger"
                    type="button"
                    onClick={handleApplyCoupon}
                    disabled={!couponInput.trim() || subtotal === 0}
                  >
                    Apply
                  </button>
                )}
              </div>
              {couponMsg && (
                <small className={couponMsg.success ? 'text-success' : 'text-danger'}>
                  {couponMsg.message}
                </small>
              )}
            </div>

            <div className="border rounded-3 p-4 backGroung-white shadow-sm">
              <div className="d-flex justify-content-between mb-2 text-muted">
                <span>Subtotal:</span>
                <span className="fw-bold ">${subtotal.toFixed(2)}</span>
              </div>
              <div className="d-flex justify-content-between mb-2 text-muted">
                <span>Discount{appliedCoupon ? ` (${appliedCoupon.code})` : ''}:</span>
                <span className="text-danger">- ${discount.toFixed(2)}</span>
              </div>
              <div className="d-flex justify-content-between mb-3 text-muted border-bottom pb-3">
                <span>Tax:</span>
                <span className="text-success">+ ${tax.toFixed(2)}</span>
              </div>

              <div className="d-flex justify-content-between mb-4 align-items-center">
                <span className="fw-bold fs-5">Total:</span>
                <div>
                  <span className="fw-bold fs-4 ">${total.toFixed(2)}</span>
                </div>
              </div>

              <Link to="/checkout" className="text-decoration-none">
  <Button
    className="w-100 py-2 fw-bold text-uppercase text-white border-0 mb-3"
    style={{ backgroundColor: '#00B517' }}
  >
    Checkout
  </Button>
</Link>

              <div className="d-flex align-items-center gap-4  justify-content-center  ">
                <img src={paymentlogo1} alt="" />
                <img src={paymentlogo2} alt="" />
                <img src={paymentlogo3} alt="" />
                <img src={paymentlogo4} alt="visa" />
                <img src={paymentlogo5} alt="pay" />
              </div>
            </div>
          </Col>
          <Col lg={12} className='mt-5'><DiscountSec /></Col>
        </Row>
      </Container>

      <WepFooter />
    </>
  );
};

export default ProductCart;