"use client";
import React, { useState } from "react";
import Link from "next/link";
import Input from "@/app/widgets/input/Input";
import Button from "@/app/widgets/Button/Button";
import "./forgotPassword.css";
import { FaEnvelope } from "react-icons/fa";
import FormHandler from "@/app/utils/FormHandler/Formhandler";
import Image from "next/image";
import img from "public/img/Forgot password.svg";
import emailImage from "public/img/Mail-amico.svg";
import { forgotPasswordSchema, validate } from "@/app/utils/Validation/validations" // Adjust the path as necessary

const ForgotPassword: React.FC = () => {
  const [showNotification, setShowNotification] = useState(false);

  const callback = () => {
    console.log("Form submitted successfully");
    setShowNotification(true);
  };

  const { handleChange, handleSubmit, initForm, values, errors } = FormHandler(
    callback,
    (values) => validate(values, forgotPasswordSchema),
    {}
  );

  const handleResetClick = () => {
    console.log("Reset password clicked");
    handleSubmit({
      preventDefault: () => {},
    } as React.FormEvent<HTMLFormElement>);
  };

  return (
    <div className="container-fluid d-flex justify-content-center align-items-center">
      {!showNotification ? (
        <div className="main-container shaded-border">
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
              Enter your e-mail address and we'll send you <br /> a link to reset
              your password
            </p>
            <form onSubmit={handleSubmit}>
              <div>
                <div className="form-group">
                  <label className="label" htmlFor="email">
                    Email
                  </label>
                  <Input
                    label=""
                    placeholder="Enter Your Email Address"
                    icon={<FaEnvelope />}
                    type="text"
                    name="email"
                    value={values.email}
                    onChange={handleChange}
                  />
                  {errors.email && <span className="error">{errors.email}</span>}
                </div>
                <div className="row">
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
                      Reset
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
              We just emailed you with the instructions <br /> to reset your password.
            </p>
            <p className="mt-4">
              For any questions or problems, please email us at <a href="mailto:helpdesk@omnibiz.com">helpdesk@omnibiz.com</a>
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ForgotPassword;
