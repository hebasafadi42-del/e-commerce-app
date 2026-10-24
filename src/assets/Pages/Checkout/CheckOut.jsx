import { useContext, useEffect, useState } from "react";
import { Modal, Button, Form, Spinner, Alert } from "react-bootstrap";
import { Link, useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import {
  MdRefresh,
  MdAttachMoney,
  MdCheckCircle,
  MdLock,
  MdLocationOn,
  MdPlace,
  MdAdd,
} from "react-icons/md";
import { AuthContext } from "../../Contexts/AuthContext";
import { useCart } from "../../Contexts/CartContext";
import { useOrder } from "../../Contexts/OrdersContext";
import { API_Config } from "../../Config/API-Config";
import WepNavbar from "../../components/Header/WepNavbar";
import CheckOutLayout from "../../Layouts/CheckOutLayout";
import Syriatel from "../../imgs/syriatell.png";
import Mtn from "../../imgs/Mtn.png";

const PAYMENT_METHODS = [
  { value: "CASH", label: "Cash", logo: null },
  { value: "SYRIATEL", label: "Syriatel", logo: Syriatel, short: "S" },
  { value: "MTN", label: "MTN", logo: Mtn, short: "MTN" },
];

const TAX = 5; 
const ADDRESS_URL = `${API_Config.Base_URL}/address`;

const fmt = (n) => Number(n || 0).toFixed(3);
const unitPrice = (i) => Number(i.price || i.product?.price || 0);

const EMPTY_ADDRESS = {
  name: "",
  phone: "",
  city: "",
  neighborhood: "",
  street: "",
  building: "",
  zip_code: "",
};

const AddressModal = ({ show, onHide, token, onSaved }) => {
  const { t } = useTranslation();
  const [form, setForm] = useState(EMPTY_ADDRESS);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const valid = form.name && form.phone && form.city && form.street;

  const save = async () => {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(ADDRESS_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...form, lat: "0", lng: "0", is_default: true }),
      });
      const json = await res.json().catch(() => null);
      if (!res.ok) throw new Error(json?.message || `HTTP error! Status: ${res.status}`);
      setForm(EMPTY_ADDRESS);
      await onSaved();
      onHide();
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  const field = (key, label, props = {}) => (
    <Form.Group className="mb-2" key={key}>
      <Form.Label className="small mb-1">{label}</Form.Label>
      <Form.Control size="sm" value={form[key]} onChange={set(key)} {...props} />
    </Form.Group>
  );

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title className="fs-5 fw-bold">
          {t("checkout.add_address", "Add delivery address")}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {field("name", t("checkout.addr_name", "Address name"))}
        {field("phone", t("checkout.phone", "Phone"), { type: "tel" })}
        {field("city", t("checkout.city", "City"))}
        {field("neighborhood", t("checkout.neighborhood", "Neighborhood"))}
        {field("street", t("checkout.street", "Street"))}
        {field("building", t("checkout.building", "Building"))}
        {field("zip_code", t("checkout.zip", "Zip code"))}
        {error && <Alert variant="danger" className="mt-2 mb-0 py-2 small">{error}</Alert>}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-secondary" onClick={onHide} disabled={saving}>
          {t("orders.close", "Close")}
        </Button>
        <Button
          className="border-0 text-white"
          style={{ backgroundColor: '#00B517' }}
          onClick={save}
          disabled={!valid || saving}
        >
          {saving ? <Spinner size="sm" animation="border" /> : t("checkout.save", "Save")}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

