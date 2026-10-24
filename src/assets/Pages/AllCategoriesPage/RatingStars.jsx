import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";

const RatingStars = ({ rating = 0 }) => {
  const stars = [1, 2, 3, 4, 5];
  return (
    <>
      <div className="d-flex align-items-center gap-1 text-warning">
        {stars.map((starIndex) => {
          if (rating >= starIndex) {
            return <FaStar key={starIndex} />;
          } else if (rating >= starIndex - 0.5) {
            return <FaStarHalfAlt key={starIndex} />;
          } else {
            return (
              <FaRegStar
                key={starIndex}
                className="text-secondary opacity-50"
              />
            );
          }
        })}
      </div>
    </>
  );
};

export default RatingStars;
