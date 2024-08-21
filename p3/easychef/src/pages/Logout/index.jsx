import React, {useState, useContext, useEffect} from "react";
import Navbar from "../../components/Navbar";
import Header from "../../components/Header";
import AuthContext from "../../contexts/AuthContext";
import axios from "axios"
import { useNavigate } from 'react-router-dom';

const Logout = () => {
    const { isAuthenticated, setIsAuthenticated } = useContext(AuthContext);
    const {bearerToken, refreshToken} = useContext(AuthContext)
    const {setBearerToken, setRefreshToken} = useContext(AuthContext);
    const navigate = useNavigate();
    
    useEffect(() => {
    const leave = async () => {
        try {
            console.log("bearer token", bearerToken)
            const response = await axios.post("http://127.0.0.1:8000/accounts/logout/",
                {refresh: refreshToken}, {headers: {Authorization: `Bearer ${bearerToken}` }}
            )

            

            setBearerToken(null);
            setRefreshToken(null);
            localStorage.removeItem("bearerToken");
            localStorage.removeItem("refreshToken");
            setIsAuthenticated(false)
            setTimeout(() => {
                navigate("/");
            }, 1500);
        }
        catch (error){
           console.log(error.response)
       }
    };
    leave();
    }, [navigate, setBearerToken, setRefreshToken]);

    return (
        <h6 set>LOGGED OUT</h6>

    )
}

export default Logout;