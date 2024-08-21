import React, {useState, useContext} from "react";
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Link, Outlet } from 'react-router-dom';
import '../../css/styles.css'
import icon from "../../assets/easychef.ico"
import { Dropdown } from "react-bootstrap";
import AuthContext from "../../contexts/AuthContext";
const Navbar = () =>{
    const { isAuthenticated, setIsAuthenticated } = useContext(AuthContext);

    return (
        <>
            
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <div className="container px-4 px-lg-5">
                <Link className="navbar-brand " to="/"><img src={icon} alt="" width="30" height="25" className="d-inline-block align-text-top"></img>
                Easy Chef</Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation"><span className="navbar-toggler-icon"></span></button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0 ms-lg-4">
                        <li className="nav-item"><Link className="nav-link active" aria-current="page" to="/">Home</Link></li>
                        <li className="nav-item"><Link className="nav-link" to="/allrecipes">All recipes</Link></li>
                        {   isAuthenticated ?
                            <li className="nav-item"><Link className="nav-link" to="/myrecipes">My recipes</Link></li>
                            : <></>
                        }
                        { !isAuthenticated ?         <><li className="nav-link"><Link to="/login" className="no-decoration dropdown-item">Login</Link></li>
                                                    <li className="nav-link"><Link to="/signup" className="no-decoration dropdown-item">Signup</Link></li></>
                                :
                        <li className="nav-item dropdown">
                            <Dropdown>
                                <Dropdown.Toggle variant="light" id="dropdown-basic" className="nav-link dropdown-toggle">
                                    Profile
                                </Dropdown.Toggle>
                                <Dropdown.Menu className="dropdown-menu">
                                    <Link to="/profile" className="no-decoration dropdown-item">My Profile</Link>
                                    <Link to="/profile/edit" className="no-decoration dropdown-item">Edit Profile</Link>
                                    <Link to="" className="no-decoration dropdown-item">My Shopping List</Link>
                                    <Link to="/logout" className="no-decoration dropdown-item">Logout</Link>
                                </Dropdown.Menu>
                            </Dropdown>
                        </li>}
                        <li className="nav-link"><Link to="/login" className="no-decoration dropdown-item">Login</Link></li>
                        <li className="nav-link"><Link to="/signup" className="no-decoration dropdown-item">Signup</Link></li>
                    </ul>
                    {
                        isAuthenticated ?
                        <form className="d-flex">
                            <Link to="/Create"><button className="btn btn-outline-dark" type="button">
                                New Recipe
                                <span className="badge bg-dark text-white ms-1 rounded-pill">+</span>
                            </button>
                            </Link>
                        </form> : <></>
                    }
                </div>
            </div>
        </nav>
        <Outlet></Outlet>
        
        </>
        

    )
}


export default Navbar;