import { useState } from "react";
import { Form } from "react-bootstrap";
import { AiFillStar } from "react-icons/ai";

const RatingsFilter = ({ onRatingChange }) => {
  const [selectedRatings, setSelectedRatings] = useState([]);


  const ratings = [5, 4, 3, 2];

  const handleCheckboxChange = (rating) => {
    const updated = selectedRatings.includes(rating)
      ? selectedRatings.filter((r) => r !== rating)
      : [...selectedRatings, rating];

    setSelectedRatings(updated);
    if (onRatingChange) onRatingChange(updated);
  };

 
  const renderStars = (count) => {
    return [1, 2, 3, 4, 5].map((star) => (
      <AiFillStar
        key={star}
        style={{ color: star <= count ? "#FF9017" : "#DEE2E6" }}
        className="fs-5 me-1"
      />
    ));
  };

  return (
    <ul className="list-unstyled mb-0 mt-3">
      {ratings.map((rating) => (
        <li key={rating} className="check-box-style py-1 d-flex align-items-center">
          <Form.Check
            type="checkbox"
            id={`rating-check-${rating}`}
            checked={selectedRatings.includes(rating)}
            onChange={() => handleCheckboxChange(rating)}
            className="me-3 shadow-none"
            style={{ cursor: "pointer" }}
          />
          <label
            htmlFor={`rating-check-${rating}`}
            className="d-flex align-items-center mb-0"
            style={{ cursor: "pointer" }}
          >
            {renderStars(rating)}
          </label>
        </li>
      ))}
    </ul>
  );
};

export default RatingsFilter;