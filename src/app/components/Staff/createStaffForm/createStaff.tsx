"use client";
import React, {useState, useEffect} from "react";
import Input from "@/app/widgets/input/Input";
import Checkbox from "@/app/widgets/checkdbox/Checkbox";
import FormHandler from "@/app/utils/FormHandler/Formhandler";
import {staffSchema, validate} from "@/app/utils/Validation/validations";
import Cookies from "js-cookie";
import {ACCESS_TOKEN} from "@/app/utils/Constants/constants";
import {useParams} from "next/navigation";
import api from "@/app/utils/Api/api";
import {Modal} from "react-bootstrap";
import Button from "@/app/widgets/Button/Button";
import Loader from "@/app/widgets/loader/loader";

type CheckboxState = {
    Manager: boolean;
    Stock_Management: boolean;
    Billing: boolean;
    Store_Keeping: boolean;
    Assistance: boolean;
    Other: boolean;
};

interface AddStaffProps {
    type: 'Add' | 'Edit' | 'View';
    show: boolean;
    onHide: () => void;
    initialValues?: any;
    update?: () => void;
}

const AddStaffForm: React.FC<AddStaffProps> = ({type, show, onHide, update, initialValues}) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [isSubmit, setIsSubmit] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const token = Cookies.get(ACCESS_TOKEN);
    const {business_id} = useParams();

    const initialCheckboxState: CheckboxState = {
        Manager: false,
        Stock_Management: false,
        Billing: false,
        Store_Keeping: false,
        Assistance: false,
        Other: false,
    };

    const [checkedState, setCheckedState] = useState<CheckboxState>(initialCheckboxState);

    const initialInputs = {
        role_name: "",
        email: "",
        permissions: [],
    };

    const {values, errors, handleChange, handleSubmit, initForm} = FormHandler(
        () => setIsSubmit(true),
        validate,
        staffSchema
    );

    useEffect(() => {
        if (initialValues) {
            initForm(initialValues);
            const initialPermissions = initialValues.permissions.reduce(
                (acc: CheckboxState, permission: string) => {
                    acc[permission as keyof CheckboxState] = true;
                    return acc;
                },
                {...checkedState}
            );
            setCheckedState(initialPermissions);
        }
    }, [initialValues]);

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, checked} = e.target;
        setCheckedState((prevState) => ({...prevState, [name]: checked}));
    };

    useEffect(() => {
        if (!isSubmit) {
            return;
        }
        const submitData = async () => {
            setLoading(true);
            try {
                const permissions = Object.keys(checkedState).filter(
                    (key) => checkedState[key as keyof CheckboxState]
                );
                const requestData = {
                    business_id: [business_id],
                    email: values.email,
                    permissions: permissions,
                    role_name: values.role_name
                };
                if (type === 'Add') {
                    const response = await api.post("auth/create-staff", requestData, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    if (response.status === 201) {
                        console.log("Staff created successfully", response.data);
                        onHide();
                        if (update) update();
                    } else {
                        setErrorMessage("Oops! Something went wrong.");
                        console.log("Error in creating staff", response.data.message);
                    }
                } else if (type === 'Edit') {
                    const response = await api.put(`/business/update-staff/<str:user_id>`, requestData, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    if (response.status === 201) {
                        console.log("Staff updated successfully", response.data);
                        onHide();
                        if (update) update();
                    } else {
                        setErrorMessage("Oops! Something went wrong.");
                        console.log("Error in updating staff", response.data.message);
                    }
                }
            } catch (error) {
                setErrorMessage("Oops! Something went wrong.");
                console.log("Error in creating staff", error);
            } finally {
                setLoading(false);
                setIsSubmit(false);
                initForm(initialInputs);
                setCheckedState(initialCheckboxState);
            }
        };
        submitData();
    }, [isSubmit]);

    const handleFormSubmit = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        event.preventDefault();
        handleSubmit({
            preventDefault: () => {
            },
        } as React.FormEvent<HTMLFormElement>);
    };

    const items = [
        "Manager",
        "Stock Management",
        "Billing",
        "Store Keeping",
        "Assistance",
        "Other",
    ];

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
                setCheckedState(initialCheckboxState);
            }}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            backdrop
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    {type === "Add" && <div>Create Staff</div>}
                    {type === "View" && <div>View Staff</div>}
                    {type === "Edit" && <div>Edit Staff</div>}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <form onSubmit={handleSubmit} className="row g-3 ms-5 me-5">
                    <div className="col-md-6">
                        <div className="form-group">
                            <Input
                                label="Role Name"
                                name="role_name"
                                placeholder="Enter role name"
                                type="text"
                                value={values.role_name || ""}
                                onChange={handleChange}
                            />
                            {errors.role_name && <span style={errorStyle}>{errors.role_name}</span>}
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="form-group">
                            <Input
                                label="Email"
                                name="email"
                                placeholder="Enter email address"
                                type="email"
                                value={values.email || ""}
                                onChange={handleChange}
                            />
                            {errors.email && <span style={errorStyle}>{errors.email}</span>}
                        </div>
                    </div>
                    <p>Staff Privileges</p>
                    {items.map((item, index) => (
                        <div className="col-md-4" key={index}>
                            <Checkbox
                                label={item}
                                name={item}
                                checked={checkedState[item as keyof CheckboxState]}
                                handleChange={handleCheckboxChange}
                                value={item}/>
                        </div>
                    ))}
                </form>
            </Modal.Body>
            <Modal.Footer>
                <Button
                    variant="light"
                    onClick={() => {
                        if (type !== "View") {
                            initForm(initialInputs);
                            setCheckedState(initialCheckboxState);
                        }
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
                        {loading ? <Loader/> : type === "Add" ? "Create" : "Update"}
                    </Button>
                )}
            </Modal.Footer>
        </Modal>
    );
};

export default AddStaffForm;

