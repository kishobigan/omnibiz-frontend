import React, {useEffect, useState} from "react";
import {Modal} from 'react-bootstrap';
import Input from "@/app/widgets/input/Input";
import Dropdown from "@/app/widgets/dropdown/dropdown";
import FormHandler from "@/app/utils/FormHandler/Formhandler";
import {validate, createItemSchema} from "@/app/utils/Validation/validations";
import Loader from "@/app/widgets/loader/loader";
import Cookies from "js-cookie";
import {ACCESS_TOKEN} from "@/app/utils/Constants/constants";
import {useParams} from "next/navigation";
import api from "@/app/utils/Api/api";
import Button from "@/app/widgets/Button/Button";

interface AddItemProps {
    show: boolean;
    onHide: () => void;
    update?: () => void;
}

type FormElements = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

const AddItemForm: React.FC<AddItemProps> = ({show, onHide, update}) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [isSubmit, setIsSubmit] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [categories, setCategories] = useState<{ value: string, label: string }[]>([]);
    const token = Cookies.get(ACCESS_TOKEN);
    const {business_id} = useParams();

    const {handleChange, handleSubmit, values, errors, initForm} = FormHandler(() =>
        setIsSubmit(true), validate, createItemSchema
    );

    const initialInputs = {
        name: "",
        category: "",
        description: "",
        unit_price: "",
        quantity_type: "",
        stock_alert: false,
        restock_level: "",
    };

    useEffect(() => {
        initForm(initialInputs);
    }, []);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await api.get(`inventory/list-category/${business_id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (response.status === 200) {
                    console.log("Categories fetched:", response.data);
                    const fetchedCategories = response.data.map((category: any) => ({
                        value: category.category_id,
                        label: category.name,
                    }));
                    setCategories(fetchedCategories);
                    console.log("Fetched categories", fetchedCategories);
                } else {
                    setErrorMessage("Failed to fetch categories.");
                }
            } catch (error) {
                setErrorMessage("Failed to fetch categories.");
                console.error("Error fetching categories:", error);
            }
        };
        fetchCategories();
    }, [business_id, token, update]);

    useEffect(() => {
        if (!isSubmit) {
            return;
        }
        const submitData = async () => {
            setLoading(true);
            try {
                const requestData = {
                    business_id: business_id,
                    name: values.name,
                    category_id: parseInt(values.category, 10),
                    description: values.description,
                    unit_price: values.unit_price,
                    quantity_type: values.quantity_type,
                    stock_alert: values.stock_alert,
                    restock_level: values.restock_level,
                };
                const response = await api.post("inventory/create-item", requestData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (response.status === 201) {
                    console.log("Item added successfully", response.data);
                    if (update) update();
                    onHide();
                } else {
                    setErrorMessage("Oops! Something went wrong.");
                    console.log("Error in adding item", response.data.message);
                }
            } catch (error) {
                setErrorMessage("Oops! Something went wrong.");
                console.log("Error in adding item", error);
            } finally {
                setLoading(false);
                setIsSubmit(false);
                initForm(initialInputs);
            }
        };
        submitData();
    }, [isSubmit, update]);

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, checked} = e.target;
        handleChange({
            target: {
                name,
                value: checked,
                type: 'checkbox',
            } as unknown as FormElements,
        } as React.ChangeEvent<FormElements>);
    };

    const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const {value} = e.target;
        handleChange({
            target: {
                name: 'category',
                value: value,
            } as unknown as FormElements,
        } as React.ChangeEvent<FormElements>);
    };

    const handleFormSubmit = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        event.preventDefault();
        handleSubmit({
            preventDefault: () => {
            },
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
                initForm(initialInputs);
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
                    <div>Add Item</div>
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <form onSubmit={handleSubmit} className="row g-3 ms-5 me-5">
                    <div className="col-md-6">
                        <div className="form-group">
                            <Input
                                label="Item Name"
                                placeholder="Enter item name"
                                type="text"
                                name="name"
                                value={values.name}
                                onChange={handleChange}
                            />
                            {errors.name && <span style={errorStyle}>{errors.name}</span>}
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="form-group">
                            <Dropdown
                                label="Category"
                                options={categories}
                                value={values.category}
                                onChange={handleCategoryChange}
                                name="category"
                            />
                            {errors.category && <span style={errorStyle}>{errors.category}</span>}
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="form-group">
                            <Input
                                label="Description"
                                placeholder="Enter description"
                                type="text"
                                name="description"
                                value={values.description}
                                onChange={handleChange}
                            />
                            {errors.description && <span style={errorStyle}>{errors.description}</span>}
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="form-group">
                            <Input
                                label="Unit Price"
                                placeholder="Enter unit price"
                                type="text"
                                name="unit_price"
                                value={values.unit_price}
                                onChange={handleChange}
                            />
                            {errors.unit_price && <span style={errorStyle}>{errors.unit_price}</span>}
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="form-group">
                            <Input
                                label="Quantity Type"
                                placeholder="Enter quantity type"
                                type="text"
                                name="quantity_type"
                                value={values.quantity_type}
                                onChange={handleChange}
                            />
                            {errors.quantity_type && <span style={errorStyle}>{errors.quantity_type}</span>}
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="form-group">
                            <Input
                                label="Restock Level"
                                placeholder="Enter restock level"
                                type="text"
                                name="restock_level"
                                value={values.restock_level}
                                onChange={handleChange}
                            />
                            {errors.restock_level && <span style={errorStyle}>{errors.restock_level}</span>}
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="form-check">
                            <input
                                className="form-check-input"
                                type="checkbox"
                                id="stock_alert"
                                name="stock_alert"
                                checked={values.stock_alert}
                                onChange={handleCheckboxChange}
                            />
                            <label className="form-check-label" htmlFor="stock_alert">
                                Stock Alert
                            </label>
                        </div>
                    </div>
                    {errorMessage && <p className='error'>{errorMessage}</p>}
                </form>
            </Modal.Body>
            <Modal.Footer>
                <Button
                    variant="light"
                    onClick={() => {
                        initForm(initialInputs);
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
                    {loading ? <Loader/> : "Add Item"}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default AddItemForm;
