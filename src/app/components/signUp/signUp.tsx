import React, {useState} from "react";
import Input from "@/app/widgets/input/Input";
import {FaLock, FaEnvelope} from "react-icons/fa";
import "./signUp.css";
import Button from "@/app/widgets/Button/Button";
import FormHandler from "@/app/utils/FormHandler/Formhandler";
import api from "@/app/utils/Api/api";
import {validate, signupSchema} from "@/app/utils/Validation/validations";
import {useRouter} from "next/navigation";
import Loader from "@/app/widgets/loader/loader";
import Link from "next/link";

interface ContentProps {
    title: string;
    buttonText: string;
    linkText: string;
    linkUrl: string;
}

const SignUp: React.FC<ContentProps> = ({
                                            title,
                                            buttonText,
                                            linkText,
                                            linkUrl,
                                        }) => {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const router = useRouter();
    const {handleChange, handleSubmit, values, errors} = FormHandler(
        async () => {
            setLoading(true);
            setErrorMessage(null);
            setMessage(null);
            const requestData = {
                email: values.email,
                password: values.password,
                role: "owner",
            };
            try {
                const res = await api.post("auth/create-owner", requestData);
                if (res.status === 201) {
                    setMessage("Sign Up successfully! Check your email to activate your account.");
                    router.push('/pages/signin');
                    console.log("Sign up successfully", res.data);
                }
            } catch (error: any) {
                if (error.response && error.response.status === 400 && error.response.data.error === 'User already exists') {
                    setErrorMessage("User already exists!");
                    console.error("Error details:", error.response.data);
                } else {
                    setErrorMessage("Oops! Something went wrong, try again later.");
                    console.error("Error in signup request", error);
                }
            } finally {
                setLoading(false);
            }
        },
        validate,
        signupSchema
    );

    return (
        <form onSubmit={handleSubmit}>
            <div className="container signInContent">
                <h3>
                    <b>{title}</b>
                </h3>
                <p className="mb-4">
                    If you have an account,{" "}
                    <Link href="/pages/signin">
                        <span style={{color: "blue", cursor: "pointer", textDecoration: "none"}}>Login Here!</span>
                    </Link>
                </p>
                <Input
                    label="Email"
                    placeholder="Enter your email"
                    icon={<FaEnvelope/>}
                    value={values.email || ""}
                    onChange={handleChange}
                    name="email"
                    type="text"
                />
                {errors.email && <p className="error">{errors.email}</p>}
                <Input
                    label="Password"
                    placeholder="Enter your password"
                    icon={<FaLock/>}
                    value={values.password || ""}
                    onChange={handleChange}
                    name="password"
                    type="password"
                />
                {errors.password && <p className="error">{errors.password}</p>}

                <Input
                    label="Confirm Password"
                    placeholder="Re-enter your password"
                    icon={<FaLock/>}
                    value={values.conPassword || ""}
                    onChange={handleChange}
                    name="conPassword"
                    type="password"
                />
                {errors.conPassword && <p className="error">{errors.conPassword}</p>}
                {errorMessage && <p className="error fw-bold">{errorMessage}</p>}
                <Button className='container-fluid mt-3' type="submit" variant="dark">
                    {loading ? <Loader/> : "SignUp"}
                </Button>
                {message && <p className="text-primary fw-bold mt-2">{message}</p>}
            </div>
        </form>
    );
};

export default SignUp;
