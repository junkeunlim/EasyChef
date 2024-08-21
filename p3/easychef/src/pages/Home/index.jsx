import React from "react";
import '../../css/styles.css'
import Header from "../../components/Header";
import Navbar from "../../components/Navbar"
import Search from "../../components/Searchbar";
import RecipeCard from "../../components/RecipeCard"
import aboutBackground from "../../assets/HeaderExample2.png"
import header1 from "../../assets/HeaderExample1.png"
import RandomRecipes from "../../components/Random Recipes";
const HomePage = () => {
    return (
        <>
           <Navbar/>
           <Header/>
           <section className="py-5">
            <div className="text-center">
                <h3 className="popularhome">Recipes for you to enjoy...</h3>
                <RandomRecipes/>
            </div>
            
        </section>

        <section className="py-5" id="about" style={{backgroundImage: `url(${aboutBackground})`, backgroundSize: "cover", backgroundPosition: "center"}}>
            <div className="container px-4 px-lg-5 mt-5 justify-content-center">
                <h3 className="popularhome text-center">ABOUT</h3>
            </div>
        </section>

        <section className="py-5">
            <div className="popularhome">
                <h4 className="searchforrecipes">SEARCH FOR RECIPES</h4>
            </div>

            <div className="container px-4 px-lg-5 mt-5">
                {/* Search Form */}
                <Search/>
            </div>
        </section>


        {/* Footer*/}
        <footer className="py-4 bg-dark navbar mt-auto" style={{backgroundImage: `url(${header1})`, height: "auto", clear: "both", backgroundSize: "cover", backgroundPosition: "center"}}>
            <div className="container d-flex justify-content-between">
              <p className="m-0 text-center">Copyright &copy; Your Website 2023</p>
              <div className="d-flex align-items-center">
                <div className="mr-3 pe-3 popularhome" style={{fontSize: "larger"}}>Connect Now:</div>
                <form action="#">
                  <div className="form-group d-flex">
                    <input type="email" className="form-control" id="notification-email" placeholder="Enter email"></input>
                    <button className="btn btn-primary" type="submit">
                      <span className="align-items-center justify-content-center">Signup</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </footer>
        </>
    );
}

export default HomePage;