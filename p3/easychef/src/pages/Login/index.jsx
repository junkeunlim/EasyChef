import React, {useState, useContext} from "react";
import Navbar from "../../components/Navbar";
import Header from "../../components/Header";
import AuthContext from "../../contexts/AuthContext";
import axios from "axios"
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const { isAuthenticated, setIsAuthenticated } = useContext(AuthContext);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const {setBearerToken, setRefreshToken} = useContext(AuthContext);
    const {bearerToken, refreshToken} = useContext(AuthContext)
    const navigate = useNavigate();

    const usernameChange = e => {
        setUsername(e.target.value)
    }

    const passwordChange = e => {
        setPassword(e.target.value)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const response = await axios.post("http://127.0.0.1:8000/accounts/login/", {
                username, password
            })
            console.log(response.data)
            setBearerToken(response.data.tokens.access)
            setRefreshToken(response.data.tokens.refresh)
            setIsAuthenticated(true)
            navigate("/")
        }
        catch (error){
           console.log(error.response)
       }
    };


    return ( 
        <>
        <form onSubmit={handleSubmit}>
            <Navbar/>
            <Header/>
            <label htmlFor="username"> Username </label>
            <div>
                <input id="username" type="text" name="username" onChange={usernameChange}></input>
            </div>
            <label htmlFor="password"> Password </label>
            <div>
                <input type="password" id="password" name="password" onChange={passwordChange}></input>
            </div>
            <button > submit </button>
        </form>
        </>
    );
}

export default Login;