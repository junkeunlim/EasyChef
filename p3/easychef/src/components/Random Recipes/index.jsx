import React, {useState, useEffect} from "react";
import '../../css/styles.css'
import Header from "../../components/Header";
import Navbar from "../../components/Navbar"
import Search from "../../components/Searchbar";
import RecipeCard from "../../components/RecipeCard"
import axios from "axios"

const RandomRecipes = () => {
    const [recipes, setRecipes] = useState("")

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get("http://localhost:8000/recipes/all/");
                setRecipes(response.data)
                console.log(response.data)
            } catch (error) {
                console.error(error);
            }
        };
    
        fetchData();
    }, []);

    return (
        <>
            <div className="container px-4 px-lg-5 mt-5">  
                <div className="row gx-4 gx-lg-5 row-cols-2 row-cols-md-3 row-cols-xl-4 justify-content-center">
                {
                Array.isArray(recipes) ? 
                Array.from({length: 4}).map((_, i) => {
                    const recipe = recipes[Math.floor(Math.random() * recipes.length)];
                    return <RecipeCard name={recipe.name} time={recipe.time} img={recipe.image} id={recipe.id} />
                }) : 
                <p>No Recipes!</p>
                }
                </div>

            </div>


        </>
    );
}
export default RandomRecipes;