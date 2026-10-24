import { useEffect, useState } from "react";
import { Modal, Button, Form, Spinner, Alert } from "react-bootstrap";
import { useAdmin } from "../../Contexts/AdminContext";
import { RESOURCES } from "../../AdminConfig/adminConfig";
import { parsePage, unwrapOne, readLang, displayName } from "../Admin/adminUtils";

const LANGS = [
  ["en", "EN"],
  ["ar", "AR"],
];

const fieldId = (f) => `${f.translated ? "t-" : ""}${f.key}`;

const initial = (f, data, lang) => {
  if (!data) return "";
  if (f.translated) return readLang(data, lang, f.key) ?? "";
  if (data[f.key] != null && typeof data[f.key] !== "object") return data[f.key];
  const relName = f.key.replace(/_id$/, "");
  return data[relName]?.id ?? "";
};


const clearable = (f) => !f.required && (f.type === "text" || f.type === "textarea" || f.type == null);

const buildPayload = (fields, values, isEdit) => {
  const p = {};
  fields.forEach((f) => {
    if (f.translated) {
      LANGS.forEach(([lang]) => {
        const v = values[`${lang}.${f.key}`];
        if (v !== "" && v != null) {
          p[lang] = { ...(p[lang] || {}), [f.key]: v };
        } else if (isEdit && clearable(f)) {
          p[lang] = { ...(p[lang] || {}), [f.key]: null };
        }
      });
    } else {
      const v = values[f.key];
      if (v === "" || v == null) {
        if (isEdit && clearable(f)) p[f.key] = null;
        return;
      }
      p[f.key] = f.type === "number" || f.optionsFrom ? Number(v) : v;
    }
  });
  return p;
};

const ResourceForm = ({ show, onHide, resource, item, onSaved }) => {
  const { request } = useAdmin();
  const cfg = RESOURCES[resource];
  const isEdit = !!item;
  const fields = isEdit && cfg.editFields ? cfg.editFields : cfg.fields;

  const [values, setValues] = useState({});
  const [options, setOptions] = useState({});
  const [initLoading, setInitLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const loadAll = async (key) => {
    const first = parsePage(await request(RESOURCES[key].path, { query: { page: 1 } }));
    let rows = first.rows;
    for (let p = 2; p <= Math.min(first.last, 20); p++) {
      rows = rows.concat(parsePage(await request(RESOURCES[key].path, { query: { page: p } })).rows);
    }
    return rows;
  };

  useEffect(() => {
    if (!show) return;
    let ignore = false;

    (async () => {
      setError(null);
      setInitLoading(true);

      let data = item;
      if (item) {
        try {
          data = unwrapOne(await request(`${cfg.path}/${item.id}`)); 
        } catch {
          data = item; 
        }
      }

      const v = {};
      fields.forEach((f) => {
        if (f.translated) LANGS.forEach(([lang]) => (v[`${lang}.${f.key}`] = initial(f, data, lang)));
        else v[f.key] = initial(f, data);
      });

      const need = [...new Set(fields.filter((f) => f.optionsFrom).map((f) => f.optionsFrom))];
      const opts = {};
      await Promise.all(
        need.map(async (k) => {
          try {
            opts[k] = await loadAll(k);
          } catch {
            opts[k] = [];
          }
        })
      );

      if (!ignore) {
        setValues(v);
        setOptions(opts);
        setInitLoading(false);
      }
    })();

    return () => {
      ignore = true;
    };
    
  }, [show, item?.id, resource]);

  const set = (k) => (e) => setValues((s) => ({ ...s, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!isEdit) {
      for (const f of fields) {
        if (!f.required) continue;
        const empty = f.translated
          ? LANGS.some(([lang]) => !String(values[`${lang}.${f.key}`] ?? "").trim())
          : !String(values[f.key] ?? "").trim();
        if (empty) {
          setError(`"${f.label}" is required${f.translated ? " (EN & AR)" : ""}`);
          return;
        }
      }
    }

    setSaving(true);
    try {
      await request(isEdit ? `${cfg.path}/${item.id}` : cfg.path, {
        method: isEdit ? "PUT" : "POST",
        body: (cfg.transformPayload || ((p) => p))(buildPayload(fields, values, isEdit)),
      });
      await onSaved(isEdit ? "updated" : "created");
      onHide();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const control = (f, key, extra = {}) => {
    if (f.type === "textarea") {
      return <Form.Control as="textarea" rows={3} value={values[key] ?? ""} onChange={set(key)} {...extra} />;
    }
    if (f.type === "select") {
      const opts = f.options
        ? f.options
        : (options[f.optionsFrom] || []).map((r) => ({ value: r.id, label: displayName(r) }));
      return (
        <Form.Select value={values[key] ?? ""} onChange={set(key)}>
          <option value="">Select...</option>
          {opts.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </Form.Select>
      );
    }
    return (
      <Form.Control
        type={f.type === "number" ? "number" : "text"}
        step={f.type === "number" ? "any" : undefined}
        value={values[key] ?? ""}
        onChange={set(key)}
        {...extra}
      />
    );
  };

  return (
    <Modal show={show} onHide={() => !saving && onHide()} centered backdrop="static">
      <Form onSubmit={submit}>
        <Modal.Header closeButton>
          <Modal.Title className="fs-5 fw-bold">
            {isEdit ? "Edit" : "Add"} {cfg.singular}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {initLoading ? (
            <div className="text-center py-4">
              <Spinner animation="border" size="sm" />
            </div>
          ) : (
            fields.map((f) =>
              f.translated ? (
                LANGS.map(([lang, tag]) => (
                  <Form.Group className="mb-3" key={`${fieldId(f)}-${lang}`}>
                    <Form.Label className="small fw-semibold">
                      {f.label} ({tag}) {f.required && <span className="text-danger">*</span>}
                    </Form.Label>
                    {control(f, `${lang}.${f.key}`, lang === "ar" ? { dir: "rtl" } : {})}
                  </Form.Group>
                ))
              ) : (
                <Form.Group className="mb-3" key={fieldId(f)}>
                  <Form.Label className="small fw-semibold">
                    {f.label} {f.required && <span className="text-danger">*</span>}
                  </Form.Label>
                  {control(f, f.key)}
                </Form.Group>
              )
            )
          )}
          {error && (
            <Alert variant="danger" className="py-2 small mb-0">
              {error}
            </Alert>
          )}
        </Modal.Body>

        <Modal.Footer>
          <Button variant="outline-secondary" onClick={onHide} disabled={saving}>
            Cancel
          </Button>
          <Button type="submit" className="adm-btn-primary" disabled={saving || initLoading}>
            {saving ? <Spinner size="sm" animation="border" /> : "Save"}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default ResourceForm;
