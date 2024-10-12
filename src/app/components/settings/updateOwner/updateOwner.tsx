"use client";
import React, {useState, useEffect} from "react";
import Input from "@/app/widgets/input/Input";
import {FaUser, FaPhone} from "react-icons/fa";
import Button from "@/app/widgets/Button/Button";
import FormHandler from "@/app/utils/FormHandler/Formhandler";
import {validate, createOwnerSchema} from "@/app/utils/Validation/validations";
import api from "@/app/utils/Api/api";
import Cookies from "js-cookie";
import {useParams} from "next/navigation";
import {ACCESS_TOKEN} from "@/app/utils/Constants/constants";
import Loader from "@/app/widgets/loader/loader";

const UpdateOwner: React.FC = () => {
    const {user_id} = useParams();
    const [loading, setLoading] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState('')
    const [successMessage, setSuccessMessage] = useState('')
    const [isVisible, setIsVisible] = useState(true);

    const {
        handleChange,
        handleSubmit,
        values,
        errors,
        setValue,
    } = FormHandler(() => {
    }, validate, createOwnerSchema);

    const handleUpdateOwner = async () => {
        setLoading(true);
        try {
            console.log("update owner button clicked")
            const token = Cookies.get(ACCESS_TOKEN);
            const response = await api.put(
                `owner/updateOwner/${user_id}/`,
                {
                    first_name: values.firstname,
                    last_name: values.lastname,
                    phone_number: values.phone,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            if (response.status === 200) {
                setSuccessMessage("Update successfully.");
                setIsVisible(true);
            } else {
                console.error(response.data.message);
                setLoading(false);
            }
        } catch (error: any) {
            console.error("Error in updating owner", error);
            setLoading(false);
            setErrorMessage("Oops! Something went wrong")
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const fetchOwnerData = async () => {
            try {
                const token = Cookies.get(ACCESS_TOKEN);
                const response = await api.get(`owner/get-owner/${user_id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                console.log("fetching owner details", response.data);
                setValue({
                    firstname: response.data.first_name || "",
                    lastname: response.data.last_name || "",
                    phone: response.data.phone_number || "",
                });
            } catch (error) {
                console.error("Error fetching owner data", error);
            }
        };

        fetchOwnerData();
    }, [user_id]);

    useEffect(() => {
        if (successMessage) {
            const timer = setTimeout(() => {
                setIsVisible(false);
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [successMessage]);

    const errorStyle = {
        color: "red",
        fontSize: "13px",
        marginTop: "5px",
        marginBottom: "10px",
    };

    const fadeStyles = {
        opacity: isVisible ? 1 : 0,
        transition: "opacity 1s ease-in-out",
        height: isVisible ? "auto" : 0,
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="container-fluid">
                <h3 className="mb-3">
                    <b>Update Owner</b>
                </h3>
                <div className="row">
                    <div className="col-6">
                        <Input
                            label="Firstname"
                            placeholder="Enter your firstname"
                            icon={<FaUser/>}
                            value={values.firstname || ""}
                            onChange={handleChange}
                            name="firstname"
                            type="text"
                        />
                        {errors.firstname && (
                            <span style={errorStyle}>{errors.firstname}</span>
                        )}
                    </div>
                    <div className="col-6">
                        <Input
                            label="Lastname"
                            placeholder="Enter your lastname"
                            icon={<FaUser/>}
                            value={values.lastname || ""}
                            onChange={handleChange}
                            name="lastname"
                            type="text"
                        />
                        {errors.lastname && (
                            <span style={errorStyle}>{errors.lastname}</span>
                        )}
                    </div>
                </div>
                <Input
                    label="Phone number"
                    placeholder="Enter your phone number"
                    icon={<FaPhone/>}
                    value={values.phone || ""}
                    onChange={handleChange}
                    name="phone"
                    type="text"
                />
                {errors.phone && <span style={errorStyle}>{errors.phone}</span>}
                <Button type="submit" variant="dark" onClick={handleUpdateOwner}>
                    {loading ? <Loader/> : "Update Owner"}
                </Button>
                {successMessage && (
                    <p
                        className="text-primary fw-bold"
                        style={fadeStyles}
                    >
                        {successMessage}
                    </p>
                )}
                {errorMessage && <p className='text-danger fw-bold'>{errorMessage}</p>}
            </div>
        </form>
    );
};

export default UpdateOwner;