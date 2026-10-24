import { useState } from "react";
import { Collapse } from "react-bootstrap";
import { BiChevronUp, BiChevronDown } from "react-icons/bi";

const FilterSection = ({
  title,
  items = [],
  renderItem,
  initialCount = 4,
  children, 
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const [showAll, setShowAll] = useState(false);

  const visibleItems = showAll ? items : items.slice(0, initialCount);

  return (
    <>
      <div
        className="mt-3 d-flex align-items-center justify-content-between"
        style={{ cursor: "pointer", userSelect: "none" }}
        onClick={() => setIsOpen(!isOpen)}
      >
        <h6 className="fw-bold m-0">{title}</h6>
        {isOpen ? (
          <BiChevronUp className="text-muted" size={20} />
        ) : (
          <BiChevronDown className="text-muted" size={20} />
        )}
      </div>

      <Collapse in={isOpen}>
        <div>
          {children ? (
            children
          ) : (
            <>
              <ul className="my-2 list-unstyled ps-0">
                {visibleItems.map((item, index) => renderItem(item, index))}
              </ul>

              {items.length > initialCount && (
                <button
                  className="btn btn-link p-0 text-decoration-none shadow-none"
                  style={{ color: showAll ? "#F0345D" : "#6c757d" }}
                  onClick={() => setShowAll(!showAll)}
                >
                  {showAll ? "See less" : "See all"}
                </button>
              )}
            </>
          )}
        </div>
      </Collapse>
    </>
  );
};

export default FilterSection;