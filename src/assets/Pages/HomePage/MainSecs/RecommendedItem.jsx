import React, { useEffect, useState } from "react";
import Card from "react-bootstrap/Card";
import { Spinner, Button } from "react-bootstrap";
import { Link } from "react-router";
import { API_Config } from "../../../Config/API-Config";


const FALLBACK_IMG =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120"><rect width="120" height="120" fill="#EEE"/></svg>`
  );

const RecommendedItem = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    const url = `${API_Config.Base_URL}/${API_Config.ENDPOINTS.PRODUCTS}`;

    fetch(url, { headers: { Accept: "application/json" } })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Something went wrong, please try again.");
        }
        return res.json();
      })
      .then((data) => {
        // console.log(data); 
        const list = data?.data?.data || data?.data || [];
        setProducts(Array.isArray(list) ? list : []);
      })
      .catch(() => {
        setErrorMsg("Could not load products. Check your connection and try again.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div className=" my-5 container cards-contai">
      <h3 className="mb-4">Recommended items</h3>

      {loading && (
        <div className="d-flex justify-content-center p-5">
          <Spinner animation="border" variant="danger" />
        </div>
      )}

      {!loading && errorMsg && (
        <div className="text-center p-5">
          <p className="text-muted">{errorMsg}</p>
          <Button variant="outline-danger" onClick={() => window.location.reload()}>
            Try again
          </Button>
        </div>
      )}


      {!loading && !errorMsg && products.length === 0 && (
        <p className="text-center text-muted p-5 m-0">No products available.</p>
      )}

      {!loading && !errorMsg && products.length > 0 && (
        <div className="d-flex flex-wrap justify-content-between">
          {products.slice(0, 10).map((item) => (
            <Card key={item.id} className="cardss backGroung-white border-style mb-3 rounded-1">
              <Link to={`/product/${item.id}`} className="text-decoration-none">
                <div
                  className="d-flex justify-content-center align-items-center my-4"
                  style={{ height: "150px" }}
                >
                  <Card.Img
                    style={{ maxWidth: "70%", maxHeight: "100%", objectFit: "contain" }}
                    src={item.image || FALLBACK_IMG}
                    alt={item.name}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = FALLBACK_IMG;
                    }}
                  />
                </div>
                <Card.Body>
                  <Card.Title className="text-dark-light">${item.price}</Card.Title>
                  <Card.Text className="text-muted fs-5 product-name">{item.name}</Card.Text>
                </Card.Body>
              </Link>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecommendedItem;