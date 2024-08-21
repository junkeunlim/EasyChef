import React from "react";
import RecipeCard from "../RecipeCard";
const TopRecipes = () => {
    return(        
        <div className="container px-4 px-lg-5 mt-5">
            <div className="row gx-4 gx-lg-5 row-cols-2 row-cols-md-3 row-cols-xl-4 justify-content-center">
                    <RecipeCard/>
                    <RecipeCard/>
                    <RecipeCard/>
                    <RecipeCard/>
            </div>
        </div>  
    );
}

export default TopRecipes;
