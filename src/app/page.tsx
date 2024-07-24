'use client';
import React from 'react';
import Link from "next/link";
import '@/app/landing.css';
import Button from "@/app/widgets/Button/Button";
import Image from 'next/image';
import logo from 'public/logo-no-background.svg';
import landingImg from 'public/landing.svg';
import {useRouter} from 'next/navigation';

const Landing = () => {
    const router = useRouter();
    const handleSignUpClick = () => {
        router.push("/pages/signup");
    };
    const handleSignInClick = () => {
        router.push("/pages/signin");
    };
    return (
        <div className="container-fluid vh-100">
            <div className='row _nav'>
                <div className='_logo col-md-6 d-flex align-items-center'>
                    <div className="logo-container d-flex align-items-center ms-4">
                        <Image src={logo} alt="logo" className='logo-img'/>
                    </div>
                    <div className="d-flex align-items-start _link ml-3">
                        <Link href="/">Pricing</Link>
                        <span className="link-gap"></span>
                        <Link href="/">Aid</Link>
                    </div>
                </div>
                <div className='_button col-md-6 d-flex align-items-center justify-content-lg-end pe-5'>
                    <Button onClick={handleSignUpClick} variant="light">Sign Up</Button>
                    <span className="link-gap"></span>
                    <Button onClick={handleSignInClick} variant="dark" className="ml-2">Sign In</Button>
                </div>
            </div>
            <div className='row _body'>
                <div className='_text col-md-6 d-flex align-items-center'>
                    <div className="right-part">
                        <h1>Business <span>Management</span></h1>
                        <p>Empowering Owners Streamlining Business :)</p>
                    </div>
                </div>
                <div className='_image col-md-6 d-flex align-items-center'>
                    <div className="left-part">
                        <Image src={landingImg} alt="Landing Image"/>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Landing;
