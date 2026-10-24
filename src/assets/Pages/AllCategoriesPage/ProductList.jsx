import React, { useEffect, useState } from "react";
import { Col, Row, Spinner } from "react-bootstrap";
import FilterBar from "./FilterBar";
import ProductCards from "./ProductCards";
import PaginationBar from "../../components/PaginationBar";
import { API_Config } from "../../Config/API-Config";

const ProductList = ({ filters }) => {
  const [viewMode, setViewMode] = useState("list");
  const [sortBy, setsortBy] = useState("Featured");
  // const [isVerifiedOnly, setIsVerifiedOnly] = useState(false);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);

  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  const categoryId = filters?.categoryId;
  const priceRange = filters?.priceRange;
  const search = filters?.search;
  
  useEffect(() => {
    let ignore = false; 
    setLoading(true);
    setErrorMsg(null);

    const params = new URLSearchParams();
    if (categoryId) params.set("category_id", categoryId);
    if (search) params.set("search", search); 
    if (priceRange) {
      params.set("price_from", priceRange.min);
      params.set("price_to", priceRange.max);
    }
    if (sortBy === "PriceLowHigh") {
      params.set("order_by", "price");
      params.set("order", "asc");
    }
    if (sortBy === "PriceHighLow") {
      params.set("order_by", "price");
      params.set("order", "desc");
    }

    const url = `${API_Config.Base_URL}/${API_Config.ENDPOINTS.PRODUCTS}?${params}`;

    fetch(url, { headers: { Accept: "application/json" } })
      .then((res) => {
        if (!res.ok) throw new Error("Something went wrong");
        return res.json();
      })
      .then((data) => {
        if (ignore) return;
        console.log(data); 
        const list = data?.data?.data || data?.data || [];
        setProducts(Array.isArray(list) ? list : []);
      })
      .catch(() => {
        if (!ignore) setErrorMsg("Could not load products. Please try again.");
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [categoryId, priceRange, sortBy, search]);

  useEffect(() => {
    setPage(1);
  }, [categoryId, priceRange, sortBy, perPage, search]);

  const totalPages = Math.max(1, Math.ceil(products.length / perPage));
  const visibleProducts = products.slice((page - 1) * perPage, page * perPage);

  const handlePageChange = (p) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <Row>
      <Col className="backGroung-white p-2 border-style my-5 rounded-1" lg={12}>
        <div className="d-flex flex-wrap align-items-center">
          <p className="my-0 me-auto">{products.length} items</p>
          <FilterBar
            viewMode={viewMode}
            setViewMode={setViewMode}
            sortBy={sortBy}
            setsortBy={setsortBy}
            // isVerifiedOnly={isVerifiedOnly}
            // setIsVerifiedOnly={setIsVerifiedOnly}
          />
        </div>
      </Col>

      <Col lg={12}>
        {loading && (
          <div className="d-flex justify-content-center p-5">
            <Spinner animation="border" variant="danger" />
          </div>
        )}

        {!loading && errorMsg && (
          <p className="text-center text-muted p-5">{errorMsg}</p>
        )}

        {!loading && !errorMsg && products.length === 0 && (
          <p className="text-center text-muted p-5">No products found.</p>
        )}

        {!loading && !errorMsg && products.length > 0 && (
          <>
            <Row>
              <ProductCards products={visibleProducts} viewMode={viewMode} />
            </Row>

            <PaginationBar
              page={page}
              totalPages={totalPages}
              perPage={perPage}
              onPageChange={handlePageChange}
              onPerPageChange={setPerPage}
            />
          </>
        )}
      </Col>
    </Row>
  );
};

export default ProductList;