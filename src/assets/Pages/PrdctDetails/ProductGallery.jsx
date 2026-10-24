import React, { useState } from "react";
import Lightbox from "yet-another-react-lightbox";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import Zoom from "yet-another-react-lightbox/plugins/zoom";

import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";

const FALLBACK_IMG =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="320" height="320"><rect width="320" height="320" fill="#EEE"/></svg>`
  );

const ProductGallery = ({ images = [] }) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [lightboxIndex, setLightboxIndex] = useState(-1);

  const list = images.length > 0 ? images : [FALLBACK_IMG];
  const current = list[selectedImage] ?? list[0];

  return (
    <div style={{ width: "100%" }}>
      <div
        className="border rounded-3 p-2 mb-3"
        style={{ cursor: "pointer" }}
        onClick={() => setLightboxIndex(selectedImage)}
      >
        <img
          src={current}
          alt="product main photo"
          style={{ width: "100%", height: "320px", objectFit: "contain" }}
        />
      </div>

      <div className="d-flex justify-content-center align-items-center flex-wrap gap-1">
        {list.map((src, i) => (
          <div
            key={i}
            onClick={() => setSelectedImage(i)}
            style={{
              width: "60px",
              height: "60px",
              border:
                selectedImage === i
                  ? "2px solid #00000056"
                  : "1px solid #e5e7eb",
              borderRadius: "6px",
              padding: "2px",
              cursor: "pointer",
              transition: "border-color 0.2s ease",
            }}
          >
            <img
              src={src}
              alt={`thumbnail${i + 1}`}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                borderRadius: "4px",
              }}
            />
          </div>
        ))}
      </div>

      <Lightbox
        open={lightboxIndex >= 0}
        close={() => setLightboxIndex(-1)}
        index={lightboxIndex}
        slides={list.map((src) => ({ src }))}
        plugins={[Thumbnails, Zoom]}
      />
    </div>
  );
};

export default ProductGallery;