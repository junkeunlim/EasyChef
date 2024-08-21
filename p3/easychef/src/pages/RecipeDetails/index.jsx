import React, {useEffect, useState, useContext} from "react";
import '../../css/styles.css'
import Header from "../../components/Header";
import Navbar from "../../components/Navbar"
import Search from "../../components/Searchbar";
import RecipeCard from "../../components/RecipeCard"
import recipeImage from "../../assets/cake4.jpg"
import { useParams } from 'react-router-dom';
import ReviewForm from "../../components/Review";
import axios from "axios";
import ShowReview from "../../components/ShowReview";
import AuthContext from "../../contexts/AuthContext";


const RecipeDetails = () => {
    const { id } = useParams();
    const [data, setData] = useState(null)
    const [showForm, setShowForm] = useState(true)
    const {bearerToken, refreshToken} = useContext(AuthContext)
    const [reviews, setReviews] = useState("")

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/recipes/${id}/`);
                console.log(response.data)
                setData(response.data)
            } catch (error) {
                console.error(error);
            }

            try {
                const response = await axios.put(`http://localhost:8000/recipes/${id}/editreview/`, {
                    refresh: refreshToken
                }, {
                    headers: { Authorization: `Bearer ${bearerToken}` }
                });
                console.log(response.data)
                setShowForm(false)
            } catch (error) {
                setShowForm(true)
            }

        };
    
        fetchData();
    }, []);

    if (!data) {
        return <div></div>;
    }


    return (
        <>
      <Navbar />
      <Header />




      <div className="container mt-5">
        <div className="row">
          <div className="col-md-12 text-center">
            <h2 className="mb-2">{data.name}</h2>
            <h2 className="mb-2">{data.title}</h2>
            <p className="mb-1">By: {data.owner}</p>
            <p className="mb-2">{data.reviews.length} Reviews, 1 Likes</p>
            <div className="rating mb-3">
              {[...Array(5)].map((_, index) => (
                <span
                  key={index}
                  className={`fa fa-star ${index < data.rating ? "checked" : ""}`}
                ></span>
              ))}
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-md-6 mb-3">
            <img src={data.image} className="img-fluid rounded" />
          </div>
          <div className="col-md-6">
            <p><strong>Total Time:</strong> {data.time}</p>
            <hr />
            <p>{data.description}</p>
          </div>
        </div>

        <hr />

        <div className="row">
          <div className="col-md-6">
            <h3>Ingredients</h3>
            <ul className="list-unstyled">
              {data.ingredients && data.ingredients.map((ingredient, index) => (
                <li key={index}>
                  {ingredient.name} - {ingredient.quantity}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="row">
          <div className="col-md-6">
            <h3>Steps</h3>
            <ol>
              {data.steps && data.steps.map((step, index) => (
                <li key={index}>
                  {step.description} <img src={step.image} className="img-fluid rounded mt-2 mb-2" />
                </li>
              ))}
            </ol>
          </div>
        </div>

        <hr />

        
      </div>

    {
        showForm ?
      <div className="row mt-4">
        <div className="col-md-12">
            <h3>Add Your Review</h3>
            <ReviewForm id={id}/>
        </div>
        </div> : <></>
    }


    <div className="row">
    <div className="col-md-12">
        <h3>Reviews</h3>
        <div className="card">
        <div className="card-body">
            {
                data.reviews.map((review, index) => (
                    console.log("empty"),
                    <ShowReview key={index} name={review.user} review={review.review} rating={review.rating}/>
                ))
            }
            
        </div>
        </div>
    </div>
    </div>

    </>
    );
};

export default RecipeDetails;
