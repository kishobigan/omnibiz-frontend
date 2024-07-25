import React, {useEffect, useState} from "react";
import Cookies from "js-cookie";
import {ACCESS_TOKEN} from "@/app/utils/Constants/constants";
import FormHandler from "@/app/utils/FormHandler/Formhandler";
import {createAdminSchema, validate} from "@/app/utils/Validation/validations";
import api from "@/app/utils/Api/api";
import {Modal} from "react-bootstrap";
import Input from "@/app/widgets/input/Input";
import Button from "@/app/widgets/Button/Button";
import Loader from "@/app/widgets/loader/loader";

interface CreateAdminProps {
    show: boolean;
    onHide: () => void;
}

const CreateAdminForm: React.FC<CreateAdminProps> = ({
                                                         show, onHide
                                                     }) => {
    const [loading, setLoading] = useState<boolean>(false)
    const [isSubmit, setIsSubmit] = useState<boolean>(false)
    const [errorMessage, setErrorMessage] = useState<string | null>(null)
    const token = Cookies.get(ACCESS_TOKEN)

    const initValues = {
        email: "",
    }

    const {handleChange, handleSubmit, values, setValue, errors, initForm} = FormHandler(() => setIsSubmit(true),
        validate, createAdminSchema, initValues);

    useEffect(() => {
        const submitData = async () => {
            if (!isSubmit) return;
            setLoading(true)
            try {
                const requestData = {
                    email: values.email,
                    role: 'admin',
                }
                const response = await api.post("auth/create-admin", requestData, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                if (response.status === 201) {
                    console.log("Admin created successfully", response.data)
                    onHide()
                } else {
                    setErrorMessage("Oops! something went wrong.")
                    console.log("Error in creating admin", response.data.message)
                }
            } catch (error) {
                console.log("Error in creating admin", error)
                setErrorMessage("Oops! Something went wrong, try again later.")
            } finally {
                setLoading(false)
                setIsSubmit(false)
                initForm(initValues)
            }
        }
        submitData()
    }, [isSubmit]);

    const handleFormSubmit = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        event.preventDefault();
        handleSubmit({
            preventDefault: () => {
            }
        } as React.FormEvent<HTMLFormElement>);
    };

    const errorStyle = {
        color: "red",
        fontSize: "13px",
        marginTop: "5px",
        marginBottom: "10px",
    };

    return (
        <Modal
            show={show}
            onHide={() => {
                onHide();
                setErrorMessage(null);
            }}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            backdrop
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    <div>Create Admin</div>
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <form onSubmit={handleSubmit} className="row g-3 ms-5 me-5">
                    <div className="col-md-6">
                        <div className="form-group">
                            <Input
                                label="Email"
                                placeholder="Enter email address"
                                type={"text"}
                                name="email"
                                value={values.email}
                                onChange={handleChange}
                            />
                            {errors.email && <span style={errorStyle}>{errors.email}</span>}
                        </div>
                    </div>
                    {errorMessage && <p style={errorStyle}>{errorMessage}</p>}
                </form>
            </Modal.Body>
            <Modal.Footer>
                <Button
                    variant="light"
                    onClick={() => {
                        initForm(initValues);
                        onHide();
                        setErrorMessage(null)
                    }}
                >
                    Cancel
                </Button>
                <Button
                    variant="dark"
                    onClick={handleFormSubmit}
                >
                    {loading ? <Loader/> : "Create"}
                </Button>
            </Modal.Footer>
        </Modal>
    )
}

export default CreateAdminForm;