import React, {useEffect, useContext, useState} from "react";
import '../../css/styles.css'
import Header from "../../components/Header";
import Navbar from "../../components/Navbar"
import AuthContext from "../../contexts/AuthContext";
import empty from "../../assets/blank profile photo.webp"
import axios from "axios";
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';

const EditProfile = () => {
    const navigate = useNavigate();
    const {bearerToken, refreshToken} = useContext(AuthContext)
    const [data, setData] = useState({
        username: '',
        first_name: '',
        last_name: '',
        phone_number: '',
        email: '',
        password: ''
    })

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get("http://127.0.0.1:8000/accounts/profile/view/", {
                    headers: { Authorization: `Bearer ${bearerToken}` }
                });
                console.log(response.data)
                setData(response.data)

                
            } catch (error) {
                console.error(error);
            }
        };
        
        fetchData();
        console.log(data)
    }, []);

    const changeHandler = e => {
        console.log(e.target.name)
        setData({...data, [e.target.name]: e.target.value})
        console.log(data)
    }

    const submitHandler = async e => {
        e.preventDefault()
        console.log("here")
        let dat = JSON.stringify({...data,
            "refresh": refreshToken
          });
          
          let config = {
            method: 'put',
            maxBodyLength: Infinity,
            url: 'http://127.0.0.1:8000/accounts/profile/edit/',
            headers: { 
              'Authorization': `Bearer ${bearerToken}`, 
              'Content-Type': 'application/json'
            },
            data : dat
          };
          
          axios.request(config)
          .then((response) => {
            console.log(JSON.stringify(response.data));
            navigate("/profile")

          })
          .catch((error) => {
            console.log(error);
          });
    }

    return (
        <>
        <Navbar/>
        <Header/>
    {/* Section*/}
    <div className="container rounded bg-white mt-5 mb-5">
        <div className="row">
            <div className="col-md-5 border-right">
                <div className="d-flex flex-column align-items-center text-center p-3 py-4">
                    <img className="rounded-circle mt-5" width="150px" src={empty}></img>
                    <span className="font-weight-bold">{data.username}</span>
                </div>
                
            </div>
            <div className="col-md-5 border-right">
                <div className="p-3 py-5">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h4 className="text-right">Profile</h4>
                    </div>
                    <form onSubmit={submitHandler}>
                    <div className="row mt-2">
                        <div className="col-md-6"><label className="labels">Username</label><input  name="username" type="text" className="form-control" value={data.username} onChange={changeHandler} ></input></div>
                    </div>
                    <div className="row mt-2">
                        <div className="col-md-6"><label className="labels">Name</label><input name="first_name" type="text" className="form-control" value={data.first_name} onChange={changeHandler}></input></div>
                        <div className="col-md-6"><label className="labels">Last Name</label><input name="last_name" type="text" className="form-control" value={data.last_name}  onChange={changeHandler}></input></div>
                    </div>
                    <div className="row mt-2">
                        <div className="col-md-12"><label className="labels">Phone Number</label><input name="phone_number" type="text" className="form-control" value={data.phone_number} onChange={changeHandler}></input></div>
                        <div className="col-md-12"><label className="labels">Email</label><input name="email" type="text" className="form-control" value={data.email} onChange={changeHandler}></input></div>
                    </div>
                    <div className="row mt-2">
                        <div className="col-md-12"><label className="labels">Password</label><input name="password" type="text" className="form-control" onChange={changeHandler}></input></div>
                    </div>
                    <div className="mt-5 text-center"><button className="btn btn-primary profile-button" type="submit">Save Profile</button></div>
                    </form>
                </div>
            </div>
            
        </div>
    </div>
    </>
    );
}
export default EditProfile;