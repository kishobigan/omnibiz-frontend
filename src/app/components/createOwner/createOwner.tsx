import React, {useState} from "react";
import Input from "@/app/widgets/input/Input";
import {FaUser, FaPhone, FaEnvelope} from "react-icons/fa";
import "./createOwner.css";
import Button from "@/app/widgets/Button/Button";
import FormHandler from "@/app/utils/FormHandler/Formhandler";
import {validate, createOwnerSchema} from "@/app/utils/Validation/validations";
import api from "@/app/utils/Api/api";
import Cookies from "js-cookie";
import {useRouter} from "next/navigation";
import {ACCESS_TOKEN} from "@/app/utils/Constants/constants";
import Loader from "@/app/widgets/loader/loader";

interface ContentProps {
    title?: string;
    linkUrl?: string;
}

const CreateOwner: React.FC<ContentProps> = ({
                                                 title, linkUrl
                                             }) => {
    const router = useRouter()
    const [loading, setLoading] = useState<boolean>(false)
    const validateForm = (values: { [key: string]: any }) => {
        return validate(values, createOwnerSchema);
    };

    const {handleChange, handleSubmit, values, errors} = FormHandler(
        async () => {
            setLoading(true)
            try {
                const token = Cookies.get(ACCESS_TOKEN);
                const response = await api.post("owner/createOwner", {
                    first_name: values.firstname,
                    last_name: values.lastname,
                    email: values.email,
                    phone_number: values.phone,
                }, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                })
                if (response.status === 201) {
                    router.push('/pages/signin')
                } else {
                    console.error(response.data.message)
                    setLoading(false)
                }
            } catch (error) {
                console.error("Error in owner create request", error)
                setLoading(false)
            }
        }, validateForm, createOwnerSchema);

    return (
        <form onSubmit={handleSubmit}>
            <div className="container">
                <h3 style={{marginBottom: "2rem"}}>
                    <b>{title}</b>
                </h3>
                <Input
                    label="Firstname"
                    placeholder="Enter your firstname"
                    icon={<FaUser/>}
                    value={values.firstname || ""}
                    onChange={handleChange}
                    name="firstname"
                    type="text"
                />
                {errors.firstname && <p className="error">{errors.firstname}</p>}
                <Input
                    label="Lastname"
                    placeholder="Enter your lastname"
                    icon={<FaUser/>}
                    value={values.lastname || ""}
                    onChange={handleChange}
                    name="lastname"
                    type="text"
                />
                {errors.lastname && <p className="error">{errors.lastname}</p>}
                <Input
                    label="Phone number"
                    placeholder="Enter your phone number"
                    icon={<FaPhone/>}
                    value={values.phone || ""}
                    onChange={handleChange}
                    name="phone"
                    type="text"
                />
                {errors.phone && <p className="error">{errors.phone}</p>}
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
                <Button type="submit" variant="dark">
                    {loading ? <Loader/> : "Create Owner"}
                </Button>
            </div>
        </form>
    );
};

export default CreateOwner;