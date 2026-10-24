import React from 'react';

const CartItemCard = ({ item, onRemove, onUpdateQuantity }) => {
  const currentQty = Number(item.quantity) || 1;
  const maxQty = Math.max(10, currentQty);

  return (
    <div className="d-flex align-items-center justify-content-between flex-wrap p-3 border-bottom backGroung-white">
      <div className="d-flex align-items-center gap-3">
        <img
          src={item.image || item.product?.image}
          alt={item.title || item.product?.name}
          className="rounded border"
          style={{ width: '80px', height: '80px', objectFit: 'cover' }}
        />
        <div>
          <h6 className="fw-bold mb-1">{item.title || item.product?.name}</h6>
          <small className="text-muted d-block mb-1">
            Size: medium, Color: blue, Material: Plastic
          </small>
          <small className="text-muted d-block mb-2">
            Seller: {item.seller || 'Artel Market'}
          </small>

          <div className="d-flex gap-2">
            <button
              type="button"
              className="btn btn-outline-danger btn-sm px-3 py-1"
              onClick={() => onRemove(item.id)}
            >
              Remove
            </button>
            <button
              type="button"
              className="btn btn-outline-danger btn-sm px-3 py-1"
            >
              Save for later
            </button>
          </div>
        </div>
      </div>

      <div className="text-end">
        <h5 className="fw-bold mb-2">
          ${item.price || item.product?.price}
        </h5>
        <div className="d-flex align-items-center gap-1">
          <span className="text-muted small">Qty:</span>
          <select
            className="form-select form-select-sm"
            value={currentQty}
            onChange={(e) => onUpdateQuantity(item.id, Number(e.target.value))}
            style={{ width: '70px' }}
          >
            {Array.from({ length: maxQty }, (_, i) => i + 1).map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default CartItemCard;