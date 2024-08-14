'use client'
import React, {useEffect, useState} from 'react';
import Input from "@/app/widgets/input/Input";
import './addSupplier.css'
import FormHandler from "@/app/utils/FormHandler/Formhandler";
import {addSupplierSchema, validate} from '@/app/utils/Validation/validations';
import Cookies from "js-cookie";
import {ACCESS_TOKEN} from "@/app/utils/Constants/constants";
import {useParams} from "next/navigation";
import api from "@/app/utils/Api/api";
import {Modal} from "react-bootstrap";
import Button from "@/app/widgets/Button/Button";
import Loader from "@/app/widgets/loader/loader";

interface AddSupplierProps {
    type: 'Add' | 'Edit' | 'View';
    show: boolean;
    onHide: () => void;
    selectedSupplier?: any;
    update?: () => void;
}

const AddSupplier: React.FC<AddSupplierProps> = ({
                                                     type, show, onHide, selectedSupplier, update
                                                 }) => {
    const [loading, setLoading] = useState<boolean>(false)
    const [isSubmit, setIsSubmit] = useState<boolean>(false)
    const [errorMessage, setErrorMessage] = useState<string | null>(null)
    const token = Cookies.get(ACCESS_TOKEN)
    const {business_id} = useParams()

    const initValues = {
        supplierName: "",
        supplierAddress: "",
        phone: "",
        email: "",
        supplierWebsite: ""
    }

    const {
        handleChange, handleSubmit, setValue, initForm, values, errors
    } = FormHandler(() => setIsSubmit(true), validate, addSupplierSchema)

    useEffect(() => {
        if ((type === 'Edit' || type === 'View') && selectedSupplier) {
            const supplierData = {
                supplier_id: selectedSupplier.supplier_id,
                supplierName: selectedSupplier.supplier_name || "",
                supplierAddress: selectedSupplier.supplier_address || "",
                phone: selectedSupplier.supplier_phone || "",
                email: selectedSupplier.supplier_email || "",
                supplierWebsite: selectedSupplier.supplier_website || "",
            };
            initForm(supplierData);
        }
    }, [selectedSupplier, type]);

    useEffect(() => {
        if (!isSubmit) return;
        const submitData = async () => {
            setLoading(true)
            try {
                const requestData = {
                    business_id: business_id,
                    supplier_name: values.supplierName,
                    supplier_address: values.supplierAddress,
                    supplier_phone: values.phone,
                    supplier_email: values.email,
                    supplier_website: values.supplierWebsite
                }
                if (type === 'Add') {
                    const response = await api.post("suppliers/create-supplier", requestData, {
                        headers: {
                                Authorization: `Bearer ${token}`,
                        }
                    })
                    if (response.status === 201) {
                        console.log("Supplier created successfully", response.data)
                        if (update) update();
                        onHide()
                    } else {
                        setErrorMessage("Oops! Something went wrong, try again later.")
                        console.log("Error in creating supplier", response.data.message)
                    }
                } else if (type === 'Edit') {
                    console.log("supplier-id", selectedSupplier.id)
                    const response = await api.put(`suppliers/update-supplier/${selectedSupplier.supplier_id}`, requestData, {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    })
                    if (response.status === 200) {
                        console.log("Supplier updated successfully", response.data)
                        if (update) update();
                        onHide();
                    } else {
                        setErrorMessage("Oops! Something went wrong, try again later.")
                        console.log("Error in updating business", response.data.message)
                    }
                }
            } catch (error) {
                console.error("Error in submitting supplier data", error)
                setErrorMessage("Oops! Something went wrong, try again later.")
            } finally {
                setLoading(false)
                setIsSubmit(false)
                initForm(initValues)
            }
        };
        submitData();
    }, [isSubmit, update]);

    const handleFormSubmit = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        event.preventDefault();
        handleSubmit({
            preventDefault: () => {}
        } as React.FormEvent<HTMLFormElement>);
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
                    {type === "Add" && <div>Create Supplier</div>}
                    {type === "View" && <div>View Supplier</div>}
                    {type === "Edit" && <div>Edit Supplier</div>}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <form onSubmit={handleSubmit} className="row g-3 ms-5 me-5">
                    <div className="col-md-6">
                        <div className="form-group">
                            <Input label='Name'
                                   name='supplierName'
                                   placeholder="Enter Supplier name"
                                   type={"text"}
                                   value={values.supplierName || ""}
                                   onChange={handleChange}
                                   readOnly={type === 'View'}
                            />
                            {errors.supplierName && <span className="error">{errors.supplierName}</span>}
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="form-group">
                            <Input label='Address'
                                   name='supplierAddress'
                                   placeholder="Enter Supplier address"
                                   type={"text"}
                                   value={values.supplierAddress || ""}
                                   onChange={handleChange}
                                   readOnly={type === 'View'}
                            />
                            {errors.supplierAddress && <span className="error">{errors.supplierAddress}</span>}
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="form-group">
                            <Input label='Contact number'
                                   name='phone'
                                   placeholder="Enter Contact Number"
                                   type={"text"}
                                   value={values.phone || ""}
                                   onChange={handleChange}
                                   readOnly={type === 'View'}
                            />
                            {errors.phone && <span className="error">{errors.phone}</span>}
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="form-group">
                            <Input label='Email'
                                   name='email'
                                   placeholder="Enter Email Address"
                                   type={"email"}
                                   value={values.email || ""}
                                   onChange={handleChange}
                                   readOnly={type === 'View'}
                            />
                            {errors.email && <span className="error">{errors.email}</span>}
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="form-group">
                            <Input label='Supplier website'
                                   name='supplierWebsite'
                                   placeholder="Enter website url"
                                   type={"text"}
                                   value={values.supplierWebsite || ""}
                                   onChange={handleChange}
                                   readOnly={type === 'View'}
                            />
                            {errors.supplierWebsite && <span className="error">{errors.supplierWebsite}</span>}
                        </div>
                    </div>
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

export default AddSupplier;
