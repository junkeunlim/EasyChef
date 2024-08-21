import { BrowserRouter, Route, Routes } from 'react-router-dom';
import logo from './logo.svg';
import './App.css';
import Navbar from './components/Navbar';
import Search from './components/Searchbar';
import RecipeCard from './components/RecipeCard';
import Header from './components/Header';
import MyRecipes from './pages/MyRecipes';
import CreateRecipe from './pages/CreateRecipe';
import Profile from './pages/profile'
import AllRecipes from './pages/AllRecipes';
import RecipeDetails from './pages/RecipeDetails';
import HomePage from './pages/Home';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import Login from './pages/Login';
import Signup from './pages/Signup';
import Logout from './pages/Logout';
import EditProfile from './pages/EditProfile';
// import { Navbar } from 'react-bootstrap';

function App() {
  return (
    <>
        <BrowserRouter>
            <Routes>
                    <Route exact path ="/" element = {<HomePage/>}></Route>
                    <Route exact path="allrecipes" element = {<AllRecipes/>}></Route>
                    <Route exact path="profile" element = {<Profile/>}></Route>
                    <Route exact path="profile/edit" element = {<EditProfile/>}></Route>
                    <Route exact path="login" element = {<Login/>}></Route>
                    <Route exact path="signup" element = {<Signup/>}></Route>
                    <Route exact path="myrecipes" element = {<MyRecipes/>}></Route>
                    <Route exact path="create" element = {<CreateRecipe/>}></Route>
                    <Route exact path="logout" element = {<Logout/>}></Route>
                    <Route exact path="recipes/:id" element={<RecipeDetails/>} />
            </Routes>
        </BrowserRouter>
    </>
  );
}

export default App;
