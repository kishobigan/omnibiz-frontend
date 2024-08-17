"use client";
import React, {useState} from "react";
import Link from "next/link";
import Input from "@/app/widgets/input/Input";
import Button from "@/app/widgets/Button/Button";
import "./forgotPassword.css";
import {FaEnvelope} from "react-icons/fa";
import FormHandler from "@/app/utils/FormHandler/Formhandler";
import Image from "next/image";
import img from "public/img/Forgot password.svg";
import emailImage from "public/img/Mail-amico.svg";
import api from "@/app/utils/Api/api";
import {forgotPasswordSchema, validate} from "@/app/utils/Validation/validations";
import Loader from "@/app/widgets/loader/loader";

const ForgotPassword: React.FC = () => {
    const [showNotification, setShowNotification] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const validateForm = (values: { [key: string]: any }) => {
        return validate(values, forgotPasswordSchema);
    };

    const {handleChange, handleSubmit, values, errors} = FormHandler(
        async () => {
            setLoading(true);
            try {
                const response = await api.post("/auth/reset-account-request", {email: values.email});
                if (response.status === 200) {
                    setShowNotification(true);
                } else {
                    setErrorMessage("Oops! Something went wrong.");
                }
            } catch (error) {
                setErrorMessage("Oops! Something went wrong.");
                console.error("Error resetting password", error);
            } finally {
                setLoading(false);
            }
        },
        validateForm,
        {email: ""}
    );

    const handleResetClick = () => {
        handleSubmit({
            preventDefault: () => {
            },
        } as React.FormEvent<HTMLFormElement>);
    };

    const errorStyle = {
        color: "red",
        fontSize: "13px",
        marginTop: "5px",
        marginBottom: "10px",
    };

    return (
        <div className="container-fluid d-flex justify-content-center align-items-center">
            {!showNotification ? (
                <div className="main-container rounded shadow">
                    <div className="forgot-password-container sub-container">
                        <Image
                            src={img}
                            alt="Forgot Password"
                            width={200}
                            height={200}
                            className="forgot-password-image"
                        />
                        <h5>Forgot your password?</h5>
                        <p>
                            {/* eslint-disable-next-line react/no-unescaped-entities */}
                            Enter your e-mail address and we'll send you <br/> a link to reset your password
                        </p>
                        {errorMessage && <div style={errorStyle}>{errorMessage}</div>}
                        <form onSubmit={handleSubmit}>
                            <div>
                                <div className="form-group">
                                    <label className="label" htmlFor="email">
                                        Email
                                    </label>
                                    <Input
                                        label=""
                                        placeholder="Enter Your Email Address"
                                        icon={<FaEnvelope/>}
                                        type="text"
                                        name="email"
                                        value={values.email}
                                        onChange={handleChange}
                                    />
                                    {errors.email && <span style={errorStyle}>{errors.email}</span>}
                                </div>
                                <div className="row mt-4">
                                    <div className="col-6">
                                        <Link href="/pages/signin">
                                            <Button className="cancel-button" variant="light">
                                                Cancel
                                            </Button>
                                        </Link>
                                    </div>
                                    <div className="col-6">
                                        <Button
                                            className="reset-button"
                                            onClick={handleResetClick}
                                            variant="dark"
                                        >
                                            {loading ? <Loader/> : "Reset"}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            ) : (
                <div className="main-container shaded-border">
                    <div className="forgot-password-container sub-container">
                        <Image
                            src={emailImage}
                            alt="Email Sent"
                            width={200}
                            height={200}
                            className="forgot-password-image"
                        />
                        <h5>Check in your mail!</h5>
                        <p className="underline mt-2 mb-2">
                            We just emailed you with the instructions <br/> to reset your password.
                        </p>
                        <p className="mt-4">
                            For any questions or problems, please email us at <a
                            href="mailto:helpdesk@omnibiz.com">helpdesk@omnibiz.com</a>
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ForgotPassword;
