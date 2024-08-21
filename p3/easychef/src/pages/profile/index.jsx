import React, {useEffect, useContext, useState} from "react";
import '../../css/styles.css'
import Header from "../../components/Header";
import Navbar from "../../components/Navbar"
import AuthContext from "../../contexts/AuthContext";
import empty from "../../assets/blank profile photo.webp"
import axios from "axios";
import { Link } from "react-router-dom";

const Profile = () => {
    const {bearerToken, refreshToken} = useContext(AuthContext)
    const [userData, setuserData] = useState("")

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get("http://127.0.0.1:8000/accounts/profile/view/", {
                    headers: { Authorization: `Bearer ${bearerToken}` }
                });
                setuserData(response.data)
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
    {/* Section*/}
    <div className="container rounded bg-white mt-5 mb-5">
        <div className="row">
            <div className="col-md-5 border-right">
                <div className="d-flex flex-column align-items-center text-center p-3 py-4">
                    <img className="rounded-circle mt-5" width="150px" src={empty}></img>
                    <span className="font-weight-bold">{userData.username}</span>
                    
                </div>
                <div className="row  d-flex flex-column align-items-center text-center">
                    <div className="col-md-5">
                        <Link to="/profile/edit" className="btn btn-primary profile-button">Edit Profile</Link>
                    </div>
                </div>
            </div>
            <div className="col-md-5 border-right">
                <div className="p-3 py-5">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h4 className="text-right">Profile</h4>
                    </div>
                    <div className="row mt-2">
                        <div className="col-md-6"><label className="labels">Username</label><input readOnly type="text" className="form-control" placeholder={userData.username} value=""></input></div>
                    </div>
                    <div className="row mt-2">
                        <div className="col-md-6"><label className="labels">Name</label><input readOnly type="text" className="form-control" placeholder={userData.first_name} value=""></input></div>
                        <div className="col-md-6"><label className="labels">Last Name</label><input readOnly type="text" className="form-control" value="" placeholder={userData.last_name}></input></div>
                    </div>
                    <div className="row mt-2">
                        <div className="col-md-12"><label className="labels">Phone Number</label><input readOnly type="text" className="form-control" placeholder={userData.phone_number} value=""></input></div>
                        <div className="col-md-12"><label className="labels">Email</label><input readOnly type="text" className="form-control" placeholder={userData.email} value=""></input></div>
                    </div>
                    
                    
                </div>
            </div>
            
        </div>
    </div>
    </>
    );
}
export default Profile;