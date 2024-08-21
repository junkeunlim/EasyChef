import React, { useState, useContext } from "react";
import creationImage from "../../assets/recipecreation2.png"
import '../../css/styles.css'
import RecipeCard from "../../components/RecipeCard";
import Navbar from "../../components/Navbar";
import TopRecipes from "../../components/TopRecipes";
import axios from "axios"
import AuthContext from "../../contexts/AuthContext";
import { useNavigate } from 'react-router-dom';
import RandomRecipes from "../../components/Random Recipes";

const CreateRecipe = () => {
    const navigate = useNavigate();
    const {bearerToken, refreshToken} = useContext(AuthContext)
    const [steps, setSteps] = useState([{ value: "" }]);
    const [ingredients, setIngredients] = useState([{ name: "", quantity: "" }]);
    const [recipeName, setRecipeName] = useState("");
    const [recipeDescription, setRecipeDescription] = useState("");
    const [setOfDiets, setSetOfDiets] = useState("");
    const [cuisine, setCuisine] = useState("");
    const [servings, setServings] = useState(0);
    const [mainImage, setMainImage] = useState("");
    const [recipeTime, setRecipeTime] = useState(0);

    const handleStepChange = (i, event) => {
        const values = [...steps];
        values[i].value = event.target.value;
        setSteps(values);
    };

    const handleIngredientChange = (i, event) => {
        const values = [...ingredients];
        values[i][event.target.name] = event.target.value;
        setIngredients(values);
    };

    const addStep = () => {
        setSteps([...steps, { value: "" }]);
    };

    const addIngredient = () => {
        setIngredients([...ingredients, { name: "", quantity: "" }]);
    };

    const handleRemoveStep = (index) => {
        const values = [...steps];
        values.splice(index, 1);
        setSteps(values);
      };
    
      const handleRemoveIngredient = (index) => {
        const values = [...ingredients];
        values.splice(index, 1);
        setIngredients(values);
      };

    const handleStepImageChange = (i, event) => {
        const values = [...steps];
        const file = event.target.files[0];
        if (file){
            const renamed = new File([file], `step_image_${i}`, {type: file.type})
            values[i].image = renamed;
            setSteps(values);
        }
    };

    const onSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData();
        formData.append('name', recipeName);
        formData.append('description', recipeDescription);
        formData.append('set_of_diets', setOfDiets);
        formData.append('cuisine', cuisine);
        formData.append('ingredients', JSON.stringify(ingredients));
        formData.append('servings', servings);
        formData.append('image', mainImage);
        formData.append('time', recipeTime)
        formData.append('refresh', refreshToken)
        const updatedSteps = steps.map(step => {
            const {image, ...rest} = step;
            return rest;
          });
        formData.append('steps', JSON.stringify(updatedSteps))
        
        
        steps.forEach((step, index) => {
            if (step.image) {
                console.log(step.image.name)
                formData.append(step.image.name, step.image);
            }
        });

        try {
            const config = {
                headers: {
                  'Content-Type': 'multipart/form-data',
                   Authorization: `Bearer ${bearerToken}`
                },
                timeout: 3000
              };
            
            const response = await axios.post('http://127.0.0.1:8000/recipes/add/', formData, config);
            console.log(response)
            if (response.status === 201) {
                // Handle successful recipe creation
                navigate(`/recipes/${response.data.id}`)

            } else {
                // Handle error in recipe creation
            }
        } catch (error) {
            console.log(error)
        }
    };

    return (
    <>
        <Navbar/>
        <div className="Reciperow gx-4 gx-lg-5 row-cols-2 row-cols-md-3 row-cols-xl-2">

            <div className="Recipecolumn2">
                <div className="col mb-5">
                    <div className="card h-100">
                        {/*!-- Product image--*/}
                        <img className="card-img-top" src={creationImage} alt="..." />
                    </div>
                </div>
            </div>

            <div className="Recipecolumn3 mt-5">
                <div className="col mb-5">

                    <div className="Recipeform d-flex justify-content-between align-items-center mb-3">
                        <h4 className="text-right">NEW RECIPE FORM</h4>
                    </div>

                    <form onSubmit={onSubmit}>
                    <div className="row-mt-2">
                        <div className="col-md-9"><label htmlFor="img">Add a picture</label><input className="form-control" type="file" onChange={(e) => setMainImage(e.target.files[0])}></input></div>
                    </div>

                    <div className="row mt-2">
                        <div className="col-md-6"><label className="labels">Recipe Name</label><input type="text" className="form-control" placeholder="Recipe name" value={recipeName} onChange={(e) => setRecipeName(e.target.value)}></input></div>
                    </div>

                    <div className="row mt-2">
                        <div className="col-md-4"><label className="labels">Time</label><input type="text" className="form-control" placeholder="Time" value={recipeTime} onChange={(e) => setRecipeTime(e.target.value)}></input></div>
                        <div className="col-md-4"><label className="labels">Yield</label><input type="text" className="form-control" placeholder="Yield" value={servings} onChange={(e) => setServings(e.target.value)}></input></div>
                    </div>
                    <div className="row mt-2">
                        <div className="col-md-4"><label className="labels">Set of Diets</label><input type="text" className="form-control" placeholder="Set of Diets" value={setOfDiets} onChange={(e) => setSetOfDiets(e.target.value)}></input></div>
                        <div className="col-md-4"><label className="labels">Cuisine</label><input type="text" className="form-control" placeholder="Cuisine" value={cuisine} onChange={(e) => setCuisine(e.target.value)}></input></div>
                    </div>

                    <div className="row mt-2">
                        <div className="col-md-9">
                            <label htmlFor="exampleFormControlTextarea1">Recipe Description</label>
                            <textarea className="form-control" id="exampleFormControlTextarea1" rows="3" value={recipeDescription} onChange={(e) => setRecipeDescription(e.target.value)}></textarea>
                        </div>
                    </div>

                    <div className="row mt-2">
                        <div className="form-group col-md-9">
                            <label htmlFor="exampleFormControlTextarea1">Steps</label>
                            {steps.map((step, idx) => (
                                <div key={idx}>
                                    <textarea
                                        type="text"
                                        className="form-control"
                                        placeholder={`Step ${idx + 1}`}
                                        value={step.value}
                                        onChange={(e) => handleStepChange(idx, e)}
                                    />
                                    <label htmlFor={`step-image-${idx + 1}`}>Add an image (optional)</label>
                                    <input
                                        className="form-control"
                                        type="file"
                                        id={`step-image-${idx + 1}`}
                                        onChange={(e) => handleStepImageChange(idx, e)}
                                    ></input>
                                <button
                                    className="btn btn-danger"
                                    type="button"
                                    onClick={() => handleRemoveStep(idx)}
                                    >
                                    Remove Step
                                    </button>
                                </div>
                            ))}
                            <button type="button" className="btn btn-secondary" onClick={addStep}>Add step</button>
                        </div>    
                    </div>

                    <div className="row mt-2">
                        <div className="form-group col-md-9">
                            <label htmlFor="exampleFormControlTextarea1">Ingredients</label>
                            {ingredients.map((ingredient, idx) => (
                                <div key={idx}>
                                <input
                                    type="text"
                                    name="name"
                                    className="form-control"
                                    placeholder={`Ingredient ${idx + 1}`}
                                    value={ingredient.name}
                                    onChange={(e) => handleIngredientChange(idx, e)}
                                />
                                <input
                                    type="text"
                                    name="quantity"
                                    className="form-control"
                                    placeholder={`Quantity ${idx + 1}`}
                                    value={ingredient.quantity}
                                    onChange={(e) => handleIngredientChange(idx, e)}
                                />
                            <button
                                type="button"
                                className="btn btn-danger"
                                onClick={() => handleRemoveIngredient(idx)}
                                >
                                Remove Ingredient
                            </button>
                                </div>
                                
                            ))}
                            <button type="button" className="btn btn-success" onClick={addIngredient}>Add ingredient</button>
                        </div>
                    </div>

                    <div className="SubmitButton mt-5 text-center">
                        <button className="btn btn-primary profile-button" type="submit">Submit</button>
                    </div>
                    </form>
                </div>

            </div>

        </div>    

        <h3 className="PopularRecipes">MORE TRENDING RECIPES</h3>
        <RandomRecipes/>
        
    </>
    );
}
export default CreateRecipe;