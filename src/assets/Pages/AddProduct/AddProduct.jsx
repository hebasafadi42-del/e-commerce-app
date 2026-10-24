import { useContext, useEffect, useRef, useState } from "react";
import { NavLink } from "react-router";
import {
  Alert,
  Button,
  Card,
  Col,
  Form,
  Image,
  InputGroup,
  Row,
  Spinner,
  Stack,
  Toast,
  ToastContainer,
} from "react-bootstrap";
import { FiImage, FiUploadCloud, FiX } from "react-icons/fi";
import ProfileLayout from "../../Layouts/ProfileLayout";
import { AuthContext } from "../../Contexts/AuthContext";
import { API_Config } from "../../Config/API-Config";

const PRODUCT_URL = `${API_Config.Base_URL}/product`;
const CATEGORY_URL = `${API_Config.Base_URL}/category`;
const MAX_IMAGE_SIZE = 2 * 1024 * 1024; 

const EMPTY_FORM = {
  name: "",
  description: "",
  price: "",
  category_id: "",
};

const getServerError = (json, status) => {
  if (json?.errors) {
    const first = Object.values(json.errors).flat()[0];
    if (first) return first;
  }
  return json?.message || `HTTP error! Status: ${status}`;
};

const AddProduct = () => {
  const { token } = useContext(AuthContext);
  const [form, setForm] = useState(EMPTY_FORM);
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const fileInputRef = useRef(null);

  const set = (key) => (e) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  useEffect(() => {
    if (!token) return;

    setLoadingCategories(true);
    fetch(CATEGORY_URL, {
      headers: { Accept: "application/json", Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load categories");
        return res.json();
      })
      .then((json) => {
        const raw = json.data ?? json.categories ?? json;
        setCategories(
          Array.isArray(raw) ? raw : Array.isArray(raw?.data) ? raw.data : [],
        );
      })
      .catch((err) => setErrorMsg(err.message))
      .finally(() => setLoadingCategories(false));
  }, [token]);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const clearImage = () => {
    setImageFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setErrorMsg("Please choose an image file");
      e.target.value = "";
      return;
    }
    if (file.size > MAX_IMAGE_SIZE) {
      setErrorMsg("Image must be less than 2MB");
      e.target.value = "";
      return;
    }

    setImageFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const valid =
    form.name.trim() &&
    Number(form.price) > 0 &&
    form.category_id &&
    imageFile;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!valid) return;

    setErrorMsg(null);
    setSuccessMsg(null);
    setSaving(true);

    const formData = new FormData();
    formData.append("name", form.name.trim());
    formData.append("description", form.description.trim());
    formData.append("price", form.price);
    formData.append("category_id", form.category_id);
    formData.append("image", imageFile);

    fetch(PRODUCT_URL, {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    })
      .then(async (res) => {
        const json = await res.json().catch(() => null);
        if (!res.ok) throw new Error(getServerError(json, res.status));
        return json;
      })
      .then(() => {
        setForm(EMPTY_FORM);
        clearImage();
        setSuccessMsg("Product added successfully");
      })
      .catch((err) => setErrorMsg(err.message))
      .finally(() => setSaving(false));
  };

  if (!token) {
    return (
      <ProfileLayout>
        <div className="p-4 text-center">
          You are not authorized to view this content
          <div className="mt-3">
            Please <NavLink to="/log-in">Log In</NavLink>
          </div>
        </div>
      </ProfileLayout>
    );
  }

  return (
    <ProfileLayout>
      <Card className="border-0 shadow-sm rounded-4">
        <Card.Body className="p-4">
          <Card.Title as="h5" className="fw-bold">
            Add Product
          </Card.Title>
          <Card.Text className="text-muted small mb-4">
            Fill in the details and upload a photo to list your product.
          </Card.Text>

          <Form onSubmit={handleSubmit}>
            <Row className="g-4">
              <Col lg={5}>
                <Form.Label className="fw-semibold small">
                  Product image
                </Form.Label>

                {previewUrl ? (
                  <div className="position-relative">
                    <Image
                      src={previewUrl}
                      alt="Product preview"
                      rounded
                      fluid
                      className="w-100 object-fit-cover bg-light rounded-4"
                      style={{ aspectRatio: "1 / 1" }}
                    />
                    <Button
                      variant="light"
                      className="position-absolute top-0 end-0 m-2 rounded-circle p-0 d-flex align-items-center justify-content-center shadow-sm"
                      style={{ width: "34px", height: "34px" }}
                      onClick={clearImage}
                      aria-label="Remove image"
                    >
                      <FiX />
                    </Button>
                  </div>
                ) : (
                  <Card
                    role="button"
                    tabIndex={0}
                    className="bg-light text-center rounded-4 w-100"
                    style={{
                      aspectRatio: "1 / 1",
                      border: "2px dashed #dda3b0",
                    }}
                    onClick={() => fileInputRef.current?.click()}
                    onKeyDown={(e) =>
                      (e.key === "Enter" || e.key === " ") &&
                      fileInputRef.current?.click()
                    }
                  >
                    <Card.Body className="d-flex flex-column align-items-center justify-content-center text-muted">
                      <span
                        className="d-flex align-items-center justify-content-center rounded-circle bg-danger-subtle text-danger mb-3"
                        style={{ width: "64px", height: "64px" }}
                      >
                        <FiUploadCloud size={28} />
                      </span>
                      <span className="fw-semibold text-body">
                        Click to upload an image
                      </span>
                      <small>PNG or JPG, up to 2MB</small>
                    </Card.Body>
                  </Card>
                )}

                <Form.Control
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={handleImageChange}
                />

                {previewUrl && (
                  <Button
                    variant="link"
                    size="sm"
                    className="p-0 mt-2 text-danger d-inline-flex align-items-center gap-1"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <FiImage /> Change image
                  </Button>
                )}
              </Col>

              <Col lg={7}>
                <Row className="g-3">
                  <Col xs={12}>
                    <Form.Group controlId="productName">
                      <Form.Label className="fw-semibold small">Name</Form.Label>
                      <Form.Control
                        className="bg-light border-0 py-3 rounded-3"
                        type="text"
                        value={form.name}
                        onChange={set("name")}
                        required
                      />
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group controlId="productPrice">
                      <Form.Label className="fw-semibold small">Price</Form.Label>
                      <InputGroup>
                        <Form.Control
                          className="bg-light border-0 py-3 rounded-start-3"
                          type="number"
                          min="0"
                          step="0.01"
                          value={form.price}
                          onChange={set("price")}
                          required
                        />
                        <InputGroup.Text className="bg-light border-0 text-muted rounded-end-3">
                          AED
                        </InputGroup.Text>
                      </InputGroup>
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group controlId="productCategory">
                      <Form.Label className="fw-semibold small">
                        Category
                      </Form.Label>
                      <Form.Select
                        className="bg-light border-0 py-3 rounded-3"
                        value={form.category_id}
                        onChange={set("category_id")}
                        disabled={loadingCategories}
                        required
                      >
                        <option value="">
                          {loadingCategories ? "Loading..." : "Select category"}
                        </option>
                        {categories.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name || c.title}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>

                  <Col xs={12}>
                    <Form.Group controlId="productDescription">
                      <Form.Label className="fw-semibold small">
                        Description
                      </Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={5}
                        className="bg-light border-0 rounded-3"
                        value={form.description}
                        onChange={set("description")}
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </Col>
            </Row>

            {!imageFile && (
              <Alert variant="light" className="small text-muted mt-4 mb-0 py-2">
                A product image is required.
              </Alert>
            )}

            <Stack
              direction="horizontal"
              gap={3}
              className="mt-4 flex-column flex-sm-row align-items-stretch align-items-sm-center"
            >
              <Button
                variant="danger"
                type="submit"
                className="px-4 py-2 rounded-3 border-0"
                style={{
                  backgroundImage: "linear-gradient(to right, #F0345D, #DDA3B0)",
                }}
                disabled={saving || !valid}
              >
                {saving ? (
                  <>
                    <Spinner size="sm" className="me-2" />
                    Adding...
                  </>
                ) : (
                  "Add product"
                )}
              </Button>
            </Stack>
          </Form>
        </Card.Body>
      </Card>

      <ToastContainer
        position="top-center"
        className="p-3"
        style={{ zIndex: 9999 }}
      >
        <Toast
          show={!!errorMsg}
          onClose={() => setErrorMsg(null)}
          delay={4000}
          autohide
          bg="warning"
          className="border-0 shadow"
        >
          <Toast.Body className="d-flex justify-content-between align-items-center small py-2 px-3">
            <span>{errorMsg}</span>
            <button
              type="button"
              className="btn-close ms-2"
              aria-label="Close"
              onClick={() => setErrorMsg(null)}
            ></button>
          </Toast.Body>
        </Toast>

        <Toast
          show={!!successMsg}
          onClose={() => setSuccessMsg(null)}
          delay={3000}
          autohide
          bg="success"
          className="text-white border-0 shadow"
        >
          <Toast.Body className="d-flex justify-content-between align-items-center small py-2 px-3">
            <span>{successMsg}</span>
            <button
              type="button"
              className="btn-close btn-close-white ms-2"
              aria-label="Close"
              onClick={() => setSuccessMsg(null)}
            ></button>
          </Toast.Body>
        </Toast>
      </ToastContainer>
    </ProfileLayout>
  );
};

export default AddProduct;