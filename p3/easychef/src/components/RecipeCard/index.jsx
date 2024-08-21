import React, {useContext} from "react";
import { Link } from "react-router-dom";
import { useParams } from 'react-router-dom';
import axios from "axios";
import AuthContext from "../../contexts/AuthContext";
const RecipeCard = ({ img, name, time, id, owned, handleDelete}) => {

    const {bearerToken, refreshToken} = useContext(AuthContext)

    const onClick = async (e) => {
        try{
            const response = await axios.delete(`http://127.0.0.1:8000/recipes/${id}/delete/`, {
                refresh: refreshToken,
                headers: { Authorization: `Bearer ${bearerToken}` }
            })
            console.log(response)

        } catch(error){
            console.log(error)
        }
    }

  return (
    <div className="col mb-5">
      <div className="card h-100">
        <img className="card-img-top" src={img} alt="..." />
        <div className="card-body p-4 d-flex flex-column align-items-center">
          <h5 className="hummingbird text-center">{name}</h5>
          <div className="d-flex align-items-center text-center">
            <span className="material-icons md-18 mr-2">watch_later</span>
            {time}
          </div>
        </div>
        <div className="card-footer p-4 pt-0 border-top-0 bg-transparent">
          <div className="text-center">
            <Link className="btn btn-outline-dark mt-auto" to={`/recipes/${id}`}>
              Details
            </Link>
          </div>
            {
                owned ? 
                <div className="text-center mt-2">
                    <button className="btn btn-danger mt-auto" onClick={handleDelete}>Delete</button>
                </div>
                 : <></>
            }
        </div>
      </div>
    </div>
  );
};

export default RecipeCard;