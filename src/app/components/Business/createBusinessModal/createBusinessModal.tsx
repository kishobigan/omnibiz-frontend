import React, {useEffect, useState} from 'react';
import {Modal} from 'react-bootstrap';
import Input from '@/app/widgets/input/Input';
import FormHandler from '@/app/utils/FormHandler/Formhandler';
import {validate, businessSchema} from '@/app/utils/Validation/validations';
import Loader from '@/app/widgets/loader/loader';
import api from "@/app/utils/Api/api";
import {uploadImageToCloudinary} from "@/app/utils/Cloudinary/cloudinaryUpload";
import Cookies from "js-cookie";
import {ACCESS_TOKEN} from "@/app/utils/Constants/constants";
import Button from "@/app/widgets/Button/Button";

interface CreateBusinessModalProps {
    type: 'Add' | 'Edit' | 'View';
    show: boolean;
    onHide: () => void;
    selectedBusiness?: any;
    update?: () => void;
}

const CreateBusinessModal: React.FC<CreateBusinessModalProps> = ({
                                                                     type,
                                                                     show,
                                                                     onHide,
                                                                     selectedBusiness,
                                                                     update
                                                                 }) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [isSubmit, setIsSubmit] = useState<boolean>(false);
    const [file, setFile] = useState<File | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null)
    const token = Cookies.get(ACCESS_TOKEN);

    const initValues = {
        business_name: '',
        business_address: '',
        phone_number: '',
        logo: '',
        initial: ''
    };

    const {
        handleChange,
        handleSubmit,
        setValue,
        initForm,
        values,
        errors,
    } = FormHandler(() => setIsSubmit(true), validate, businessSchema, initValues);

    useEffect(() => {
        if (type === 'Edit' && selectedBusiness) {
            initForm(selectedBusiness);
        }
    }, [initForm, selectedBusiness, type]);

    useEffect(() => {
        if (!isSubmit) {
            return;
        }
        const submitData = async () => {
            setLoading(true);
            try {
                let logoURL = values.logo;
                if (file) {
                    logoURL = await uploadImageToCloudinary(file);
                }

                const requestData = {
                    ...values,
                    logo: logoURL,
                };

                if (type === 'Add') {
                    const response = await api.post("business/createBusiness", requestData, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        }
                    });
                    if (response.status === 201) {
                        console.log("Business created successfully", response.data);
                        if (update) update();
                        onHide();
                    } else {
                        setErrorMessage("Oops! Something went wrong, try again later.")
                        console.log("Error in creating business", response.data.message);
                    }
                } else if (type === 'Edit') {
                    const response = await api.put(`business/updateBusiness/${selectedBusiness.id}`, requestData, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        }
                    });
                    if (response.status === 200) {
                        console.log("Business updated successfully", response.data);
                        if (update) update();
                        onHide();
                    } else {
                        setErrorMessage("Oops! Something went wrong, try again later.")
                        console.log("Error in updating business", response.data.message)
                    }
                }
            } catch (error) {
                console.error("Error in submitting business data", error);
                setErrorMessage("Oops! Something went wrong, try again later.")
            } finally {
                setLoading(false);
                setIsSubmit(false);
                initForm(initValues);
            }
        };
        submitData();
    }, [isSubmit]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, files} = e.target;
        if (files && files.length > 0) {
            setFile(files[0]);
            setValue((prevValues: any) => {
                const updatedValues = {...prevValues, [name]: files[0]};
                return updatedValues;
            });
        }
    };

    const handleFormSubmit = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        event.preventDefault();
        handleSubmit({
            preventDefault: () => {
            }
        } as React.FormEvent<HTMLFormElement>);
    };

    const errorStyle: React.CSSProperties = {
        color: "red",
        fontSize: "13px",
        marginTop: "5px",
        marginBottom: "10px",
    };

    return (
        <Modal
            show={show}
            onHide={() => {
                if (type !== 'View') initForm(initValues);
                onHide();
                setErrorMessage(null)
            }}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            backdrop
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    {type === "Add" && <div>Create Business</div>}
                    {type === "View" && <div>View Business</div>}
                    {type === "Edit" && <div>Edit Business</div>}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <form className="row g-3 ms-5 me-5" onSubmit={handleSubmit}>
                    <div className="col-md-6">
                        <div className="form-group">
                            <Input
                                label='Business Name'
                                placeholder="Enter Your Business name"
                                type="text"
                                name="business_name"
                                value={values.business_name}
                                onChange={handleChange}
                            />
                            {errors.business_name &&
                                <span className="error" style={errorStyle}>{errors.business_name}</span>}
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="form-group">
                            <Input
                                label='Address'
                                placeholder="Enter Your Address"
                                type="text"
                                name="business_address"
                                value={values.business_address}
                                onChange={handleChange}
                            />
                            {errors.business_address &&
                                <span className="error" style={errorStyle}>{errors.business_address}</span>}
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="form-group">
                            <Input
                                label='Contact Number'
                                placeholder="Enter your Contact number"
                                type="text"
                                name="phone_number"
                                value={values.phone_number}
                                onChange={handleChange}
                            />
                            {errors.phone_number &&
                                <span className="error" style={errorStyle}>{errors.phone_number}</span>}
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="form-group">
                            <Input
                                label='Initial'
                                placeholder="Enter your Initial Amount"
                                type="text"
                                name="initial"
                                value={values.initial}
                                onChange={handleChange}
                            />
                            {errors.initial && <span className="error" style={errorStyle}>{errors.initial}</span>}
                        </div>
                    </div>
                    {type !== 'View' && <div className="col-md-12">
                        <div className="form-group">
                            <label htmlFor="inputGroupFile02" className="form-label">
                                Logo Upload
                            </label>
                            <div className="input-group mb-3">
                                <input
                                    type="file"
                                    className="form-control"
                                    id="inputGroupFile02"
                                    name="logo"
                                    onChange={handleFileChange}
                                />
                            </div>
                            {errors.logo &&
                                <span className="error" style={errorStyle}>{errors.logo}</span>}
                        </div>
                    </div>}
                    {errorMessage && <p className='error'>{errorMessage}</p>}
                </form>
            </Modal.Body>
            <Modal.Footer>
                <Button
                    variant="light"
                    onClick={() => {
                        if (type !== "View") initForm(initValues);
                        onHide();
                        setErrorMessage(null)
                    }}
                >
                    Cancel
                </Button>
                {type !== "View" && (
                    <Button
                        variant="dark"
                        onClick={handleFormSubmit}
                    >
                        {loading ? <Loader/> : type === "Add" ? "Create" : "Update"}
                    </Button>
                )}
            </Modal.Footer>
        </Modal>
    );
};

export default CreateBusinessModal;
