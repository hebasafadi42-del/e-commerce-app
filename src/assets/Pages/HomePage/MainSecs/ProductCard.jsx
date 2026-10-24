import React from "react";
import { Link } from "react-router";

const ProductCard = ({ product }) => {
  const discountPercent = Math.round(
    ((product.originalPrice - product.discountPrice) / product.originalPrice) * 100
  );

  return (
  
    <Link 
      to={`/product/${product.id}`} 
      className=" product-card text-center p-3 rounded text-decoration-none text-dark-light d-block h-100"
    >
      <div className="img-wrapper mb-2 d-flex align-items-center justify-content-center" style={{ height: "130px" }}>
        <img 
          src={product.image} 
          alt={product.title} 
          className="img-fluid mh-100" 
        />
      </div>

      <h6 className="my-3 text-truncate">{product.title}</h6>
          
      {discountPercent > 0 && (
        <span className="badge bg-danger-subtle text-danger rounded-pill px-3 py-1 fw-bold">
          -{discountPercent}%
        </span>
      )}
    </Link>
  );
};

export default ProductCard;