import React, {useEffect, useContext, useState} from "react";
import Navbar from "../../components/Navbar";
import Header from "../../components/Header";
import RecipeCard from "../../components/RecipeCard"
import AuthContext from "../../contexts/AuthContext";
import axios from "axios"

const MyRecipes = () => {
    const {bearerToken, refreshToken} = useContext(AuthContext)
    const [recipes, setRecipes] = useState("")

    useEffect(() => {
        const fetchData = async () => {
            let data = JSON.stringify({
            "refresh": refreshToken
            });

            let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: 'http://127.0.0.1:8000/recipes/myrecipes/',
            headers: { 
                'Content-Type': 'application/json', 
                'Authorization': `Bearer ${bearerToken}`
            },
            data : data
            };

            axios.request(config)
            .then((response) => {
            setRecipes(response.data.results);
            })
            .catch((error) => {
            console.log(error);
            });
        };
    
        fetchData();
    }, []);
    

    const handleDelete = async (id) => {
        try {
            const response = await axios.delete(`http://127.0.0.1:8000/recipes/${id}/delete/`, {
                refresh: refreshToken,
                headers: { Authorization: `Bearer ${bearerToken}` }
            })
            console.log(response)

            // Remove the deleted recipe from the state variable
            setRecipes(recipes.filter(recipe => recipe.id !== id))

        } catch(error){
            console.log(error)
        }
    }

    return (
        
        <>
            <Navbar/>
            <Header/>
            <div className="popularhome text-center">
                <h3>MY RECIPES</h3>
            </div>
            <div className="container px-4 px-lg-5 mt-5">
                <div className="row gx-4 gx-lg-5 row-cols-2 row-cols-md-3 row-cols-xl-4 justify-content-center">
                {
                    Array.isArray(recipes) ?
                    recipes.map(recipe => {
                        return !(recipe.length === 0) ? <RecipeCard 
                        name={recipe.name} 
                        time={recipe.time} 
                        img={recipe.image} 
                        id={recipe.id}
                        owned={true}
                        handleDelete={() => handleDelete(recipe.id)}/>
                         : 
                        <>
                         <h6>You have no recipes!</h6>
                         {console.log("hello")}
                        </>;
                    }) :
                    <p>Recipes is not an array</p>
                }
                </div>
            </div>
            
            
        </>
    );
}

export default MyRecipes