import { useCallback, useEffect, useRef, useState } from "react";
import { Alert, Button, Modal, Pagination, Spinner, Table } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router";
import { MdAdd, MdEdit, MdDelete } from "react-icons/md";
import { useAdmin } from "../../Contexts/AdminContext";
import { RESOURCES } from "../../AdminConfig/adminConfig";
import { parsePage } from "../Admin/adminUtils";
import ResourceForm from "../Admin/ResourceForm";

const pageWindow = (current, last) => {
  const from = Math.max(1, current - 2);
  const to = Math.min(last, current + 2);
  const pages = [];
  for (let p = from; p <= to; p++) pages.push(p);
  return pages;
};

const ResourcePage = ({ resource }) => {
  const cfg = RESOURCES[resource];
 
  const path = cfg?.path;

  const { request } = useAdmin();
  const navigate = useNavigate();
  const location = useLocation();

  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState({ last: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [flash, setFlash] = useState(location.state?.flash ?? null);

  const [formItem, setFormItem] = useState(undefined); 
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(null);

  const lastReq = useRef(0);

  const fetchRows = useCallback(
    async (p = page) => {
      if (!path) return;
      const id = ++lastReq.current;
      setLoading(true);
      setError(null);
      try {
        const json = await request(path, { query: { page: p } });
        if (id !== lastReq.current) return;
        const parsed = parsePage(json);
        setRows(parsed.rows);
        setMeta({ last: parsed.last, total: parsed.total });
      } catch (e) {
        if (id === lastReq.current) setError(e.message);
      } finally {
        if (id === lastReq.current) setLoading(false);
      }
    },
    [request, path, page]
  );

  useEffect(() => {
    fetchRows(page);
  }, [page, fetchRows]);

  useEffect(() => {
    setPage(1);
    setFlash(location.state?.flash ?? null);
  }, [resource]);

  const handleSaved = async (kind) => {
    setFlash(`${cfg.singular} ${kind} successfully`);
    await fetchRows(page);
  };

  const openCreate = () => {
    if (cfg.customForm) navigate(`/admin/${cfg.route}/new`);
    else setFormItem(null);
  };
  const openEdit = (row) => {
    if (cfg.customForm) navigate(`/admin/${cfg.route}/${row.id}/edit`);
    else setFormItem(row);
  };

  const confirmDelete = async () => {
    setDeleting(true);
    setDeleteError(null);
    try {
      await request(`${path}/${deleteTarget.id}`, { method: "DELETE" });
      setDeleteTarget(null);
      setFlash(`${cfg.singular} deleted successfully`);
      if (rows.length === 1 && page > 1) setPage(page - 1);
      else await fetchRows(page);
    } catch (e) {
      setDeleteError(e.message);
    } finally {
      setDeleting(false);
    }
  };

  if (!cfg) {
    return (
      <div className="text-center p-5">
        <Alert variant="warning">Invalid or missing resource configuration.</Alert>
      </div>
    );
  }

  const Icon = cfg.icon;

  return (
    <>
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-4">
        <div>
          <h4 className="fw-bold mb-0 d-flex align-items-center gap-2">
            <Icon className="adm-title-icon" /> {cfg.plural}
          </h4>
          <small className="text-muted">{meta.total} total</small>
        </div>
        <Button className="adm-btn-primary d-flex align-items-center gap-1" onClick={openCreate}>
          <MdAdd size={20} /> Add {cfg.singular}
        </Button>
      </div>

      {flash && (
        <Alert variant="success" dismissible onClose={() => setFlash(null)} className="py-2">
          {flash}
        </Alert>
      )}

      <div className="adm-card">
        {loading ? (
          <div className="text-center p-5">
            <Spinner animation="border" variant="danger" />
          </div>
        ) : error ? (
          <Alert variant="danger" className="m-3 d-flex justify-content-between align-items-center">
            <span>{error}</span>
            <Button size="sm" variant="outline-danger" onClick={() => fetchRows(page)}>
              Retry
            </Button>
          </Alert>
        ) : rows.length === 0 ? (
          <p className="text-center text-muted p-5 mb-0">No {cfg.plural.toLowerCase()} yet</p>
        ) : (
          <div className="table-responsive">
            <Table hover className="adm-table mb-0 align-middle">
              <thead>
                <tr>
                  {cfg.columns.map((c) => (
                    <th key={c.label}>{c.label}</th>
                  ))}
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.id}>
                    {cfg.columns.map((c) => (
                      <td key={c.label}>{c.render(row)}</td>
                    ))}
                    <td className="text-end text-nowrap">
                      <button
                        type="button"
                        className="adm-icon-btn"
                        title="Edit"
                        onClick={() => openEdit(row)}
                      >
                        <MdEdit />
                      </button>
                      <button
                        type="button"
                        className="adm-icon-btn adm-icon-btn--danger"
                        title="Delete"
                        onClick={() => {
                          setDeleteError(null);
                          setDeleteTarget(row);
                        }}
                      >
                        <MdDelete />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        )}
      </div>

      {meta.last > 1 && (
        <Pagination className="adm-pagination justify-content-center mt-4">
          <Pagination.Prev disabled={page <= 1} onClick={() => setPage(page - 1)} />
          {pageWindow(page, meta.last).map((p) => (
            <Pagination.Item key={p} active={p === page} onClick={() => setPage(p)}>
              {p}
            </Pagination.Item>
          ))}
          <Pagination.Next disabled={page >= meta.last} onClick={() => setPage(page + 1)} />
        </Pagination>
      )}

      {!cfg.customForm && (
        <ResourceForm
          show={formItem !== undefined}
          onHide={() => setFormItem(undefined)}
          resource={resource}
          item={formItem || null}
          onSaved={handleSaved}
        />
      )}

     
      <Modal show={!!deleteTarget} onHide={() => !deleting && setDeleteTarget(null)} centered>
        <Modal.Header closeButton>
          <Modal.Title className="fs-5 fw-bold">Delete {cfg.singular}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete <strong>#{deleteTarget?.id}</strong>? This cannot be undone.
          {deleteError && (
            <Alert variant="danger" className="py-2 small mt-3 mb-0">
              {deleteError}
            </Alert>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={() => setDeleteTarget(null)} disabled={deleting}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmDelete} disabled={deleting}>
            {deleting ? <Spinner size="sm" animation="border" /> : "Delete"}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ResourcePage;