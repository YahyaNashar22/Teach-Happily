import "../css/StarRating.css";

interface StarRatingProps {
  rating: number;
  setRating?: (rating: number) => void;
  max?: number;
}

const StarRating = ({ rating, setRating, max = 5 }: StarRatingProps) => {
  return (
    <div className="star-rating">
      {Array.from({ length: max }, (_, i) => (
        <span
          key={i}
          className={i < rating ? "star filled" : "star"}
          onClick={() => setRating && setRating(i + 1)} // only allow if setRating is passed
          style={{ cursor: setRating ? "pointer" : "default" }}
        >
          ★
        </span>
      ))}
    </div>
  );
};


export default StarRating;
