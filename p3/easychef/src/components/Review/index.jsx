import React, { useState, useContext } from "react";
import "../../css/styles.css";
import axios from "axios";
import AuthContext from "../../contexts/AuthContext";


const ReviewForm = ({ id }) => {
    const [reviewText, setReviewText] = useState("");
    const [rating, setRating] = useState(0);
    const {bearerToken, refreshToken} = useContext(AuthContext)

  const handleSubmit = async (e) => {
        var myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${bearerToken}`);

        var formdata = new FormData();
        formdata.append("rating", rating);
        formdata.append("review", reviewText);

        var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: formdata,
        };

        fetch(`http://127.0.0.1:8000/recipes/${id}/addreview/`, requestOptions)
        .then(response => response.text())
        .then(result => console.log(result))
        .catch(error => console.log('error', error));


  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="reviewText">Your Review:</label>
        <textarea
          className="form-control"
          id="reviewText"
          rows="3"
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
        ></textarea>
        </div>
        <div className="form-group">
            <label htmlFor="rating">Rating:</label>
            <div className="rating">
                {[...Array(5)].map((_, index) => (
                <span
                    key={index}
                    className={`star ${index < rating ? "checked" : ""}`}
                    onClick={() => setRating(index + 1)}
                >
                    &#9733;
                </span>
                ))}
            </div>
        </div>



      <button type="submit" className="btn btn-primary">
        Submit Review
      </button>
    </form>
  );
};

export default ReviewForm;