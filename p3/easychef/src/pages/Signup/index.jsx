import React, { useState, useContext } from "react";
import Navbar from "../../components/Navbar";
import Header from "../../components/Header";
import axios from "axios"
import AuthContext from "../../contexts/AuthContext";
import { useNavigate } from 'react-router-dom';


const Signup = () => {
    const { isAuthenticated, setIsAuthenticated } = useContext(AuthContext);
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        first_name: "",
        last_name: "",
        phone_number: "",
        password: "",
        password2: ""
    })
    const {setBearerToken, setRefreshToken} = useContext(AuthContext);
    const {bearerToken, refreshToken} = useContext(AuthContext)

    const navigate = useNavigate();


    const handleChange = e => {
        const {name, value} = e.target;
        setFormData({...formData, [name]: value});
    };

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            console.log(formData)
            const response = await axios.post("http://127.0.0.1:8000/accounts/signup/", {
                ...formData
            })
            console.log("response", response)
            setBearerToken(response.data.access)
            setRefreshToken(response.data.refresh)
            setIsAuthenticated(true)
            navigate("/")

        }
        catch (error){
           console.log(error.response)
       }
    };

    return (
        <>
        <Navbar/>
        <Header/>
        <form onSubmit={handleSubmit}>
        <div class="title" > Signup </div>
        <label htmlFor="username"> Username </label>
        <div>
            <input id="username" type="text" name="username" onChange={handleChange}></input>
        </div>
        <label htmlFor="email"> Email </label>
        <div>
            <input id="email" type="text" name="email" onChange={handleChange}></input>
        </div>
        <label htmlFor=""> First Name </label>
        <div>
            <input id="first name" type="text" name="first_name" onChange={handleChange}></input>
        </div>
        <label htmlFor=""> Last Name </label>
        <div>
            <input id="last name" type="text" name="last_name" onChange={handleChange}></input>
        </div>
        <label htmlFor=""> Phone Number </label>
        <div>
            <input id="phone number" type="text" name="phone_number" onChange={handleChange}></input>
        </div>
        <label htmlFor="password"> Password </label>
        <div>
            <input type="password" id="password" name="password" onChange={handleChange}></input>
        </div>
        <label htmlFor="password"> Repeat password </label>
        <div>
            <input type="password" id="password2" name="password2" onChange={handleChange}></input>
        </div>
        <button > submit </button>
    </form>
        </>
    );
}

export default Signup;