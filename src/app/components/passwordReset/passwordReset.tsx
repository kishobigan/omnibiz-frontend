'use client'
import React from 'react';
import Button from "@/app/widgets/Button/Button";
import './passwordReset.css'
import FormHandler from "@/app/utils/FormHandler/Formhandler";
import Image from 'next/image'
import women from '../../../../public/happy-woman.svg'

const PasswordReset:React.FC = () => {
    const { handleSubmit } = FormHandler(
        () => {
            console.log('Form submitted');
        },
        (values) => {
            return {};
        }
    );

    return (
        <div className='container-fluid vh-100 bg-light d-flex justify-content-center align-items-center'>
            <div className='main-container'>
                    <Image
                        src={women}
                        alt="Happy women"
                        className="image"
                    />
                <div>
                    <p><strong>Your Password has been Reset !</strong>
                        <span>Sign in again with your new password.</span></p>
                </div>
                <form onSubmit={handleSubmit}>
                    <Button  type="submit" variant="dark">
                        Return to Sign In
                    </Button>
                </form>
            </div>
        </div>
    );
};

export default PasswordReset;