import React, {useState, useEffect} from 'react';
import Input from '@/app/widgets/input/Input';
import {Modal} from 'react-bootstrap';
import {highStaffSchema, validate} from '@/app/utils/Validation/validations';
import FormHandler from '@/app/utils/FormHandler/Formhandler';
import Checkbox from '@/app/widgets/checkdbox/Checkbox';
import Loader from '@/app/widgets/loader/loader';
import api from "@/app/utils/Api/api";
import Cookies from "js-cookie";
import {ACCESS_TOKEN} from "@/app/utils/Constants/constants";
import Button from "@/app/widgets/Button/Button";
import {useParams} from "next/navigation";

interface CreateHigherStaffProps {
    type: 'Add' | 'Edit' | 'View';
    show: boolean;
    onHide: () => void;
    selectedHigherStaff?: any;
    update?: () => void;
}

const CreateHigherStaff: React.FC<CreateHigherStaffProps> = ({type, show, onHide, selectedHigherStaff, update}) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [isSubmit, setIsSubmit] = useState<boolean>(false);
    const [selectedBusinesses, setSelectedBusinesses] = useState<string[]>([]);
    const [businessData, setBusinessData] = useState<{ name: string, value: string }[]>([]);
    const token = Cookies.get(ACCESS_TOKEN)
    const {user_id} = useParams()

    const initValues = {
        email: '',
        business_id: '',
    };

    const {
        handleChange,
        handleSubmit,
        setValue,
        initForm,
        values,
        errors,
    } = FormHandler(() => setIsSubmit(true), validate, highStaffSchema, initValues);

    function resetForm() {
        initForm(initValues)
    }

    useEffect(() => {
        if (type === 'Edit' && selectedHigherStaff) {
            initForm(selectedHigherStaff);
        } else if (type === 'Add') {
            // resetForm();
            // initForm(initValues);
        }
    }, [initForm, resetForm, selectedHigherStaff, type]);

    useEffect(() => {
        const fetchBusinesses = async () => {
            try {
                const response = await api.get(`business/get-all-businesses/${user_id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                });
                if (response.status === 200) {
                    const fetchedData = response.data.map((business: any) => ({
                        name: business.business_name,
                        value: business.business_id,
                    }));
                    setBusinessData(fetchedData);
                } else {
                    console.log("Error in fetching businesses", response.data.message);
                }
            } catch (error) {
                console.error("Error in fetching businesses", error);
            }
        };

        fetchBusinesses();
    }, []);

    useEffect(() => {
        if (!isSubmit) {
            return;
        }
        const submitData = async () => {
            setLoading(true);
            try {
                if (type === 'Add') {
                    const requestData = {
                        email: values.email,
                        business_id: selectedBusinesses,
                        role: 'higher-staff'
                    };
                    const response = await api.post("auth/create-staff", requestData, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        }
                    });
                    if (response.status === 201) {
                        console.log("Higher-staff created successfully", response.data);
                        onHide();
                    } else {
                        console.log("Error in creating higher-staff", response.data.message)
                    }
                } else if (type === 'Edit') {
                    const userId = selectedHigherStaff.id;
                    const requestData = {
                        email: values.email,
                        business_id: values.business_id,
                        role: 'higher-staff'
                    };
                    const response = await api.put(`auth/update-higher-staff/${userId}`, requestData);
                    if (response.status === 201) {
                        console.log("Higher-staff is updated successfully", response.data);
                        if (update) update();
                        onHide();
                    }
                    console.log("Higher-staff updated:", values);
                }
            } catch (error) {
                console.error("Error in submitting higher-staff data", error);
            } finally {
                setLoading(false);
                setIsSubmit(false);
                resetForm();
            }
        };

        submitData();
    }, [isSubmit]);

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {value, checked} = e.target;
        let tempData = [...selectedBusinesses]
        if (tempData.includes(value) && !checked) {
            tempData = tempData.filter((i) => i !== value)
        } else {
            tempData.push(value)
        }
        setSelectedBusinesses(tempData)
    };
    const handleFormSubmit = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        event.preventDefault();
        handleSubmit({
            preventDefault: () => {
            }
        } as React.FormEvent<HTMLFormElement>);
    };

    const errorStyle = {
        color: 'red',
        fontSize: '13px',
        marginTop: '5px',
        marginBottom: '10px'
    };

    return (
        <Modal
            show={show}
            onHide={() => {
                onHide();
            }}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            backdrop
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    {type === "Add" && <div>Create Higher-Staff</div>}
                    {type === "Edit" && <div>Edit Higher-Staff</div>}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <form
                    onSubmit={handleSubmit}
                    className="row g-3 ms-5 me-5"
                >
                    <div className="col-md-12">
                        <div className="form-group">
                            <Input
                                label="Email"
                                icon={null}
                                placeholder="Enter Your Email"
                                value={values.email || ""}
                                onChange={handleChange}
                                type={"email"}
                                name="email"
                            />
                            {errors.email && <span style={errorStyle}>{errors.email}</span>}
                        </div>
                    </div>
                    <div className="col-md-12">
                        <div className="form-group">
                            <label>Select Businesses</label>
                            <div className="row">
                                {businessData.map((business, i) => (
                                    <div key={business.value} className="col-md-4">
                                        <Checkbox
                                            label={business.name}
                                            name={"selectedBusinesses" + i}
                                            value={business.value}
                                            checked={selectedBusinesses.includes(business.value)}
                                            handleChange={handleCheckboxChange}
                                        />
                                    </div>
                                ))}
                            </div>
                            {errors.selectedBusinesses && <span style={errorStyle}>{errors.selectedBusinesses}</span>}
                        </div>
                    </div>
                </form>
            </Modal.Body>
            <Modal.Footer>
                <Button
                    variant="light"
                    onClick={() => {
                        initForm(initValues)
                        onHide();
                    }}
                >
                    Cancel
                </Button>
                <Button
                    variant="dark"
                    onClick={handleFormSubmit}
                >
                    {loading ? <Loader/> : (type === "Add" ? "Create" : "Update")}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default CreateHigherStaff;