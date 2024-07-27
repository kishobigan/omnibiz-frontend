import React, {useState} from "react";
import Link from "next/link";
import Input from "@/app/widgets/input/Input";
import {FaLock, FaEnvelope} from "react-icons/fa";
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
    const [errorMessage, setErrorMessage] = useState<string | null>(null)
    const access_token = Cookies.get(ACCESS_TOKEN)
    const refresh_token = Cookies.get(REFRESH_TOKEN)

    const {handleChange, handleSubmit, values, errors} = FormHandler(
        async () => {
            setLoading(true)
            setErrorMessage(null)
            if (access_token || refresh_token) {
                Cookies.remove(ACCESS_TOKEN)
                Cookies.remove(REFRESH_TOKEN)
            }
            try {
                const response = await api.post('auth/login', {
                    email: values.email,
                    password: values.password,
                })
                if (response.status === 200) {
                    const {access, refresh, owner_created, user_id, user_role} = response.data;
                    Cookies.set(ACCESS_TOKEN, access)
                    Cookies.set(REFRESH_TOKEN, refresh)

                    if (owner_created && user_role === 'owner') {
                        router.push(`/pages/dashboard/home/${user_id}`);
                    } else if (user_role === 'admin') {
                        router.push(`/pages/admin/dashboard/${user_id}`);
                    } else if (user_role === 'staff') {
                        router.push(`/pages/staff/${user_id}`);
                    } else if (!owner_created && user_role === 'owner') {
                        router.push('/pages/createOwner');
                    }
                } else {
                    console.log("Login failed!", response.data.message)
                    setLoading(false)
                    setErrorMessage('Wrong email or password')
                }
            } catch (error: any) {
                console.error('Error in login request:');
                setLoading(false)
                if (error.response && error.response.data && error.response.data.message) {
                    setErrorMessage('Wrong email or password');
                } else {
                    setErrorMessage("Oops! Something went wrong, try again later.");
                }
            }
        }, validate, signinSchema);

    return (
        <form onSubmit={handleSubmit}>
            <div className="container signInContent">
                <h3 style={{marginBottom: "2rem"}}>
                    <b>{title}</b>
                </h3>
                <p className="mb-3">
                    If you don’t have an account,{" "}
                    <Link href="/pages/signup">
                        <span style={{color: "blue", cursor: "pointer", textDecoration: "none"}}>Register Here!</span>
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
                {errorMessage && <p className="error">{errorMessage}</p>}
                <p className="forgot-password-link">
                    <a href="/forgot-password" style={{color: "#737373"}}>
                        Forgot Password?
                    </a>
                </p>
                <Button className='container-fluid mt-4' type="submit" variant="dark">
                    {loading ? <Loader/> : "Sign In"}
                </Button>
            </div>
        </form>
    );
};

export default SignIn;
