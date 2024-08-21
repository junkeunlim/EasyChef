import React, {useState, useEffect} from "react";
import "../../css/styles.css";

const ShowReview = ({name, rating, review}) => {
  
    const getStars = (rating) => {
      const fullStars = "★".repeat(Math.floor(rating));
      const halfStars = (rating % 1 !== 0) ? "½" : "";
      const emptyStars = "☆".repeat(Math.floor(5 - rating));
      return `${fullStars}${halfStars}${emptyStars}`;
    }
  
    return (
      <div className="media mb-3">
            <img src="https://via.placeholder.com/64x64.png?text=User" className="mr-3 rounded-circle" alt="User Avatar" />
            <div className="media-body">
              <h5 className="mt-0">{name}</h5>
              <div className="rating">
                {getStars(rating)}
              </div>
              <p>{review}</p>
            </div>
      </div>
    );
  };

export default ShowReview;