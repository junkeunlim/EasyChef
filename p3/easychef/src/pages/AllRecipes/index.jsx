import React, {useState, useEffect} from "react";
import '../../css/styles.css'
import Header from "../../components/Header";
import Navbar from "../../components/Navbar"
import Search from "../../components/Searchbar";
import RecipeCard from "../../components/RecipeCard"
import axios from "axios"

const AllRecipes = () => {
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
           <Navbar/>
           <Header/>
           <section className="py-5">
            <div className="popularhome text-center">
                <h3>ALL RECIPES</h3>
            </div>

            <div className="container px-4 px-lg-5 mt-5">  
                <div className="container px-4 px-lg-5 mt-5 mb-5">
                    {/* Search Form */}
                    <Search/>
                </div>

                <div className="row gx-4 gx-lg-5 row-cols-2 row-cols-md-3 row-cols-xl-4 justify-content-center">
                {
                    Array.isArray(recipes) ?
                    recipes.map(recipe => {

                      
                      return <RecipeCard name={recipe.name} time={recipe.time} img={recipe.image} id={recipe.id}/>;
                    }) :
                    <p>Recipes is not an array</p>
                }
                </div>

            </div>

            

            

        </section>
        </>
    );
}
export default AllRecipes;