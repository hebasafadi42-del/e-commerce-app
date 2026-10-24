import { Badge, Button } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import {
  STATUS_VARIANT,
  canCancel,
  formatDate,
  formatMoney,
  statusLabel,
} from "./Orderutils";

const MAX_THUMBS = 4;

const OrderCard = ({ order, onView, onCancel }) => {
  const { t, i18n } = useTranslation();
  const shown = order.items.slice(0, MAX_THUMBS);
  const extra = order.items.length - shown.length;
  const itemsCount = order.items.reduce((s, i) => s + i.qty, 0);

  return (
    <div className="border rounded-3 backGroung-white shadow-sm mb-3 overflow-hidden">
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 p-3 border-bottom bg-body-tertiary">
        <div>
          <div className="fw-bold">
            {t("orders.order_no", "Order")} #{order.number}
          </div>
          <small className="text-muted">{formatDate(order.date, i18n.language)}</small>
        </div>
        <Badge bg={STATUS_VARIANT[order.status] || "secondary"} className="px-3 py-2">
          {statusLabel(t, order.status)}
        </Badge>
      </div>

      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 p-3">
        <div className="d-flex align-items-center gap-2">
          {shown.map((item) => (
            <div key={item.id} title={item.name}>
              {item.image ? (
                <img
                  src={item.image}
                  alt={item.name}
                  className="rounded border"
                  style={{ width: 56, height: 56, objectFit: "cover" }}
                />
              ) : (
                <div
                  className="rounded border bg-body-secondary d-flex align-items-center justify-content-center text-muted"
                  style={{ width: 56, height: 56 }}
                >
                  <i className="bi bi-image"></i>
                </div>
              )}
            </div>
          ))}
          {extra > 0 && <span className="text-muted fw-semibold">+{extra}</span>}
          {order.items.length === 0 && (
            <span className="text-muted small">{t("orders.no_items", "No items")}</span>
          )}
        </div>

        <div className="text-muted small">
          {itemsCount > 0 && (
            <div>
              {itemsCount} {t("orders.items", "items")}
            </div>
          )}
          {order.paymentType && (
            <div>
              {t("orders.payment", "Payment")}: {order.paymentType}
            </div>
          )}
        </div>

        <div className="text-end">
          <div className="text-muted small">{t("orders.total", "Total")}</div>
          <div className="fw-bold fs-5">{formatMoney(order.total)}</div>
        </div>
      </div>

      <div className="d-flex justify-content-end gap-2 p-3 pt-0">
        {canCancel(order) && (
          <Button variant="outline-danger" size="sm" onClick={() => onCancel(order)}>
            {t("orders.cancel", "Cancel order")}
          </Button>
        )}
        <Button
          size="sm"
          className="bg-gradientButton border-0 text-white px-4"
          onClick={() => onView(order)}
        >
          {t("orders.view_details", "View details")}
        </Button>
      </div>
    </div>
  );
};

export default OrderCard;