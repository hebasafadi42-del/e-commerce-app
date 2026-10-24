import { useEffect, useState } from "react";
import { Modal, Badge, Spinner, Alert, Button } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import {
  STATUS_VARIANT,
  formatDate,
  formatMoney,
  statusLabel,
} from "./Orderutils";

const OrderDetailsModal = ({ show, onHide, order, fetchOrderById }) => {
  const { t, i18n } = useTranslation();
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!show || !order) return;
    let ignore = false;
    setDetails(null);
    setError(null);
    setLoading(true);
    fetchOrderById(order.id)
      .then((d) => !ignore && setDetails(d))
      .catch((e) => !ignore && setError(e.message))
      .finally(() => !ignore && setLoading(false));
    return () => {
      ignore = true;
    };
  }, [show, order?.id]);

  if (!order) return null;

  const o = details
    ? { ...order, ...details, items: details.items?.length ? details.items : order.items }
    : order;

  return (
    <Modal show={show} onHide={onHide} size="lg" centered scrollable>
      <Modal.Header closeButton>
        <Modal.Title className="fw-bold fs-5">
          {t("orders.order_no", "Order")} #{o.number}
          <Badge bg={STATUS_VARIANT[o.status] || "secondary"} className="ms-2 fs-6">
            {statusLabel(t, o.status)}
          </Badge>
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {loading && (
          <div className="text-center py-2">
            <Spinner animation="border" size="sm" variant="danger" />
          </div>
        )}
        {error && <Alert variant="warning">{error}</Alert>}

        <div className="row g-3 mb-4 small">
          <div className="col-sm-4">
            <div className="text-muted">{t("orders.date", "Date")}</div>
            <div className="fw-semibold">{formatDate(o.date, i18n.language)}</div>
          </div>
          <div className="col-sm-4">
            <div className="text-muted">{t("orders.payment", "Payment")}</div>
            <div className="fw-semibold">{o.paymentType || "—"}</div>
          </div>
          <div className="col-sm-4">
            <div className="text-muted">{t("orders.address", "Address")}</div>
            <div className="fw-semibold">{o.address || "—"}</div>
          </div>
          {o.note && (
            <div className="col-12">
              <div className="text-muted">{t("orders.note", "Note")}</div>
              <div className="fw-semibold">{o.note}</div>
            </div>
          )}
        </div>

        <h6 className="fw-bold mb-3">{t("orders.products", "Products")}</h6>
        {o.items.length === 0 ? (
          <p className="text-muted">{t("orders.no_items", "No items")}</p>
        ) : (
          o.items.map((item) => (
            <div
              key={item.id}
              className="d-flex align-items-center gap-3 py-2 border-bottom"
            >
              {item.image && (
                <img
                  src={item.image}
                  alt={item.name}
                  className="rounded border"
                  style={{ width: 60, height: 60, objectFit: "cover" }}
                />
              )}
              <div className="flex-grow-1">
                <div className="fw-semibold">{item.name}</div>
                <small className="text-muted">
                  {formatMoney(item.price)} × {item.qty}
                </small>
              </div>
              <div className="fw-bold">{formatMoney(item.price * item.qty)}</div>
            </div>
          ))
        )}

        <div className="ms-auto mt-4" style={{ maxWidth: 320 }}>
          <div className="d-flex justify-content-between text-muted mb-1">
            <span>{t("orders.subtotal", "Subtotal")}</span>
            <span>{formatMoney(o.subtotal)}</span>
          </div>
          {o.discount > 0 && (
            <div className="d-flex justify-content-between text-muted mb-1">
              <span>
                {t("orders.discount", "Discount")}
                {o.coupon ? ` (${o.coupon})` : ""}
              </span>
              <span className="text-danger">- {formatMoney(o.discount)}</span>
            </div>
          )}
          {o.tax > 0 && (
            <div className="d-flex justify-content-between text-muted mb-1">
              <span>{t("orders.tax", "Tax")}</span>
              <span>+ {formatMoney(o.tax)}</span>
            </div>
          )}
          {o.shipping > 0 && (
            <div className="d-flex justify-content-between text-muted mb-1">
              <span>{t("orders.shipping", "Shipping")}</span>
              <span>+ {formatMoney(o.shipping)}</span>
            </div>
          )}
          <div className="d-flex justify-content-between fw-bold fs-5 border-top pt-2 mt-2">
            <span>{t("orders.total", "Total")}</span>
            <span>{formatMoney(o.total)}</span>
          </div>
        </div>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="outline-secondary" onClick={onHide}>
          {t("orders.close", "Close")}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default OrderDetailsModal;