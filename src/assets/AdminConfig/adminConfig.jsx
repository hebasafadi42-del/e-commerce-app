import { Badge } from "react-bootstrap";
import {
  MdInventory2,
  MdCategory,
  MdShoppingCart,
  MdLabel,
  MdLocationCity,
  MdMap,
  MdImage,
} from "react-icons/md";
import { displayName, money, fmtDate, STATUS_OPTIONS, STATUS_VARIANT } from "../Pages/Admin/adminUtils";



const rel = (row, name) => (row[name] ? displayName(row[name]) : row[`${name}_id`] ?? "—");

export const RESOURCES = {
  product: {
    path: "product",
    route: "products",
    singular: "Product",
    plural: "Products",
    icon: MdInventory2,
    customForm: true,
    columns: [
      { label: "ID", render: (r) => r.id },
      {
        label: "Image",
        render: (r) =>
          r.image ? (
            <img src={r.image} alt="" className="adm-thumb" />
          ) : (
            <span className="adm-thumb adm-thumb--empty">
              <MdImage />
            </span>
          ),
      },
      { label: "SKU", render: (r) => r.sku },
      { label: "Name", render: (r) => displayName(r) },
      { label: "Category", render: (r) => rel(r, "category") },
      { label: "Price", render: (r) => money(r.price) },
    ],
    fields: [
      { key: "sku", label: "SKU", type: "text", required: true },
      { key: "category_id", label: "Category", type: "select", optionsFrom: "category", required: true },
      { key: "price", label: "Price", type: "number", required: true },
      { key: "name", label: "Name", translated: true, required: true },
      { key: "description", label: "Description", translated: true, type: "textarea" },
    ],
  },

  category: {
    path: "category",
    route: "categories",
    singular: "Category",
    plural: "Categories",
    icon: MdCategory,
    columns: [
      { label: "ID", render: (r) => r.id },
      { label: "Name", render: (r) => displayName(r) },
    ],
    fields: [{ key: "name", label: "Name", translated: true, required: true }],
  },

  order: {
    path: "order",
    route: "orders",
    singular: "Order",
    plural: "Orders",
    icon: MdShoppingCart,
    columns: [
      { label: "ID", render: (r) => r.order_number || r.number || r.id },
      {
        label: "Customer",
        render: (r) => r.customer?.name || r.customer_name || rel(r, "customer"),
      },
      {
        label: "Status",
        render: (r) => {
          const s = String(r.status?.name ?? r.status ?? "pending").toLowerCase();
          return <Badge bg={STATUS_VARIANT[s] || "secondary"}>{s}</Badge>;
        },
      },
      { label: "Total", render: (r) => money(r.total ?? r.grand_total ?? r.total_price) },
      { label: "Date", render: (r) => fmtDate(r.created_at) },
    ],
    fields: [
      { key: "customer_id", label: "Customer ID", type: "number", required: true },
      { key: "address_id", label: "Address ID", type: "number", required: true },
      { key: "notes", label: "Notes", type: "textarea" },
    ],
    editFields: [
      {
        key: "status",
        label: "Status",
        type: "select",
        options: STATUS_OPTIONS.map((s) => ({ value: s, label: s })),
      },
      { key: "notes", label: "Notes", type: "textarea" },
    ],
  },

  brand: {
    path: "brand",
    route: "brands",
    singular: "Brand",
    plural: "Brands",
    icon: MdLabel,
    columns: [
      { label: "ID", render: (r) => r.id },
      { label: "Name", render: (r) => displayName(r) },
    ],
    
    fields: [{ key: "name", label: "Name", translated: true, required: true }],
    transformPayload: (p) => {
      const name = p.en?.name ?? p.ar?.name;
      return name ? { name, ...p } : p;
    },
  },

  city: {
    path: "city",
    route: "cities",
    singular: "City",
    plural: "Cities",
    icon: MdLocationCity,
    columns: [
      { label: "ID", render: (r) => r.id },
      { label: "Name", render: (r) => displayName(r) },
    ],
    fields: [{ key: "name", label: "Name", translated: true, required: true }],
  },

 
};