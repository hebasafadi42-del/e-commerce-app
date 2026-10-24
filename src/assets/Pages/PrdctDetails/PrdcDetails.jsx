import { useContext, useEffect, useState } from "react";
import PageLayout from "../../Layouts/Pagelayout";
import Breadcrumb from "react-bootstrap/Breadcrumb";
import { Button, Col, Container, Row, Spinner ,  Form } from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router";
import { FaRegHeart, FaHeart } from "react-icons/fa6";
import { AiOutlineGlobal } from "react-icons/ai";
import { MdOutlineVerifiedUser, MdAddShoppingCart } from "react-icons/md";
import { useCart } from "../../Contexts/CartContext";
import ProductGallery from "./ProductGallery";
import supplierImg from "../../imgs/SupplierImg.jpg";
import germany from "../../imgs/germany.png";
import ProductTabs from "./ProductTabs";
import PrdctMayLike from "./PrdctMayLike";
import RelatedPrcts from "./RelatedPrcts";
import DiscountSec from "./DiscountSec";
import { API_Config } from "../../Config/API-Config";
import { AuthContext } from "../../Contexts/AuthContext"; 

const PrdcDetails = () => {
  const { id } = useParams();
  const { token } = useContext(AuthContext);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);
  const navigate = useNavigate();
const { addToCart } = useCart();
const [quantity, setQuantity] = useState(1);
const [adding, setAdding] = useState(false);

