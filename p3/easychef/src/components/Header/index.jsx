import React, {useState} from "react";
import head from '../../assets/HeaderExample1.png'


const header = () =>{

    return (
      <>
        <header className="bg-dark py-5" style={{backgroundImage: `url(${head})`, backgroundSize: "cover", backgroundPosition: "center"}}>
            <div className="container px-4 px-lg-5 my-5">
                <div className="text-center">
                    <h1 className="display-4 ">Easy Chef</h1>
                    <p className="lead fw-normal mb-0">Millions of different recipes in the palm of your hand</p>
                </div>
            </div>
        </header>
      </>  
        

    );
}


export default header;