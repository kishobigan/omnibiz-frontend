'use client';
import React, { useEffect, useState } from "react";
import { Modal } from 'react-bootstrap';
import Input from "@/app/widgets/input/Input";
import Dropdown from "@/app/widgets/dropdown/dropdown";
import FormHandler from "@/app/utils/FormHandler/Formhandler";
import { validate, contractSchema } from "@/app/utils/Validation/validations";
import Cookies from "js-cookie";
import { ACCESS_TOKEN } from "@/app/utils/Constants/constants";
import { useParams } from "next/navigation";
import api from "@/app/utils/Api/api";
import Button from "@/app/widgets/Button/Button";
import Loader from "@/app/widgets/loader/loader";

interface CreateContractProps {
    show: boolean;
    onHide: () => void;
    update?: () => void;
}

const CreateContractForm: React.FC<CreateContractProps> = ({ show, onHide, update }) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [isSubmit, setIsSubmit] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [suppliers, setSuppliers] = useState<{ value: string, label: string }[]>([]);
    const token = Cookies.get(ACCESS_TOKEN);
    const { business_id } = useParams();

    const initValues = {
        supplier_id: "",
        contact_period: "",
    };

    const { handleChange, handleSubmit, values, setValue, errors, initForm } = FormHandler(
        () => setIsSubmit(true),
        validate,
        contractSchema,
        initValues
    );

    useEffect(() => {
        const fetchSuppliers = async () => {
            try {
                const response = await api.get(`suppliers/get-supplier/${business_id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (response.status === 200) {
                    console.log("Suppliers fetched:", response.data);
                    const fetchedSuppliers = response.data.map((supplier: any) => ({
                        value: supplier.supplier_id,
                        label: supplier.supplier_name,
                    }));
                    setSuppliers(fetchedSuppliers);
                } else {
                    setErrorMessage("Failed to fetch suppliers.");
                }
            } catch (error) {
                setErrorMessage("Failed to fetch suppliers.");
                console.error("Error fetching suppliers:", error);
            }
        };
        fetchSuppliers();
    }, [business_id, update]);

    useEffect(() => {
        const submitData = async () => {
            if (!isSubmit) return;
            setLoading(true);
            try {
                const requestData = {
                    business_id: business_id,
                    supplier_id: values.supplier,
                    contact_period: values.contractPeriod,
                };
                const response = await api.post("suppliers/create-contract", requestData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (response.status === 201) {
                    console.log("Contract created successfully", response.data);
                    if (update) update();
                    onHide();
                } else {
                    setErrorMessage("Oops! Something went wrong.");
                }
            } catch (error) {
                setErrorMessage("Oops! Something went wrong.");
                console.error("Error creating contract", error);
            } finally {
                setLoading(false);
                setIsSubmit(false);
                initForm(initValues);
            }
        };
        submitData();
    }, [isSubmit, update]);

    const handleFormSubmit = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        event.preventDefault();
        handleSubmit({
            preventDefault: () => {},
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
                initForm(initValues);
                onHide();
                setErrorMessage(null);
            }}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            backdrop="static"
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Create Contract
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <form onSubmit={handleSubmit} className="row g-3 ms-5 me-5">
                    <div className="col-md-6">
                        <div className="form-group">
                            <Dropdown
                                label="Supplier"
                                options={suppliers}
                                value={values.supplier}
                                onChange={handleChange}
                                name="supplier"
                            />
                            {errors.supplier && <span style={errorStyle}>{errors.supplier}</span>}
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="form-group">
                            <Input
                                label="Contract Period"
                                placeholder="Enter contract period"
                                type="text"
                                name="contractPeriod"
                                value={values.contractPeriod}
                                onChange={handleChange}
                            />
                            {errors.contractPeriod && <span style={errorStyle}>{errors.contractPeriod}</span>}
                        </div>
                    </div>
                    {errorMessage && <p className='error'>{errorMessage}</p>}
                </form>
            </Modal.Body>
            <Modal.Footer>
                <Button
                    variant="light"
                    onClick={() => {
                        initForm(initValues);
                        onHide();
                        setErrorMessage(null);
                    }}
                >
                    Cancel
                </Button>
                <Button
                    variant="dark"
                    onClick={handleFormSubmit}
                >
                    {loading ? <Loader /> : "Create Contract"}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default CreateContractForm;