const handleAddToCart = async () => {
  if (!token) {
    navigate("/login"); 
  }
  setAdding(true);
  await addToCart(product.id, quantity);
  setAdding(false);
};

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setErrorMsg(null);

    const url = `${API_Config.Base_URL}/${API_Config.ENDPOINTS.PRODUCTS}/${id}?with_avatar=1`;

    const headers = { Accept: "application/json" };
    if (token) headers.Authorization = `Bearer ${token}`;

    fetch(url, { headers, signal: controller.signal })
      .then((res) => {
        if (res.status === 404) throw new Error("Product not found.");
        if (res.status === 401) throw new Error("Please log in again.");
        if (!res.ok) throw new Error("Something went wrong. Please try again.");
        return res.json();
      })
      .then((data) => {
        console.log(data);
        if (!data?.data) throw new Error("Product not found.");
        setProduct(data.data);
      })
      .catch((err) => {
      
        if (err.name === "AbortError") return;
        console.error("Product details error:", err);
     
        setErrorMsg(
          err instanceof TypeError
            ? "Network error. Check your connection."
            : err.message
        );
        setProduct(null);
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [id, token]);

  const handleSendInquiry = () => {};
  const handleSaveForLater = () => {};


  if (loading) {
    return (
      <PageLayout>
        <div className="d-flex justify-content-center p-5">
          <Spinner animation="border" variant="danger" />
        </div>
      </PageLayout>
    );
  }

  if (errorMsg || !product) {
    return (
      <PageLayout>
        <Container>
          <p className="text-center text-muted p-5">
            {errorMsg || "Product not found."}
          </p>
          <div className="text-center">
            <Link to="/product-categories">Back to products</Link>
          </div>
        </Container>
      </PageLayout>
    );
  }


  const images = [
    ...new Set([product.image, ...(product.images ?? [])]),
  ].filter(Boolean);

  const productSpecs = [
    { label: "Category", value: product.category?.name ?? "-" },
    { label: "SKU", value: product.sku ?? "-" },
    {
      label: "Colors",
      value: product.colors?.map((c) => c.name).join(", ") || "-",
    },
  ];
   const infoRows = [
    { icon: <img src={germany} alt="germany flag" width={20} />, text: "Germany, Berlin" },
    { icon: <MdOutlineVerifiedUser />, text: "Verified Seller" },
    { icon: <AiOutlineGlobal />, text: "Worldwide shipping" },
  ];


  return (
    <>
       <PageLayout>
      <Container>
        <Breadcrumb className="my-4">
          <Breadcrumb.Item
            linkAs={Link}
            linkProps={{
              to: "/",
              className: "text-secondary text-decoration-none",
            }}
          >
            Home
          </Breadcrumb.Item>
          <Breadcrumb.Item
            linkAs={Link}
            linkProps={{
              to: "/product-categories",
              className: "text-secondary text-decoration-none",
            }}
          >
            {product.category?.name ?? "Products"}
          </Breadcrumb.Item>
          <Breadcrumb.Item active>{product.name}</Breadcrumb.Item>
        </Breadcrumb>

        <Row className="g-4 mb-4">
          <Col lg={9}>
            <div className="backGroung-white border rounded-3 shadow-sm p-4 h-100">
              <Row className="g-4">
                <Col md={6}>
                  <ProductGallery key={product.id} images={images} />
                </Col>

                <Col md={6}>
                  <span
                    className="badge rounded-pill mb-2 px-3 py-2"
                    style={{ backgroundColor: "#FDE8ED", color: "#F0345D" }}
                  >
                    {product.category?.name ?? "Product"}
                  </span>

                  <h3 className="fw-bold mb-1">{product.name}</h3>
                  <p className="text-muted small mb-3">SKU: {product.sku ?? "-"}</p>

                  <div
                    className="rounded-3 p-3 mb-4 price-bg-color"
                  
                  >
                    <div className="text-muted small">Price</div>
                    <div className="fw-bold fs-2" style={{ color: "#fa3434" }}>
                      ${product.price}
                    </div>
                  </div>

                  {product.description && (
                    <p
                      className="text-muted mb-4"
                      style={{
                        display: "-webkit-box",
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {product.description}
                    </p>
                  )}

                  {product.colors?.length > 0 && (
                    <div className="mb-4">
                      <div className="fw-semibold mb-2">Colors</div>
                      <div className="d-flex flex-wrap gap-2 ">
                        {product.colors.map((c) => (
                          <span
                            key={c.id}
                            className="d-inline-flex align-items-center gap-2 border rounded-pill px-3 py-1 small"
                          >
                            <span
                              style={{
                                width: 16,
                                height: 16,
                                borderRadius: "50%",
                                backgroundColor: c.hex,
                                border: "1px solid #ddd",
                                display: "inline-block",
                              }}
                            />
                            {c.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="border rounded-3 overflow-hidden">
                    {productSpecs.map((item, index) => (
                      <div
                        key={item.label}
                        className="d-flex px-3 py-2 color-style"
                       
                      >
                        <span className="text-muted" style={{ width: "40%" }}>
                          {item.label}
                        </span>
                        <span className="fw-medium">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </Col>
                <Col md={6}>
                <div className="d-flex align-items-center gap-3 mt-4">
  <Form.Control
    type="number"
    min={1}
    value={quantity}
    onChange={(e) => setQuantity(Math.max(1, Number(e.target.value) || 1))}
    aria-label="Quantity"
    style={{ width: 90 }}
  />

  <Button
    onClick={handleAddToCart}
    disabled={adding}
    className="flex-grow-1 py-2 border-0 d-inline-flex align-items-center justify-content-center gap-2"
    style={{ backgroundColor: "#F0345D" }}
  >
    {adding ? (
      <Spinner animation="border" size="sm" />
    ) : (
      <MdAddShoppingCart />
    )}
    Add to Cart
  </Button>
</div>
                </Col>
              </Row>
            </div>
          </Col>

          <Col lg={3}>
            <div
              className="backGroung-white border rounded-3 shadow-sm p-3 position-sticky"
              style={{ top: "20px" }}
            >
              <div className="d-flex align-items-center gap-3 border-bottom pb-3">
                <img
                  src={supplierImg}
                  alt="supplier"
                  width={48}
                  height={48}
                  className="rounded-circle"
                  style={{ objectFit: "cover" }}
                />
                <div>
                  <div className="text-muted small">Supplier</div>
                  <div className="fw-semibold">Guanjoi Trading LLC</div>
                </div>
              </div>

              <div className="py-3">
                {infoRows.map((row) => (
                  <div key={row.text} className="d-flex align-items-center gap-3 mb-2">
                    <span
                      className="d-inline-flex align-items-center justify-content-center rounded-circle text-muted fs-5"
                      style={{ width: 34, height: 34, backgroundColor: "#F1F3F5" }}
                    >
                      {row.icon}
                    </span>
                    <span className="text-muted">{row.text}</span>
                  </div>
                ))}
              </div>

              <Button
                onClick={handleSendInquiry}
                className="w-100 mb-2 py-2 send-inquiry-btn border-0"
              >
                Send inquiry
              </Button>
              <Button
                as={Link}
                to="/seller-profile"
                style={{ color: "#F0345D", backgroundColor: "#ffffff" }}
                className="sellersPro-btn w-100 py-2 border"
              >
                Seller's profile
              </Button>

              <div className="text-center mt-3">
                <Button
                  onClick={handleSaveForLater}
                  style={{ color: "#F0345D" }}
                  className="bg-transparent border-0 small p-0 d-inline-flex align-items-center gap-2"
                >
                  {product.is_favorite ? <FaHeart /> : <FaRegHeart />}
                  Save for later
                </Button>
              </div>
            </div>
          </Col>
        </Row>

        <Row className="g-4">
          <Col md={6} lg={9}>
            <div className="backGroung-white border rounded-3 shadow-sm p-4 h-100">
              <ProductTabs
                description={product.description}
                sku={product.sku}
              />
            </div>
          </Col>
          <Col md={6} lg={3}>
            <PrdctMayLike />
          </Col>
          <Col lg={12}>
            <RelatedPrcts />
          </Col>
          <Col lg={12}>
            <DiscountSec />
          </Col>
        </Row>
      </Container>
    </PageLayout>
    </>
  );
};

export default PrdcDetails;