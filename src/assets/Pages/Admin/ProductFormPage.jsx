import { useEffect, useRef, useState } from "react";
import { Alert, Button, Col, Form, Row, Spinner } from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router";
import { MdArrowBack, MdCloudUpload, MdDelete } from "react-icons/md";
import { useAdmin } from "../../Contexts/AdminContext";
import { RESOURCES } from "../../AdminConfig/adminConfig";
import { parsePage, unwrapOne, readLang, displayName } from "../Admin/adminUtils";
import "./admin-dashboard.css";

const MAX_SIZE_MB = 5;

const toFormData = (obj, fd = new FormData(), prefix = "") => {
  Object.entries(obj).forEach(([k, v]) => {
    if (v === undefined) return;
    const key = prefix ? `${prefix}[${k}]` : k;
    if (v === null) fd.append(key, "");
    else if (typeof v === "object" && !(v instanceof File)) toFormData(v, fd, key);
    else fd.append(key, v);
  });
  return fd;
};

const EMPTY = {
  sku: "",
  category_id: "",
  price: "",
  "en.name": "",
  "ar.name": "",
  "en.description": "",
  "ar.description": "",
};

const ProductFormPage = () => {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();
  const { request } = useAdmin();
  const cfg = RESOURCES.product;

  const [values, setValues] = useState(EMPTY);
  const [categories, setCategories] = useState([]);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [currentImage, setCurrentImage] = useState(null); 
  const [dragOver, setDragOver] = useState(false);

  const [initLoading, setInitLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const inputRef = useRef(null);

  useEffect(() => {
    let ignore = false;
    (async () => {
      setInitLoading(true);
      setError(null);
      try {
        const catPath = RESOURCES.category.path;
        const first = parsePage(await request(catPath, { query: { page: 1 } }));
        let rows = first.rows;
        for (let p = 2; p <= Math.min(first.last, 20); p++) {
          rows = rows.concat(parsePage(await request(catPath, { query: { page: p } })).rows);
        }

        let v = EMPTY;
        let img = null;
        if (isEdit) {
          const data = unwrapOne(await request(`${cfg.path}/${id}`));
          v = {
            sku: data.sku ?? "",
            category_id: data.category?.id ?? data.category_id ?? "",
            price: data.price ?? "",
            "en.name": readLang(data, "en", "name"),
            "ar.name": readLang(data, "ar", "name"),
            "en.description": readLang(data, "en", "description"),
            "ar.description": readLang(data, "ar", "description"),
          };
          img = data.image || null;
        }

        if (!ignore) {
          setCategories(rows);
          setValues(v);
          setCurrentImage(img);
        }
      } catch (e) {
        if (!ignore) setError(e.message);
      } finally {
        if (!ignore) setInitLoading(false);
      }
    })();
    return () => {
      ignore = true;
    };
  }, [id]);

  useEffect(() => {
    if (!file) {
      setPreview(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const set = (k) => (e) => setValues((s) => ({ ...s, [k]: e.target.value }));

  const pickFile = (f) => {
    if (!f) return;
    if (!f.type.startsWith("image/")) {
      setError("Please choose an image file (JPG, PNG, WEBP...).");
      return;
    }
    if (f.size > MAX_SIZE_MB * 1024 * 1024) {
      setError(`Image must be smaller than ${MAX_SIZE_MB}MB.`);
      return;
    }
    setError(null);
    setFile(f);
  };

  const clearFile = () => {
    setFile(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  const submit = async (e) => {
    e.preventDefault();
    setError(null);

    const required = [
      ["sku", "SKU"],
      ["category_id", "Category"],
      ["price", "Price"],
      ["en.name", "Name (EN)"],
      ["ar.name", "Name (AR)"],
    ];
    for (const [k, label] of required) {
      if (!String(values[k] ?? "").trim()) {
        setError(`"${label}" is required`);
        return;
      }
    }

    const desc = (lang) => {
      const d = values[`${lang}.description`].trim();
      return d || (isEdit ? null : undefined); 
    };

    const payload = {
      sku: values.sku.trim(),
      category_id: Number(values.category_id),
      price: Number(values.price),
      en: { name: values["en.name"].trim(), description: desc("en") },
      ar: { name: values["ar.name"].trim(), description: desc("ar") },
    };

    setSaving(true);
    try {
      let body;
      let method = isEdit ? "PUT" : "POST";

      if (file) {
        body = toFormData(payload);
        body.append("image", file);
        if (isEdit) {
          body.append("_method", "PUT");
          method = "POST";
        }
      } else {
        body = payload; 
      }

      await request(isEdit ? `${cfg.path}/${id}` : cfg.path, { method, body });
      navigate("/admin/products", {
        state: { flash: `Product ${isEdit ? "updated" : "created"} successfully` },
      });
    } catch (err) {
      setError(err.message);
      setSaving(false);
    }
  };

  if (initLoading) {
    return (
      <div className="text-center p-5">
        <Spinner animation="border" variant="danger" />
      </div>
    );
  }

  const shownImage = preview || currentImage;

  return (
    <Form onSubmit={submit}>
      <div className="adm-page-head">
        <Link to="/admin/products" className="adm-back" title="Back">
          <MdArrowBack size={20} />
        </Link>
        <div>
          <h4 className="fw-bold mb-0">{isEdit ? "Edit product" : "Add product"}</h4>
          <small className="text-muted">
            {isEdit ? `#${id}` : "Fill in the details and upload a product image"}
          </small>
        </div>
      </div>

      {error && (
        <Alert variant="danger" dismissible onClose={() => setError(null)} className="py-2 small">
          {error}
        </Alert>
      )}

      <div className="adm-form-grid">
        <div className="adm-card p-4">
          <h6 className="adm-section-title">General</h6>
          <Row className="g-3 mb-3">
            <Col md={6}>
              <Form.Label className="small fw-semibold">
                SKU <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control value={values.sku} onChange={set("sku")} placeholder="PROD-1001" />
            </Col>
            <Col md={6}>
              <Form.Label className="small fw-semibold">
                Price <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                type="number"
                step="any"
                min="0"
                value={values.price}
                onChange={set("price")}
              />
            </Col>
            <Col xs={12}>
              <Form.Label className="small fw-semibold">
                Category <span className="text-danger">*</span>
              </Form.Label>
              <Form.Select value={values.category_id} onChange={set("category_id")}>
                <option value="">Select...</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {displayName(c)}
                  </option>
                ))}
              </Form.Select>
            </Col>
          </Row>

          <h6 className="adm-section-title mt-4">Name &amp; description</h6>
          <Row className="g-3">
            <Col md={6}>
              <Form.Label className="small fw-semibold">
                Name (EN) <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control value={values["en.name"]} onChange={set("en.name")} />
            </Col>
            <Col md={6}>
              <Form.Label className="small fw-semibold">
                Name (AR) <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control dir="rtl" value={values["ar.name"]} onChange={set("ar.name")} />
            </Col>
            <Col md={6}>
              <Form.Label className="small fw-semibold">Description (EN)</Form.Label>
              <Form.Control
                as="textarea"
                rows={5}
                value={values["en.description"]}
                onChange={set("en.description")}
              />
            </Col>
            <Col md={6}>
              <Form.Label className="small fw-semibold">Description (AR)</Form.Label>
              <Form.Control
                as="textarea"
                rows={5}
                dir="rtl"
                value={values["ar.description"]}
                onChange={set("ar.description")}
              />
            </Col>
          </Row>
        </div>

        <div className="adm-card p-4">
          <h6 className="adm-section-title">Product image</h6>

          <label
            className={`adm-dropzone ${dragOver ? "adm-dropzone--over" : ""} ${
              shownImage ? "adm-dropzone--has" : ""
            }`}
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragOver(false);
              pickFile(e.dataTransfer.files?.[0]);
            }}
          >
            {shownImage ? (
              <img src={shownImage} alt="Product preview" />
            ) : (
              <>
                <MdCloudUpload size={40} />
                <span className="fw-semibold">Click to upload or drag &amp; drop</span>
                <small>JPG, PNG or WEBP — up to {MAX_SIZE_MB}MB</small>
              </>
            )}
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              hidden
              onChange={(e) => pickFile(e.target.files?.[0])}
            />
          </label>

          {file && (
            <div className="d-flex justify-content-between align-items-center mt-3 small">
              <span className="text-truncate me-2">{file.name}</span>
              <button
                type="button"
                className="adm-icon-btn adm-icon-btn--danger"
                title="Remove selected image"
                onClick={clearFile}
              >
                <MdDelete />
              </button>
            </div>
          )}
          {isEdit && currentImage && !file && (
            <p className="text-muted small mt-3 mb-0">
              Current image. Choose a new one to replace it.
            </p>
          )}
        </div>
      </div>

      <div className="d-flex justify-content-end gap-2 mt-4">
        <Link to="/admin/products" className="btn btn-outline-secondary">
          Cancel
        </Link>
        <Button type="submit" className="adm-btn-primary px-4" disabled={saving}>
          {saving ? <Spinner size="sm" animation="border" /> : isEdit ? "Save changes" : "Create product"}
        </Button>
      </div>
    </Form>
  );
};

export default ProductFormPage;