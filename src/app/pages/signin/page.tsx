"use client";
import React from "react";
import Background from "@/app/components/background/background";
import SignIn from "@/app/components/signIn/signIn";

const signin = () => {
    return (
        <div>
            <Background backgroundImage="/img/bg-1.svg" heading="Sign in to OmniBiz">
                <SignIn
                    title="Sign in"
                    buttonText="Sign in"
                    linkText="Login here"
                    linkUrl="/signin"
                />
            </Background>
        </div>
    );
};

export default signin;
