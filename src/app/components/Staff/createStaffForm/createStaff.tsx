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
    [key: string]: boolean;
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
    const [accessData, setAccessData] = useState<{ value: string; name: string }[]>([]);
    const [checkedState, setCheckedState] = useState<CheckboxState>({});
    const token = Cookies.get(ACCESS_TOKEN);
    const {business_id} = useParams();

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
        const fetchAccess = async () => {
            try {
                const response = await api.get(`super/get-access`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                });

                if (response.status === 200) {
                    const fetchedData = response.data.access_records.map((access: any) => ({
                        name: access.description,
                        value: access.permission,
                    }));
                    setAccessData(fetchedData);

                    const initialCheckboxState: CheckboxState = fetchedData.reduce((acc: CheckboxState, curr: {
                        value: string;
                        name: string
                    }) => {
                        acc[curr.value] = false;
                        return acc;
                    }, {});
                    setCheckedState(initialCheckboxState);
                } else {
                    console.log("Error in fetching access", response.data.message);
                }
            } catch (error) {
                console.error("Error in fetching access", error);
            }
        };

        fetchAccess();
    }, [token]);

    useEffect(() => {
        if (initialValues) {
            initForm(initialValues);
            const initialPermissions = initialValues.permissions.reduce(
                (acc: CheckboxState, permission: string) => {
                    acc[permission] = true;
                    return acc;
                },
                {...checkedState}
            );
            setCheckedState(initialPermissions);
        }
    }, [initialValues, checkedState, initForm]);

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
                    (key) => checkedState[key]
                );

                const requestData = {
                    business_id: [business_id],
                    email: values.email,
                    permissions: permissions,
                    role_name: values.role_name
                };
                console.log("create staff data", requestData)

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
                setCheckedState({});
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
                setCheckedState({});
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
                    {accessData.map((access, index) => (
                        <div className="col-md-4" key={index}>
                            <Checkbox
                                label={access.name}
                                name={access.value}
                                checked={checkedState[access.value] || false}
                                handleChange={handleCheckboxChange}
                                value={access.value}
                            />
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
                            setCheckedState({});
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

