import { useCallback, useEffect, useState } from "react";
import { Alert, Badge, Button, Spinner, Table } from "react-bootstrap";
import { Link } from "react-router";
import { MdAdd, MdArrowForward, MdPayments } from "react-icons/md";
import { useAdmin } from "../../Contexts/AdminContext";
import { RESOURCES } from "../../AdminConfig/adminConfig";
import { parsePage, money, fmtDate, displayName, STATUS_VARIANT } from "./adminUtils";
import { XYChart, DonutChart, HBarList } from "./AdminCharts";
import "./admin-dashboard.css";

const MAX_ORDER_PAGES = 5; 
const MAX_PRODUCT_PAGES = 3; 

const STATUS_COLORS = {
  pending: "#F59E0B",
  processing: "#0EA5E9",
  shipped: "#6366F1",
  delivered: "#10B981",
  cancelled: "#EF4444",
};

const normStatus = (r) => {
  const s = String(r.status?.name ?? r.status ?? "pending").toLowerCase().trim();
  return s === "canceled" ? "cancelled" : s;
};
const orderTotal = (r) => Number(r.grand_total ?? r.total ?? r.total_price ?? 0) || 0;

const pad = (n) => String(n).padStart(2, "0");

const buildSeries = (orders) => {
  const items = orders
    .map((o) => ({ d: new Date(o.created_at), v: orderTotal(o), cancelled: normStatus(o) === "cancelled" }))
    .filter((i) => !isNaN(i.d));
  if (!items.length) return { monthly: false, points: [] };

  const min = new Date(Math.min(...items.map((i) => +i.d)));
  const max = new Date(Math.max(...items.map((i) => +i.d)));
  const monthly = (max - min) / 864e5 > 31;

  const keyOf = (d) =>
    monthly
      ? `${d.getFullYear()}-${pad(d.getMonth() + 1)}`
      : `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const labelOf = (d) =>
    monthly
      ? d.toLocaleDateString("en-GB", { month: "short", year: "2-digit" })
      : d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });

  const buckets = new Map();
  const cur = monthly
    ? new Date(min.getFullYear(), min.getMonth(), 1)
    : new Date(min.getFullYear(), min.getMonth(), min.getDate());
  while (cur <= max) {
    buckets.set(keyOf(cur), { label: labelOf(cur), revenue: 0, orders: 0 });
    if (monthly) cur.setMonth(cur.getMonth() + 1);
    else cur.setDate(cur.getDate() + 1);
  }
  items.forEach((i) => {
    const b = buckets.get(keyOf(i.d));
    if (!b) return;
    b.orders += 1;
    if (!i.cancelled) b.revenue += i.v;
  });

  let points = [...buckets.values()];
  if (monthly) points = points.slice(-12);
  return { monthly, points };
};

const AdminDashboard = () => {
  const { request } = useAdmin();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadPages = async (key, maxPages) => {
    const first = parsePage(await request(RESOURCES[key].path, { query: { page: 1 } }));
    let rows = first.rows;
    for (let p = 2; p <= Math.min(first.last, maxPages); p++) {
      rows = rows.concat(parsePage(await request(RESOURCES[key].path, { query: { page: p } })).rows);
    }
    return { rows, total: first.total };
  };

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const simple = ["category", "brand", "city"];
      const settled = await Promise.allSettled(
        simple.map((k) => request(RESOURCES[k].path, { query: { page: 1 } }))
      );
      const totals = {};
      const catRows = [];
      simple.forEach((k, i) => {
        if (settled[i].status === "fulfilled") {
          const p = parsePage(settled[i].value);
          totals[k] = p.total;
          if (k === "category") catRows.push(...p.rows);
        } else totals[k] = null;
      });

      const orders = await loadPages("order", MAX_ORDER_PAGES);
      totals.order = orders.total;

      let products = { rows: [], total: null };
      try {
        products = await loadPages("product", MAX_PRODUCT_PAGES);
      } catch {
      }
      totals.product = products.total;

      const byStatus = {};
      let revenue = 0;
      orders.rows.forEach((o) => {
        const s = normStatus(o);
        byStatus[s] = (byStatus[s] || 0) + 1;
        if (s !== "cancelled") revenue += orderTotal(o);
      });

      const catMap = Object.fromEntries(catRows.map((c) => [c.id, displayName(c)]));
      const perCat = {};
      products.rows.forEach((p) => {
        const name = p.category
          ? displayName(p.category)
          : catMap[p.category_id] || (p.category_id ? `#${p.category_id}` : "Uncategorized");
        perCat[name] = (perCat[name] || 0) + 1;
      });
      const categories = Object.entries(perCat)
        .map(([label, value]) => ({ label, value }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 6);

      const recent = [...orders.rows]
        .sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0))
        .slice(0, 6);

      setData({
        totals,
        byStatus,
        revenue,
        recent,
        categories,
        series: buildSeries(orders.rows),
        ordersSampled: orders.rows.length < orders.total,
        ordersSampleSize: orders.rows.length,
        productsSampled: products.rows.length < (products.total ?? 0),
        productsSampleSize: products.rows.length,
      });
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [request]);

  useEffect(() => {
    load();
  }, [load]);

  if (loading) {
    return (
      <div className="text-center p-5">
        <Spinner animation="border" variant="danger" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="danger" className="d-flex justify-content-between align-items-center">
        <span>{error}</span>
        <Button size="sm" variant="outline-danger" onClick={load}>
          Retry
        </Button>
      </Alert>
    );
  }

  const { totals, byStatus, revenue, recent, categories, series, ordersSampled, ordersSampleSize, productsSampled, productsSampleSize } = data;

  const statusData = Object.entries(byStatus)
    .sort((a, b) => b[1] - a[1])
    .map(([label, value]) => ({ label, value, color: STATUS_COLORS[label] || "#94A3B8" }));

  const STAT_ORDER = [
    ["product", "#F0345D"],
    ["category", "#6C5CE7"],
    ["order", "#0984E3"],
    ["brand", "#00B894"],
    ["city", "#E17055"],
  ];
  const cards = [
    ...STAT_ORDER.map(([k, accent]) => ({
      key: k,
      label: RESOURCES[k].plural,
      value: totals[k] ?? "—",
      icon: RESOURCES[k].icon,
      accent,
      to: `/admin/${RESOURCES[k].route}`,
    })),
    { key: "revenue", label: "Revenue", value: money(revenue), icon: MdPayments, accent: "#F59E0B", to: "/admin/orders" },
  ];

  const today = new Date().toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const hasSeries = series.points.some((p) => p.orders > 0);
  const granularity = series.monthly ? "Monthly" : "Daily";

  return (
    <>
      <div className="adm-hero">
        <div>
          <h4 className="fw-bold mb-1">Welcome back</h4>
          <div className="adm-hero__sub">{today} — here’s what’s happening in your store.</div>
        </div>
        <div className="d-flex flex-wrap gap-2">
          <Link to="/admin/orders" className="btn adm-hero__btn-outline">
            View orders
          </Link>
          <Link to="/admin/products/new" className="btn adm-hero__btn d-flex align-items-center gap-1">
            <MdAdd size={20} /> Add product
          </Link>
        </div>
      </div>

      <div className="adm-stats">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <Link key={c.key} to={c.to} className="adm-stat" style={{ "--accent": c.accent }}>
              <span className="adm-stat__icon">
                <Icon size={22} />
              </span>
              <div className="adm-stat__value">{c.value}</div>
              <div className="adm-stat__label">{c.label}</div>
            </Link>
          );
        })}
      </div>

      <div className="adm-dash-grid adm-dash-grid--a">
        <section className="adm-card adm-panel">
          <div className="adm-panel__head">
            <div>
              <h6 className="adm-panel__title">Revenue</h6>
              <div className="adm-panel__big">{money(revenue)}</div>
            </div>
            <span className="adm-chip">{granularity}</span>
          </div>
          {hasSeries ? (
            <XYChart
              type="area"
              name="Revenue"
              color="#F0345D"
              data={series.points.map((p) => ({ label: p.label, value: p.revenue }))}
              format={money}
            />
          ) : (
            <p className="text-muted small mb-0">No order data to chart yet.</p>
          )}
          {ordersSampled && (
            <p className="adm-note">Based on the latest {ordersSampleSize} of {totals.order} orders (cancelled excluded).</p>
          )}
        </section>

        <section className="adm-card adm-panel">
          <div className="adm-panel__head">
            <h6 className="adm-panel__title">Orders by status</h6>
          </div>
          {statusData.length ? (
            <DonutChart data={statusData} centerLabel="Orders" />
          ) : (
            <p className="text-muted small mb-0">No orders yet</p>
          )}
        </section>
      </div>

      <div className="adm-dash-grid adm-dash-grid--b">
        <section className="adm-card adm-panel">
          <div className="adm-panel__head">
            <h6 className="adm-panel__title">Orders over time</h6>
            <span className="adm-chip">{granularity}</span>
          </div>
          {hasSeries ? (
            <XYChart
              type="bar"
              name="Orders"
              color="#6C5CE7"
              data={series.points.map((p) => ({ label: p.label, value: p.orders }))}
            />
          ) : (
            <p className="text-muted small mb-0">No order data to chart yet.</p>
          )}
        </section>

        <section className="adm-card adm-panel">
          <div className="adm-panel__head">
            <h6 className="adm-panel__title">Products per category</h6>
          </div>
          {categories.length ? (
            <HBarList data={categories} color="#00B894" />
          ) : (
            <p className="text-muted small mb-0">No products yet</p>
          )}
          {productsSampled && (
            <p className="adm-note">Based on the first {productsSampleSize} of {totals.product} products.</p>
          )}
        </section>
      </div>

      <section className="adm-card adm-panel">
        <div className="adm-panel__head">
          <h6 className="adm-panel__title">Recent orders</h6>
          <Link to="/admin/orders" className="adm-link small d-flex align-items-center gap-1">
            See all <MdArrowForward />
          </Link>
        </div>
        {recent.length === 0 ? (
          <p className="text-muted small mb-0">No orders yet</p>
        ) : (
          <div className="table-responsive">
            <Table hover className="adm-table mb-0 align-middle">
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Status</th>
                  <th>Total</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {recent.map((o) => {
                  const s = normStatus(o);
                  return (
                    <tr key={o.id}>
                      <td className="fw-semibold">#{o.order_number || o.number || o.id}</td>
                      <td>
                        <Badge bg={STATUS_VARIANT[s] || "secondary"} className="text-capitalize">
                          {s}
                        </Badge>
                      </td>
                      <td>{money(orderTotal(o))}</td>
                      <td className="text-muted">{fmtDate(o.created_at)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </div>
        )}
      </section>
    </>
  );
};

export default AdminDashboard;