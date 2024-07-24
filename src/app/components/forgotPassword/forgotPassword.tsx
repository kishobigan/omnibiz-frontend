'use client'
import React from 'react';
import Input from "@/app/widgets/input/Input";
import Button from "@/app/widgets/Button/Button";
import './forgotPassword.css'
import {FaEnvelope} from "react-icons/fa";
import FormHandler from "@/app/utils/FormHandler/Formhandler";


const ForgotPassword: React.FC = () => {
    const validate = (values: { [key: string]: any }) => {
        let errors: { [key: string]: any } = {};

        if (!values.email) {
            errors.email = 'Email address is required';
        } else if (!/\S+@\S+\.\S+/.test(values.email)) {
            errors.email = 'Email address is invalid';
        }

        return errors;
    };


    const callback = () => {
        console.log('Form submitted successfully');

    };

    const {
        handleChange,
        handleSubmit,
        initForm,
        setValue,
        values,
        errors,
        form,
    } = FormHandler(callback, validate);

    const handleReSetClick = () => {

        console.log('Reset password clicked');
    };

    return (
        <div className='container-fluid bg-light d-flex justify-content-center align-items-center'>
            <div  className='main-container shaded-border' >
                <div>

                    <div className='forgot-password-container bg-dark sub-container'>
                        <h5>~Forgot Password~</h5>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group me-4 ms-4">
                                <label  className='label' htmlFor="email">Email</label>
                                <Input label=''
                                       placeholder="Enter Your Email  Address"
                                       icon={<FaEnvelope/>}
                                       type={"text"}
                                       value={values.email}
                                       onChange={handleChange}/>
                            </div>
                            <Button className='ms-4' onClick={handleReSetClick} variant="light">
                                Reset Password
                            </Button>
                        </form>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default ForgotPassword;