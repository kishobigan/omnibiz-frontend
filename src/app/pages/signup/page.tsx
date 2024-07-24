"use client";
import React from "react";
import Background from "@/app/components/background/background";
import SignUp from "@/app/components/signUp/signUp";

const signup = () => {
    return (
        <div>
            <Background
                backgroundImage="/img/bg-2.svg"
                heading="Sign up to OmniBiz"
            >
                <SignUp
                    title="Sign up"
                    buttonText="Sign up"
                    linkText="Register here"
                    linkUrl="/signup"
                />
            </Background>
        </div>
    );
};

export default signup;
