import React, {useState} from "react";
import Link from "next/link";
import {FaLock, FaEnvelope, FaEye, FaEyeSlash} from "react-icons/fa";
import "./signIn.css";
import Button from "@/app/widgets/Button/Button";
import FormHandler from "@/app/utils/FormHandler/Formhandler";
import api from "@/app/utils/Api/api";
import Cookies from 'js-cookie';
import {validate, signinSchema} from "@/app/utils/Validation/validations";
import {useRouter} from "next/navigation";
import {ACCESS_TOKEN, REFRESH_TOKEN} from "@/app/utils/Constants/constants";
import Loader from "@/app/widgets/loader/loader";

interface ContentProps {
    title: string;
    buttonText: string;
    linkText: string;
    linkUrl: string;
}

const SignIn: React.FC<ContentProps> = ({
                                            title,
                                            buttonText,
                                            linkText,
                                            linkUrl,
                                        }) => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);
    const access_token = Cookies.get(ACCESS_TOKEN);
    const refresh_token = Cookies.get(REFRESH_TOKEN);

    const {handleChange, handleSubmit, values, errors} = FormHandler(
        async () => {
            setLoading(true);
            setErrorMessage(null);
            if (access_token || refresh_token) {
                Cookies.remove(ACCESS_TOKEN);
                Cookies.remove(REFRESH_TOKEN);
            }
            try {
                const response = await api.post("auth/login", {
                    email: values.email,
                    password: values.password,
                });
                if (response.status === 200) {
                    const {access, refresh, owner_created, user_id, user_role, message} =
                        response.data;
                    Cookies.set(ACCESS_TOKEN, access);
                    Cookies.set(REFRESH_TOKEN, refresh);

                    if (owner_created && user_role === "owner") {
                        router.push(`/pages/dashboard/home/${user_id}`);
                    } else if (user_role === 'admin') {
                        router.push(`/pages/admin/dashboard/${user_id}`);
                    } else if (user_role === 'staff') {
                        if (message === "Welcome, first-time user!") {
                            router.push(`/pages/staff/change-password/${user_id}`);
                        } else if (message === "Welcome back!") {
                            const business_id = '72y3r1p5';
                            router.push(`/pages/staff/business/${user_id}/${business_id}`);
                        }
                    } else if (!owner_created && user_role === 'owner') {
                        router.push('/pages/createOwner');
                    } else if (user_role === 'higher-staff') {
                        router.push(`/pages/higher-staff/${user_id}`);
                    }
                } else {
                    console.log("Login failed!", response.data.message);
                    setLoading(false);
                    setErrorMessage("Wrong email or password");
                }
            } catch (error: any) {
                console.error("Error in login request:");
                setLoading(false);
                if (
                    error.response &&
                    error.response.data &&
                    error.response.data.message
                ) {
                    setErrorMessage("Wrong email or password");
                } else {
                    setErrorMessage("Oops! Something went wrong, try again later.");
                }
            }
        },
        validate,
        signinSchema
    );

    const togglePasswordVisibility = () => {
        setShowPassword((prevShowPassword) => !prevShowPassword);
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="container signInContent">
                <h3 style={{marginBottom: "2rem"}}>
                    <b>{title}</b>
                </h3>
                <p className="mb-3">
                    If you don’t have an account,{" "}
                    <Link href="/pages/signup">
                        <span
                            style={{color: "blue", cursor: "pointer", textDecoration: "none"}}
                        >
                            Register Here!
                        </span>
                    </Link>
                </p>
                <div className="mb-3">
                    <label className="form-label">Email</label>
                    <div className="input-group">
                        <span className="input-group-text">
                            <FaEnvelope/>
                        </span>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Enter your email"
                            value={values.email || ""}
                            onChange={handleChange}
                            name="email"
                        />
                    </div>
                    {errors.email && <p className="error">{errors.email}</p>}
                </div>
                <div className="mb-3">
                    <label className="form-label">Password</label>
                    <div className="input-group">
                        <span className="input-group-text">
                            <FaLock/>
                        </span>
                        <input
                            type={showPassword ? "text" : "password"}
                            className="form-control"
                            placeholder="Enter your password"
                            value={values.password || ""}
                            onChange={handleChange}
                            name="password"
                        />
                        <span
                            className="input-group-text"
                            onClick={togglePasswordVisibility}
                            style={{cursor: "pointer"}}
                        >
                            {showPassword ? <FaEyeSlash/> : <FaEye/>}
                        </span>
                    </div>
                    {errors.password && <p className="error">{errors.password}</p>}
                </div>
                {errorMessage && <p className="error">{errorMessage}</p>}
                <p className="forgot-password-link">
                    <a href="/pages/forgotPassword" style={{color: "#737373"}}>
                        Forgot Password?
                    </a>
                </p>
                <Button className="container-fluid mt-4" type="submit" variant="dark">
                    {loading ? <Loader/> : "Sign In"}
                </Button>
            </div>
        </form>
    );
};

export default SignIn;
