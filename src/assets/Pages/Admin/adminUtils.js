export const findList = (json) => {
  const keys = ["data", "items", "results", "orders", "products"];
  let cur = json;
  for (let i = 0; i < 4; i++) {
    if (Array.isArray(cur)) return cur;
    if (!cur || typeof cur !== "object") break;
    const next = keys
      .map((k) => cur[k])
      .find((v) => Array.isArray(v) || (v && typeof v === "object"));
    if (!next) break;
    cur = next;
  }
  return Array.isArray(cur) ? cur : [];
};

export const parsePage = (json) => {
  const rows = findList(json);
  const candidates = [json?.meta, json?.data?.meta, json?.pagination, json?.data, json];
  const meta =
    candidates.find(
      (c) =>
        c &&
        typeof c === "object" &&
        !Array.isArray(c) &&
        (c.last_page != null || c.total != null || c.current_page != null)
    ) || {};
  return {
    rows,
    current: Number(meta.current_page ?? meta.page ?? 1),
    last: Number(meta.last_page ?? meta.total_pages ?? 1),
    total: Number(meta.total ?? rows.length),
  };
};

export const unwrapOne = (json) => {
  const d = json?.data ?? json;
  if (d && typeof d === "object" && !Array.isArray(d) && d.data && typeof d.data === "object" && !Array.isArray(d.data)) {
    return d.data;
  }
  return d;
};

export const readLang = (item, lang, key) => {
  if (!item) return "";
  if (item[lang]?.[key] != null) return item[lang][key];
  const v = item[key];
  if (v && typeof v === "object" && v[lang] != null) return v[lang];
  const tr = item.translations;
  if (Array.isArray(tr)) {
    const f = tr.find((x) => (x.locale || x.lang || x.language) === lang);
    if (f?.[key] != null) return f[key];
  } else if (tr && tr[lang]?.[key] != null) {
    return tr[lang][key];
  }
  return "";
};

export const displayName = (item) => {
  if (!item) return "—";
  const n = item.name ?? item.title;
  if (typeof n === "string" && n) return n;
  if (n && typeof n === "object") return n.en || n.ar || Object.values(n)[0] || "—";
  return (
    readLang(item, "en", "name") ||
    readLang(item, "ar", "name") ||
    (item.id != null ? `#${item.id}` : "—")
  );
};

export const money = (v) => (v == null || v === "" ? "—" : Number(v).toFixed(2));

export const fmtDate = (d) => {
  if (!d) return "—";
  const date = new Date(d);
  return isNaN(date)
    ? String(d)
    : date.toLocaleDateString("en-GB", { year: "numeric", month: "short", day: "numeric" });
};

export const STATUS_OPTIONS = ["pending", "processing", "shipped", "delivered", "cancelled"];
export const STATUS_VARIANT = {
  pending: "warning",
  processing: "info",
  shipped: "primary",
  delivered: "success",
  cancelled: "danger",
  canceled: "danger",
};

export const extractError = (json, status) => {
  if (json?.errors && typeof json.errors === "object") {
    const all = Object.values(json.errors).flat().filter(Boolean);
    if (all.length) return all.join(" • ");
  }
  return json?.message || `HTTP error! Status: ${status}`;
};
