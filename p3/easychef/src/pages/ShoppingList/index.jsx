import React, {useEffect, useContext, useState} from "react";
import Navbar from "../../components/Navbar";
import Header from "../../components/Header";
import RecipeCard from "../../components/RecipeCard"
import AuthContext from "../../contexts/AuthContext";
import axios from "axios"

const ShoppingList = () => {
    const {bearerToken, refreshToken} = useContext(AuthContext)
    const [recipes, setRecipes] = useState("")

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get("http://localhost:8000/shoppinglist/view/", {
                    refresh: refreshToken,
                    headers: { Authorization: `Bearer ${bearerToken}` }
                });
                setRecipes(response.data.results)
                console.log(response.data.results)
            } catch (error) {
                console.error(error);
            }
        };
    
        fetchData();
    }, []);
    
    return (
        
        <>
            <Header />
            <Navbar />
            
            <div class="container rounded bg-white mt-5 mb-5 ">
                <div class="row mt-2">
                    <div class="col">
                        <h4 class="pb-3">My Recipes</h4>
                        <div>
                        {
                            Array.isArray(recipes) ?
                            recipes.map(recipe => {

                            
                            return <RecipeCard name={recipe.name} time={recipe.time} img={recipe.image} id={recipe.id}/>;
                            }) :
                            <p>Recipes is not an array</p>
                        }
                        </div>
                    </div>
                    
                    
                    <div class="col mt-5 px-lg-5">
                        <h4 class="pb-3">Total Ingredients</h4>
                        <h4 class="pb-3">{data.ingredients}</h4>
                    </div>
                </div>

            </div>

        </>
    );
};

export default ShoppingList;        