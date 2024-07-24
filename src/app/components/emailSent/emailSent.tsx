'use client'
import React from 'react';
import './emailSent.css';
import Button from "@/app/widgets/Button/Button";
import FormHandler from "@/app/utils/FormHandler/Formhandler";

const EmailSent = () => {
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
            <div className='sub-container'>
                <div className='heading'>
                    <h6><strong>Email Sent</strong></h6>
                </div>
                <div className='para'>
                    <p>A link to reset your password has been sent to you <strong>dukesharu@gmail.com</strong></p>
                </div>
                <form onSubmit={handleSubmit}>
                    <Button type="submit" variant="dark">
                        Return to Sign In
                    </Button>
                </form>

            </div>

        </div>
    );
};

export default EmailSent;