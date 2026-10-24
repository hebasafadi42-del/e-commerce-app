export const CURRENCY = "$";

export const unwrapList = (json) => {
  const d = json?.data ?? json?.orders ?? json;
  if (Array.isArray(d)) return d;
  if (Array.isArray(d?.data)) return d.data; 
  return [];
};

export const unwrapOne = (json) => json?.data ?? json?.order ?? json;

const STATUS_ALIASES = {
  canceled: "cancelled",
  completed: "delivered",
  complete: "delivered",
  new: "pending",
};

export const getStatus = (o) => {
  const st = o?.status;
  const raw =
    st && typeof st === "object" ? st.key || st.name || st.title : st;
  const s = String(raw ?? "pending").toLowerCase().trim().replace(/\s+/g, "_");
  return STATUS_ALIASES[s] || s;
};

export const STATUS_VARIANT = {
  pending: "warning",
  processing: "info",
  shipped: "primary",
  delivered: "success",
  cancelled: "danger",
};

export const statusLabel = (t, status) =>
  t(
    `orders.status.${status}`,
    status.charAt(0).toUpperCase() + status.slice(1).replace(/_/g, " ")
  );

export const canCancel = (order) =>
  !["cancelled", "delivered", "returned"].includes(order.status);

const num = (v) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};

export const formatMoney = (v) => `${CURRENCY}${num(v).toFixed(2)}`;

export const formatDate = (d, lang = "en") => {
  if (!d) return "—";
  const date = new Date(d);
  if (isNaN(date)) return String(d);
  return date.toLocaleDateString(lang, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};


const ITEM_KEYS = [
  "orderProducts",
  "items",
  "products",
  "order_items",
  "order_products",
  "order_details",
  "details",
  "lines",
  "cart_items",
];


const pickItems = (o) => {
  for (const k of ITEM_KEYS) {
    const v = o[k];
    if (Array.isArray(v)) return v;
    if (Array.isArray(v?.data)) return v.data; 
  }
 
  const guess = Object.values(o).find(
    (v) => Array.isArray(v) && v.length && typeof v[0] === "object"
  );
  return guess || [];
};


const normalizeItem = (i, idx) => {
  const p = i.product || i.product_variant?.product || {};
  return {
    id: i.id ?? idx,
    name: i.product_name || i.title || i.name || p.name || p.title || "Product",
    image:
      i.image ||
      i.avatar?.url ||
      i.avatar ||
      p.image ||
      p.avatar?.url ||
      p.images?.[0]?.url ||
      p.images?.[0] ||
      null,
    qty: num(i.quantity ?? i.qty ?? i.count ?? 1) || 1,
    price: num(i.price ?? i.unit_price ?? i.product_price ?? p.price),
  };
};

const addressText = (a) => {
  if (!a) return "";
  if (typeof a === "string") return a;
  return [
    a.title || a.name,
    a.address || a.street || a.details,
    a.neighborhood,
    a.building,
    a.city?.name || a.city,
  ]
    .filter(Boolean)
    .join(", ");
};

export const normalizeOrder = (o) => {
  if (!o) return null;

  
  const items = pickItems(o).map(normalizeItem);

  
  const subtotal =
    num(o.total ?? o.subtotal ?? o.sub_total) ||
    items.reduce((s, i) => s + i.price * i.qty, 0);
  const grand = num(o.grand_total ?? o.total_price ?? o.amount ?? subtotal);

  return {
    id: o.id,
    number: o.order_number || o.number || o.code || o.id,
    date: o.created_at || o.date || o.ordered_at,
    status: getStatus(o),
    items,
    subtotal,
    discount: num(o.discount ?? o.discount_amount),
    tax: num(o.tax ?? o.tax_amount),
    shipping: num(o.shipping ?? o.shipping_cost ?? o.delivery_fee),
    total: grand,
    paymentType: o.payment_type || o.payment_method || "",
    note: o.note || "",
    coupon: o.coupon_code || o.coupon?.code || "",
    address: addressText(o.address),
  };
};