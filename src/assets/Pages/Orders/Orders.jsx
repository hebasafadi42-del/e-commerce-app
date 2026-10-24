import { useMemo, useState, useContext } from "react";
import { Container, Modal, Button, Form, Alert, Spinner } from "react-bootstrap";
import { Link } from "react-router";
import { useTranslation } from "react-i18next";
import { AuthContext } from "../../Contexts/AuthContext";
import WepNavbar from "../../components/Header/WepNavbar";
import WepFooter from "../../components/Footer/WepFooter";
import { useOrder } from "../../Contexts/OrdersContext";
import OrderCard from "./Ordercard";
import OrderDetailsModal from "../Orders/Orderdetailsmodal";
import { statusLabel } from "./Orderutils";

const Orders = () => {
  const { t } = useTranslation();
  const { token } = useContext(AuthContext);
  const { orders, loading, error, fetchOrders, fetchOrderById, cancelOrder } =
    useOrder();

  const [filter, setFilter] = useState("all");
  const [viewOrder, setViewOrder] = useState(null);

  const [cancelTarget, setCancelTarget] = useState(null);
  const [reason, setReason] = useState("");
  const [cancelling, setCancelling] = useState(false);
  const [cancelError, setCancelError] = useState(null);
  const [success, setSuccess] = useState(null);

  const statuses = useMemo(
    () => [...new Set(orders.map((o) => o.status))],
    [orders]
  );
  const visible = filter === "all" ? orders : orders.filter((o) => o.status === filter);

  const openCancel = (order) => {
    setCancelTarget(order);
    setReason("");
    setCancelError(null);
  };

  const confirmCancel = async () => {
    setCancelling(true);
    setCancelError(null);
    try {
      await cancelOrder(cancelTarget.id, reason.trim() || "No reason");
      setSuccess(t("orders.cancel_success", "Order cancelled successfully"));
      setCancelTarget(null);
    } catch (e) {
      setCancelError(e.message);
    } finally {
      setCancelling(false);
    }
  };

  return (
    <>
      <WepNavbar />
      <Container className="my-5" style={{ maxWidth: 900 }}>
        <h4 className="fw-bold mb-4">
          {t("orders.title", "My orders")} ({orders.length})
        </h4>

        {!token ? (
          <div className="text-center border rounded-3 p-5 backGroung-white">
            <p className="text-muted">
              {t("orders.login_required", "Please sign in to see your orders")}
            </p>
            <Link to="/Sigin" className="btn bg-gradientButton text-white px-4">
              {t("header.sign_in", "Sign in")}
            </Link>
          </div>
        ) : (
          <>
            {success && (
              <Alert variant="success" dismissible onClose={() => setSuccess(null)}>
                {success}
              </Alert>
            )}

            {orders.length > 0 && (
              <div className="d-flex flex-wrap gap-2 mb-4">
                {["all", ...statuses].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setFilter(s)}
                    className={`btn btn-sm rounded-pill px-3 ${
                      filter === s ? "bg-gradientButton text-white border-0" : "btn-outline-secondary"
                    }`}
                  >
                    {s === "all" ? t("orders.all", "All") : statusLabel(t, s)}
                    <span className="ms-1 opacity-75">
                      ({s === "all" ? orders.length : orders.filter((o) => o.status === s).length})
                    </span>
                  </button>
                ))}
              </div>
            )}

            {loading ? (
              <div className="text-center p-5">
                <Spinner animation="border" variant="danger" />
              </div>
            ) : error ? (
              <Alert variant="danger" className="d-flex justify-content-between align-items-center">
                <span>{error}</span>
                <Button size="sm" variant="outline-danger" onClick={fetchOrders}>
                  {t("orders.retry", "Retry")}
                </Button>
              </Alert>
            ) : visible.length === 0 ? (
              <div className="text-center border rounded-3 p-5 backGroung-white">
                <p className="text-muted mb-3">
                  {t("orders.empty", "You have no orders yet")}
                </p>
                <Link
                  to="/product-categories"
                  className="btn bg-gradientButton text-white px-4"
                >
                  {t("orders.start_shopping", "Start shopping")}
                </Link>
              </div>
            ) : (
              visible.map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  onView={setViewOrder}
                  onCancel={openCancel}
                />
              ))
            )}
          </>
        )}
      </Container>
      <WepFooter />

      <OrderDetailsModal
        show={!!viewOrder}
        onHide={() => setViewOrder(null)}
        order={viewOrder}
        fetchOrderById={fetchOrderById}
      />

      <Modal show={!!cancelTarget} onHide={() => !cancelling && setCancelTarget(null)} centered>
        <Modal.Header closeButton>
          <Modal.Title className="fw-bold fs-5">
            {t("orders.cancel", "Cancel order")} #{cancelTarget?.number}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>{t("orders.cancel_reason", "Reason for cancellation")}</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder={t("orders.cancel_placeholder", "Tell us why you want to cancel")}
            />
          </Form.Group>
          {cancelError && <Alert variant="danger" className="mt-3 mb-0">{cancelError}</Alert>}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" disabled={cancelling} onClick={() => setCancelTarget(null)}>
            {t("orders.keep", "Keep order")}
          </Button>
          <Button variant="danger" disabled={cancelling} onClick={confirmCancel}>
            {cancelling ? <Spinner size="sm" animation="border" /> : t("orders.confirm_cancel", "Confirm cancel")}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Orders;