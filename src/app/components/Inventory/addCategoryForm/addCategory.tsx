import React, {useState, useEffect} from "react";
import {Modal} from 'react-bootstrap';
import Input from "@/app/widgets/input/Input";
import FormHandler from "@/app/utils/FormHandler/Formhandler";
import {validate, createCategorySchema} from "@/app/utils/Validation/validations";
import Loader from "@/app/widgets/loader/loader";
import api from "@/app/utils/Api/api";
import Cookies from "js-cookie";
import {ACCESS_TOKEN} from "@/app/utils/Constants/constants";
import {useParams} from "next/navigation";
import Button from "@/app/widgets/Button/Button";

interface AddCategoryProps {
    show: boolean;
    onHide: () => void;
    update?: () => void;
}

const AddCategoryForm: React.FC<AddCategoryProps> = ({
                                                         show, onHide, update
                                                     }) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [isSubmit, setIsSubmit] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null)
    const token = Cookies.get(ACCESS_TOKEN);
    const {business_id} = useParams()

    const {handleChange, handleSubmit, values, errors, initForm} = FormHandler(() =>
        setIsSubmit(true), validate, createCategorySchema);
    let initValues: { name: string; description: string };
    initValues = {
        name: '',
        description: ''
    };

    useEffect(() => {
        if (!isSubmit) {
            return
        }
        const submitData = async () => {
            setLoading(true)
            try {
                const requestData = {
                    business_id: business_id,
                    name: values.name,
                    description: values.description
                }
                const response = await api.post("inventory/create-category", requestData, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                if (response.status === 201) {
                    console.log("Category added successfully", response.data)
                    if (update) update();
                    onHide()
                } else {
                    setErrorMessage("Oops! Something went wrong.")
                    console.log("Error in adding category", response.data.message)
                }
            } catch (error) {
                setErrorMessage("Oops! Something went wrong.")
                console.error("Error in adding category", error);
            } finally {
                setLoading(false)
                setIsSubmit(false)
                initForm(initValues)
            }
        }
        submitData()
    }, [isSubmit, update]);

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
                initForm(initValues);
                onHide();
                setErrorMessage(null)
            }}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            backdrop="static"
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    <div>Add Category</div>
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <form className="row g-3 ms-5 me-5" onSubmit={handleSubmit}>
                    <div className="col-md-12">
                        <div className="form-group">
                            <Input
                                label="Category Name"
                                placeholder="Enter category name"
                                type="text"
                                name="name"
                                value={values.name}
                                onChange={handleChange}
                            />
                            {errors.name && <span style={errorStyle}>{errors.name}</span>}
                        </div>
                    </div>
                    <div className="col-md-12">
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
                    {loading ? <Loader/> : "Add Category"}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default AddCategoryForm;
