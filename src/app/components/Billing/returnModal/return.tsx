'use client'
import React, {useEffect, useState} from 'react';
import {Modal} from "react-bootstrap";
import {ACCESS_TOKEN} from "@/app/utils/Constants/constants";
import Cookies from "js-cookie";
import FormHandler from "@/app/utils/FormHandler/Formhandler";
import {returnBillSchema, validate} from "@/app/utils/Validation/validations";
import {useParams} from "next/navigation";
import api from "@/app/utils/Api/api";
import Input from "@/app/widgets/input/Input";
import Button from "@/app/widgets/Button/Button";
import Table from "@/app/widgets/table/Table";
import ConfirmationDialog from "@/app/widgets/confirmationDialog/confirmationDialog";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTrash} from "@fortawesome/free-solid-svg-icons";

interface ReturnBillProps {
    show: boolean;
    onHide: () => void;
}

const ReturnModal: React.FC<ReturnBillProps> = ({show, onHide}) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [isSubmit, setIsSubmit] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [allBillData, setAllBillData] = useState<any[]>([]);
    const [filteredBillData, setFilteredBillData] = useState<any[]>([]);
    const [selectedSalesIds, setSelectedSalesIds] = useState<string[]>([]);
    const [showConfirm, setShowConfirm] = useState<boolean>(false);
    const [selectedItem, setSelectedItem] = useState<string | null>(null);
    const token = Cookies.get(ACCESS_TOKEN);
    const {business_id} = useParams();

    const initValues = {
        invoice_id: ''
    };

    const {
        handleChange,
        handleSubmit,
        initForm,
        values,
        errors,
    } = FormHandler(() => setIsSubmit(true), validate, returnBillSchema, initValues);

    useEffect(() => {
        const fetchAllBillData = async () => {
            setLoading(true);
            try {
                const response = await api.get(`billing/list-bill/${business_id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setAllBillData(response.data);
                // setFilteredBillData(response.data);
            } catch (error) {
                setErrorMessage('Failed to fetch billing data');
            } finally {
                setLoading(false);
            }
        };

        fetchAllBillData();
    }, [business_id, token]);

    useEffect(() => {
    }, [allBillData]);
    console.log("all bill data", allBillData)

    const handleFilterChange = (invoice_id: string) => {
        const filtered = allBillData.filter(bill => bill.invoice_id.includes(invoice_id));
        console.log("handleFilterChange function invoice_id", invoice_id);
        console.log("handleFilterChange function bill data", filtered);
        setFilteredBillData(filtered);
        // setAllBillData(filtered);
    };

    useEffect(() => {
        console.log("Filtered Bill Data updated:", filteredBillData);
    }, [filteredBillData]);
    console.log("filtered bill data", filteredBillData)

    const handleItemSelect = (sales_id: string) => {
        setSelectedSalesIds(prevState =>
            prevState.includes(sales_id)
                ? prevState.filter(id => id !== sales_id)
                : [...prevState, sales_id]
        );
    };

    useEffect(() => {
        if (isSubmit && selectedSalesIds.length > 0) {
            const submitReturnRequests = async () => {
                setLoading(true);
                try {
                    const requestData = {
                        business_id: business_id,
                        invoice_id: values.invoice_id,
                    };

                    for (const sales_id of selectedSalesIds) {
                        const response = await api.post(`billing/return-item/${sales_id}`, requestData, {
                            headers: {
                                Authorization: `Bearer ${token}`
                            }
                        });
                    }
                } catch (error: any) {
                    console.error("Error in returning items", error);
                } finally {
                    setLoading(false);
                    setIsSubmit(false);
                }
            };

            submitReturnRequests();
        }
    }, [isSubmit]);

    const handleFormSubmit = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        event.preventDefault();
        handleSubmit({
            preventDefault: () => {
            },
        } as React.FormEvent<HTMLFormElement>);
        console.log("invoice id is", values.invoice_id)
        handleFilterChange(values.invoice_id);
    };

    const confirmSelect = () => {
        setShowConfirm(false)
    };

    const columns = [
        {key: 'invoice_id', header: 'Invoice id'},
        {key: 'quantity', header: 'Quantity'},
        {key: 'unitPrice', header: 'Unit Price'},
        {key: 'amount', header: 'Amount'},
        {key: 'action', header: 'Action'},
    ];

    const actions: any[] = [
        {
            icon: <FontAwesomeIcon icon={faTrash} style={{color: 'red'}}/>,
            onClick: handleItemSelect,
        }
    ];

    return (
        <div>
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
                        <div>Return items</div>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form className='row' onSubmit={handleSubmit}>
                        <div className="col-md-6">
                            <div className="form-group">
                                <Input
                                    label='Invoice Id'
                                    placeholder="Enter invoice id"
                                    type="text"
                                    name="invoice_id"
                                    value={values.invoice_id}
                                    onChange={handleChange}
                                />
                                {errors.invoice_id &&
                                    <span className="error text-danger">{errors.invoice_id}</span>}
                            </div>
                        </div>
                        <div className='col-md-6'>
                            <div>
                                <Button variant="dark" className='mt-4' type='submit' onClick={handleFormSubmit}>
                                    Get invoice
                                </Button>
                            </div>
                        </div>
                    </form>
                    {allBillData.length > 0 && (
                        <div className="scrollable_table mt-2 mb-4">
                            <Table
                                data={allBillData}
                                columns={columns}
                                actions={actions}
                                emptyMessage='items'
                                onRowClick={(row) => handleItemSelect(row.sales_id)}
                            />
                            <ConfirmationDialog
                                show={showConfirm}
                                onHide={() => setShowConfirm(false)}
                                onConfirm={confirmSelect}
                                message={`Do you want to return ${selectedItem} from billing?`}
                            />
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant="light"
                        onClick={() => {
                            initForm(initValues)
                            onHide()
                            setErrorMessage(null)
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="dark"
                        onClick={() => setIsSubmit(true)}
                    >
                        Return Items
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default ReturnModal;