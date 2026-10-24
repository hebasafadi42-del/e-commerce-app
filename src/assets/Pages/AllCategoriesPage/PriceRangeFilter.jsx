import { useState } from "react";
import Slider from "@mui/material/Slider";
import { Form, Button } from "react-bootstrap";

const PriceRangeFilter = ({ onApplyPrice }) => {

    const MIN_LIMIT = 0;
  const MAX_LIMIT = 9999;

  const [priceRange, setPriceRange] = useState([MIN_LIMIT, MAX_LIMIT]);

  const handleSliderChange = (event, newValue) => {
    setPriceRange(newValue);
  };

  const handleMinInputChange = (e) => {
    const value = e.target.value === "" ? "" : Number(e.target.value);
    setPriceRange([value, priceRange[1]]);
  };

  const handleMaxInputChange = (e) => {
    const value = e.target.value === "" ? "" : Number(e.target.value);
    setPriceRange([priceRange[0], value]);
  };

  const handleApply = () => {
    if (onApplyPrice) {
      onApplyPrice({
        min: priceRange[0] || MIN_LIMIT,
        max: priceRange[1] || MAX_LIMIT,
      });
    }
  };
  return (
    <>
      <div className="pt-2">
      <div className="px-2">
        <Slider
          value={priceRange}
          onChange={handleSliderChange}
          min={MIN_LIMIT}
          max={MAX_LIMIT}
          sx={{
            color: "#F0345D", 
            height: 4,
            "& .MuiSlider-rail": {
              backgroundColor: "#cbe0ff", 
              opacity: 1,
            },
            "& .MuiSlider-thumb": {
              backgroundColor: "#fff",
              border: "2px solid #e0e0e0",
              boxShadow: "0px 2px 4px rgba(0,0,0,0.1)",
              width: 18,
              height: 18,
              "&:hover, &.Mui-active, &.Mui-focusVisible": {
                boxShadow: "0px 0px 0px 6px rgba(240, 52, 93, 0.16)",
              },
            },
          }}
        />
      </div>

      <div className="d-flex align-items-center gap-2 mt-2">
        <div className="flex-fill">
          <Form.Label className="fs-6  mb-1">Min</Form.Label>
          <Form.Control
            type="number"
            placeholder="0"
            value={priceRange[0]}
            onChange={handleMinInputChange}
            className="shadow-none text-secondary"
            style={{ borderRadius: "8px", borderColor: "#DEE2E6" }}
          />
        </div>
        <div className="flex-fill">
          <Form.Label className="fs-6  mb-1">Max</Form.Label>
          <Form.Control
            type="number"
            placeholder="999999"
            value={priceRange[1]}
            onChange={handleMaxInputChange}
            className="shadow-none text-secondary"
            style={{ borderRadius: "8px", borderColor: "#DEE2E6" }}
          />
        </div>
      </div>

      <Button
        variant="outline-light"
        onClick={handleApply}
        className="apply-btn w-100 mt-3 fw-medium backGroung-white"
        style={{
          
          color: "#F0345D",
          borderColor: "#DEE2E6",
          borderRadius: "8px",
          
        }}
      >
        Apply
       
      </Button>
    </div>
    </>
  )
}

export default PriceRangeFilter