const Checkout = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);
  const {
    cartItems,
    loading,
    fetchCart,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
  } = useCart();
  const { placeOrder } = useOrder();

  const [payment, setPayment] = useState("CASH");
  const [couponInput, setCouponInput] = useState(appliedCoupon?.code || "");
  const [couponMsg, setCouponMsg] = useState(null);

  const [addresses, setAddresses] = useState([]);
  const [addressId, setAddressId] = useState("");
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [loadingAddresses, setLoadingAddresses] = useState(false);

  const [placing, setPlacing] = useState(false);
  const [orderError, setOrderError] = useState(null);

  const items = Array.isArray(cartItems) ? cartItems : [];

  const loadAddresses = async () => {
    if (!token) return;
    setLoadingAddresses(true);
    try {
      const res = await fetch(ADDRESS_URL, {
        headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
      });
      if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
      const json = await res.json();
      const raw = json.data ?? json.addresses ?? json;
      const list = Array.isArray(raw) ? raw : Array.isArray(raw?.data) ? raw.data : [];
      setAddresses(list);
      setAddressId((cur) => {
        if (cur && list.some((a) => String(a.id) === String(cur))) return cur;
        const def = list.find((a) => a.is_default) || list[0];
        return def ? String(def.id) : "";
      });
    } catch (e) {
      console.error("Failed to fetch addresses:", e.message);
    } finally {
      setLoadingAddresses(false);
    }
  };

  useEffect(() => {
    loadAddresses();
  }, [token]);

  const subtotal = items.reduce(
    (s, i) => s + unitPrice(i) * Number(i.quantity || 1),
    0
  );
  const discount =
    appliedCoupon && subtotal > 0
      ? appliedCoupon.type === "percent"
        ? (subtotal * appliedCoupon.value) / 100
        : Math.min(appliedCoupon.value, subtotal)
      : 0;
  const tax = subtotal > 0 ? TAX : 0;
  const netTotal = subtotal - discount + tax;

  const handleCheckCoupon = () => {
    if (!couponInput.trim()) return;
    setCouponMsg(applyCoupon(couponInput));
  };

  const handleRemoveCoupon = () => {
    removeCoupon();
    setCouponInput("");
    setCouponMsg(null);
  };

  const handleConfirm = async () => {
    if (!addressId) {
      setOrderError(t("checkout.select_address_error", "Please select a shipping address"));
      return;
    }

    setPlacing(true);
    setOrderError(null);
    try {
      const payload = {
        note: "",
        payment_type: payment,
        coupon_code: appliedCoupon?.code,
        address_id: Number(addressId),
      };

      await placeOrder(payload);
      await fetchCart();
      removeCoupon();
      navigate("/orders");
    } catch (e) {
      setOrderError(e.message);
    } finally {
      setPlacing(false);
    }
  };

  if (!token || (!loading && items.length === 0)) {
    return (
      <>
        <div className="co-root text-center p-5 my-5">
          <p className="text-muted mb-3">
            {!token
              ? t("orders.login_required", "Please sign in to continue")
              : t("checkout.empty", "Your cart is empty")}
          </p>
          <Link
            to={!token ? "/log-in" : "/product-categories"}
            className="btn co-empty-btn px-4"
          >
            {!token
              ? t("header.sign_in", "Sign in")
              : t("orders.start_shopping", "Start shopping")}
          </Link>
        </div>
      </>
    );
  }

  const leftContent = (
    <div className="co-panel">
      <h4 className="fw-semibold mb-1">
        {t("checkout.payment_method", "Payment Method")}
      </h4>
      <p className="small opacity-75 mb-4">
        {t("checkout.pick_payment", "Pick your payment method")}
      </p>

      {PAYMENT_METHODS.map((m) => (
        <label
          key={m.value}
          className={`co-method ${payment === m.value ? "active" : ""}`}
        >
          <span className="d-flex align-items-center gap-3">
            {m.value === "CASH" ? (
              <span className="co-badge co-badge--cash">
                <MdAttachMoney size={22} />
              </span>
            ) : m.logo ? (
              <img
                src={m.logo}
                alt={m.label}
                className="co-badge co-badge-img"
              />
            ) : (
              <span className={`co-badge co-badge--${m.value.toLowerCase()}`}>
                {m.short}
              </span>
            )}
            <span className="fw-medium">
              {t(`checkout.pay_${m.value.toLowerCase()}`, m.label)}
            </span>
          </span>

          <input
            type="radio"
            name="payment"
            className="visually-hidden"
            checked={payment === m.value}
            onChange={() => setPayment(m.value)}
          />
          <span className="co-radio" />
        </label>
      ))}

      <p className="mb-2 mt-4 fw-medium">
        {t("checkout.discount_code", "Discount Code")}
      </p>

      {appliedCoupon ? (
        <div className="co-coupon-applied">
          <span className="d-flex align-items-center gap-2">
            <MdCheckCircle className="co-coupon-icon" size={20} />
            <span className="fw-semibold">{appliedCoupon.code}</span>
          </span>
          <button
            type="button"
            className="co-coupon-remove"
            onClick={handleRemoveCoupon}
          >
            {t("checkout.remove", "Remove")}
          </button>
        </div>
      ) : (
        <div className="d-flex gap-2">
          <input
            type="text"
            className="form-control co-input"
            placeholder={t("checkout.discount_code", "Discount Code")}
            value={couponInput}
            onChange={(e) => setCouponInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleCheckCoupon()}
          />
          <button
            type="button"
            className="co-check-btn"
            onClick={handleCheckCoupon}
          >
            <MdRefresh size={18} />
            {t("checkout.check", "Check")}
          </button>
        </div>
      )}

      {couponMsg && !couponMsg.success && (
        <small className="co-coupon-error d-block mt-1">{couponMsg.message}</small>
      )}

      <div className="mt-4 pt-3 border-top">
        <div className="d-flex align-items-center justify-content-between mb-2">
          <h4 className="fw-semibold mb-0 d-flex align-items-center gap-2">
            <MdLocationOn className="text-danger" size={22} />
            {t("checkout.shipping_address", "Shipping Address")}
          </h4>
          <button
            type="button"
            className="btn btn-sm btn-outline-light d-flex align-items-center gap-1"
            onClick={() => setShowAddressModal(true)}
          >
            <MdAdd size={16} />
            {t("checkout.add_address", "Add New")}
          </button>
        </div>
        <p className="small opacity-75 mb-3">
          {t("checkout.select_address", "Choose where you want your order delivered")}
        </p>

        {loadingAddresses ? (
          <div className="text-center py-3">
            <Spinner animation="border" size="sm" variant="light" />
          </div>
        ) : addresses.length > 0 ? (
          <div className="d-flex flex-column gap-2">
            {addresses.map((addr) => {
              const isSelected = String(addressId) === String(addr.id);
              const title = addr.name || addr.city || t("checkout.address", "Address");
              const details = [addr.street, addr.neighborhood, addr.city].filter(Boolean).join(" - ");
              const phone = addr.phone || "";

              return (
                <label
                  key={addr.id}
                  className={`co-method align-items-start ${isSelected ? "active" : ""}`}
                  style={{ cursor: "pointer" }}
                >
                  <span className="d-flex align-items-start gap-3 w-100">
                    <span className="co-badge co-badge--cash mt-1">
                      <MdPlace size={20} />
                    </span>
                    <span className="d-flex flex-column flex-grow-1">
                      <span className="fw-semibold text-white d-flex align-items-center gap-2">
                        {title}
                        {addr.is_default && (
                          <span className="badge bg-secondary text-light border small fw-normal">
                            {t("checkout.default", "Default")}
                          </span>
                        )}
                      </span>
                      {details && <span className="small opacity-75 mt-1">{details}</span>}
                      {phone && <span className="small opacity-75">{phone}</span>}
                    </span>
                  </span>

                  <input
                    type="radio"
                    name="shipping_address"
                    className="visually-hidden"
                    checked={isSelected}
                    onChange={() => setAddressId(addr.id)}
                  />
                  <span className="co-radio mt-1" />
                </label>
              );
            })}
          </div>
        ) : (
          <button
            type="button"
            className="btn btn-outline-light w-100 py-2 d-flex align-items-center justify-content-center gap-2 mt-2"
            onClick={() => setShowAddressModal(true)}
          >
            <MdAdd size={18} />
            {t("checkout.add_new_address", "Add New Address")}
          </button>
        )}
      </div>
    </div>
  );

  return (
    <>
      <CheckOutLayout left={leftContent}>
        <h5 className="fw-bold mb-4">
          {t("checkout.order_summary", "Order summary")}{" "}
          <span className="co-count">({items.length})</span>
        </h5>

        <div className="co-list flex-grow-1 mb-3">
          {loading ? (
            <div className="text-center p-4">
              <Spinner animation="border" variant="danger" />
            </div>
          ) : (
            items.map((item) => {
              const name = item.title || item.product?.name;
              const desc = item.description || item.product?.description || "";
              const qty = Number(item.quantity || 1);

              return (
                <div key={item.id} className="co-item ">
                  <img
                    className="co-item-img"
                    src={item.image || item.product?.image}
                    alt={name}
                  />
                  <div className="co-item-info">
                    <h6 className="fw-bold" >{name}</h6>
                    {desc && <p style={{fontSize:"11px"}} >{desc}</p>}
                  </div>
                  <span className="co-qty"> {qty}</span>
                  <span className="co-item-price">{fmt(unitPrice(item) * qty)} AED</span>
                </div>
              );
            })
          )}
        </div>

        <div className="co-summary">
          <div className="co-row">
            <span>{t("checkout.total", "Total")}</span>
            <span>{fmt(subtotal)}</span>
          </div>
          <div className="co-row">
            <span>{t("checkout.discount", "Discount")}</span>
            <span className={discount > 0 ? "co-discount-value" : ""}>
              {discount > 0 ? `- ${fmt(discount)}` : 0}
            </span>
          </div>
          <div className="co-row co-row--border">
            <span>{t("checkout.tax", "Tax")}</span>
            <span>{fmt(tax)}</span>
          </div>

          <div className="co-net">
            <span className="co-net-label">
              {t("checkout.net_total", "Net Total")}
            </span>
            <span className="co-net-value">{fmt(netTotal)}</span>
          </div>

          {orderError && (
            <Alert variant="danger" className="py-2 small">
              {orderError}
            </Alert>
          )}

          <Button
            className="co-confirm"
            onClick={handleConfirm}
            disabled={placing || loading || items.length === 0 || !addressId}
          >
            {placing ? (
              <Spinner size="sm" animation="border" />
            ) : (
              t("checkout.confirm", "Confirm Payment")
            )}
          </Button>

          <div className="co-secure">
            <MdLock />
            {t("checkout.secure_note", "Your payment information is secure")}
          </div>
        </div>
      </CheckOutLayout>

      <AddressModal
        show={showAddressModal}
        onHide={() => setShowAddressModal(false)}
        token={token}
        onSaved={loadAddresses}
      />
    </>
  );
};

export default Checkout;