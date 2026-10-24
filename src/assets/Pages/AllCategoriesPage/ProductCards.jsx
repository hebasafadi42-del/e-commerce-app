import React from "react";
import ProductsCardItem from "./ProductsCardItem";

const ProductCards = ({ products, viewMode = "list" }) => {
  const isList = viewMode === "list";

  return (
    <>
      {products.map((item) => (
        <ProductsCardItem key={item.id} item={item} isList={isList} />
      ))}
    </>
  );
};

export default ProductCards;