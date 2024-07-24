"use client";

import React, { ReactNode } from "react";
import "./background.css";
import Image from "next/image";
import logo from "../../../../public/logo-no-background.png";

interface BackgroundProps {
  backgroundImage: string;
  heading: string; 
  children: ReactNode;
  className?: string;
}

const Background: React.FC<BackgroundProps> = ({
  backgroundImage,
  heading,
  children,
}) => {
  return (
    <div className="container-fluid position-fixed h-100 ">
      <div className="row h-100">
        <div className="col-md-6 bg-white flex-column">
          <Image src={logo} alt="OmniBiz logo" width={150} height={50} className="mt-2 mb-5"/>
          <div className="flex-column justify-content-center align-items-center mt-5">
          {children}
          </div>
        </div>
        <div className="col-md-6 bg-dark text-white d-flex flex-column justify-content-center">          
          <Image src={backgroundImage} alt="Background" className="bg-image container" width={450} height={450}/>        
          <div className="container mb-4">
            <h3 className="mb-3">
              <b className="justify-contents-center">{heading}</b>
            </h3>
            <p className="ash-color">Empowering Owners Streamlining Business</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Background;
