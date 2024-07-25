"use client";
import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import Input from "@/app/widgets/input/Input";
import Dropdown from "@/app/widgets/dropdown/dropdown";
import FormHandler from "@/app/utils/FormHandler/Formhandler";
import { validate, createOrderSchema } from "@/app/utils/Validation/validations";
import Cookies from "js-cookie";
import { ACCESS_TOKEN } from "@/app/utils/Constants/constants";
import { useParams } from "next/navigation";
import api from "@/app/utils/Api/api";
import Button from "@/app/widgets/Button/Button";
import Loader from "@/app/widgets/loader/loader";

interface CreateOrderProps {
    type: 'Add' | 'Edit' | 'View';
    show: boolean;
    onHide: () => void;
    selectedOrder?: any;
    update?: () => void;
}

const CreateOrderForm: React.FC<CreateOrderProps> = ({
    type, show, onHide, selectedOrder, update
}) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [isSubmit, setIsSubmit] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [suppliers, setSuppliers] = useState<{ value: string, label: string }[]>([]);
    const token = Cookies.get(ACCESS_TOKEN);
    const { business_id } = useParams();

    const initValues = {
        delivery_date: "",
        amount_ordered: "",
        amount_paid: "",
        amount_due_date: "",
        supplier: "",
    };

    const { handleChange, handleSubmit, values, setValue, errors, initForm } = FormHandler(() => setIsSubmit(true),
        validate, createOrderSchema, initValues);

    useEffect(() => {
        if (type === 'Edit' && selectedOrder) {
            initForm(selectedOrder);
        }
    }, [initForm, selectedOrder, type]);

    useEffect(() => {
        const fetchSuppliers = async () => {
            try {
                const response = await api.get(`inventory/list-supplier/${business_id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setSuppliers(
                    response.data.map((supplier: any) => ({
                        value: supplier.id,
                        label: supplier.supplier_name,
                    }))
                );
            } catch (error) {
                console.error("Error fetching suppliers:", error);
            }
        };

        fetchSuppliers();
    }, [business_id, token]);

    useEffect(() => {
        const submitData = async () => {
            if (!isSubmit) return;
            setLoading(true);
            try {
                const requestData = {
                    business_id: business_id,
                    delivery_date: values.delivery_date,
                    amount_ordered: values.amount_ordered,
                    amount_paid: values.amount_paid,
                    amount_due_date: values.amount_due_date,
                    supplier: values.supplier,
                };
                if (type === 'Add') {
                    const response = await api.post("orders/create-order", requestData, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    if (response.status === 201) {
                        console.log("Order created successfully", response.data);
                        onHide();
                        if (update) update();
                    } else {
                        setErrorMessage("Oops! something went wrong.");
                        console.log("Error in creating order", response.data.message);
                    }
                } else if (type === 'Edit') {
                    const response = await api.put(`orders/update-order/${selectedOrder.id}`, requestData, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    if (response.status === 200) {
                        console.log("Order updated successfully", response.data);
                        if (update) update();
                        onHide();
                    } else {
                        console.log("Error in updating order");
                        setErrorMessage("Oops! something went wrong.");
                    }
                }
            } catch (error) {
                console.log("Error in submitting order data", error);
                setErrorMessage("Oops! Something went wrong, try again later.");
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
                if (type !== 'View') initForm(initValues);
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
                    {type === "Add" && <div>Create Order</div>}
                    {type === "View" && <div>View Order</div>}
                    {type === "Edit" && <div>Edit Order</div>}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <form onSubmit={handleSubmit} className="row g-3 ms-5 me-5">
                    <div className="col-md-6">
                        <div className="form-group">
                            <Input
                                label="Delivery Date"
                                placeholder="Enter delivery date (YYYY-MM-DD)"
                                type="date"
                                name="delivery_date"
                                value={values.delivery_date}
                                onChange={handleChange}
                            />
                            {errors.delivery_date && <span style={errorStyle}>{errors.delivery_date}</span>}
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="form-group">
                            <Input
                                label="Amount Ordered"
                                placeholder="Enter amount ordered"
                                type="number"
                                // step="0.01"
                                name="amount_ordered"
                                value={values.amount_ordered}
                                onChange={handleChange}
                            />
                            {errors.amount_ordered && <span style={errorStyle}>{errors.amount_ordered}</span>}
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="form-group">
                            <Input
                                label="Amount Paid"
                                placeholder="Enter amount paid"
                                type="number"
                                // step="0.01"
                                name="amount_paid"
                                value={values.amount_paid}
                                onChange={handleChange}
                            />
                            {errors.amount_paid && <span style={errorStyle}>{errors.amount_paid}</span>}
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="form-group">
                            <Input
                                label="Amount Due Date"
                                placeholder="Enter amount due date (YYYY-MM-DD)"
                                type="date"
                                name="amount_due_date"
                                value={values.amount_due_date}
                                onChange={handleChange}
                            />
                            {errors.amount_due_date && <span style={errorStyle}>{errors.amount_due_date}</span>}
                        </div>
                    </div>
                    <div className="col-md-12">
                        <div className="form-group">
                            <Dropdown
                                label="Supplier"
                                name="supplier"
                                value={values.supplier}
                                options={suppliers}
                                onChange={handleChange}
                                
                            />
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
                        setErrorMessage(null);
                    }}
                >
                    Cancel
                </Button>
                {type !== "View" && (
                    <Button
                        variant="dark"
                        onClick={handleFormSubmit}
                    >
                        {loading ? <Loader /> : type === "Add" ? "Create" : "Update"}
                    </Button>
                )}
            </Modal.Footer>
        </Modal>
    );
}

export default CreateOrderForm;
