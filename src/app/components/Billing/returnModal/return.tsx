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

interface ReturnBillProps {
    show: boolean;
    onHide: () => void;
}

const ReturnModal: React.FC<ReturnBillProps> = ({show, onHide}) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [allBillData, setAllBillData] = useState<any[]>([]);
    const [filteredBillData, setFilteredBillData] = useState<any[]>([]);
    const [selectedSalesIds, setSelectedSalesIds] = useState<string[]>([]);
    const [invoiceId, setInvoiceId] = useState<string>('');
    const token = Cookies.get(ACCESS_TOKEN);
    const {business_id} = useParams();

    const initValues = {
        invoice_id: ''
    };

    const {
        handleChange,
        initForm,
        values,
        errors,
    } = FormHandler(() => {
    }, validate, returnBillSchema, initValues);

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
            } catch (error) {
                setErrorMessage('Failed to fetch billing data');
            } finally {
                setLoading(false);
            }
        };

        fetchAllBillData();
    }, [business_id, token]);

    const handleFilterChange = (invoice_id: string) => {
        const filtered = allBillData
            .filter(bill => bill.invoice_id.replace(/-/g, '').includes(invoice_id))
            .flatMap(bill =>
                bill.items.map((item: any) => ({
                    sales_id: item.sales_id,
                    item: item.item,
                    quantity: item.quantity,
                    unitPrice: parseFloat(item.price),
                    amount: parseFloat(item.price) * parseInt(item.quantity, 10),
                }))
            );

        setFilteredBillData(filtered);
    };

    const handleItemSelect = (sales_id: string) => {
        setSelectedSalesIds((prevSelected) =>
            prevSelected.includes(sales_id)
                ? prevSelected.filter((id) => id !== sales_id)
                : [...prevSelected, sales_id]
        );
    };

    const handleReturnSubmit = async () => {
        if (selectedSalesIds.length === 0) {
            console.log("No items selected for return");
            return;
        }
        setLoading(true);
        try {
            const requestData = {
                business_id: business_id,
                invoice_id: invoiceId,
            };

            for (const sales_id of selectedSalesIds) {
                const response = await api.put(`billing/return-item/${sales_id}`, requestData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (response.status === 201) {
                    console.log(`Item with sales_id ${sales_id} returned successfully.`);
                } else {
                    console.error(`Error returning item with sales_id ${sales_id}`);
                }
            }
            setInvoiceId('')
            setSelectedSalesIds([])
            setFilteredBillData([])
        } catch (error: any) {
            console.error("Error in returning items", error);
        } finally {
            setLoading(false);
            onHide();
        }
    };

    const columns = [
        {key: 'sales_id', header: 'Sales ID'},
        {key: 'item', header: 'Product'},
        {key: 'quantity', header: 'Quantity'},
        {key: 'unitPrice', header: 'Unit Price'},
        {key: 'amount', header: 'Amount'},
        {key: 'select', header: 'Select'},
    ];

    return (
        <div>
            <Modal
                show={show}
                onHide={() => {
                    initForm(initValues);
                    onHide();
                    setFilteredBillData([]);
                    setSelectedSalesIds([]);
                    setInvoiceId('')
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
                    <form className='row'>
                        <div className="col-md-6">
                            <div className="form-group">
                                <Input
                                    label='Invoice Id'
                                    placeholder="Enter invoice id"
                                    type="text"
                                    name="invoice_id"
                                    value={invoiceId}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        setInvoiceId(value);
                                        handleChange(e);
                                        handleFilterChange(value);
                                    }}
                                />
                                {errors.invoice_id &&
                                    <span className="error text-danger">{errors.invoice_id}</span>}
                            </div>
                        </div>
                    </form>

                    {filteredBillData.length > 0 && (
                        <div className="scrollable_table mt-2 mb-4">
                            <Table
                                data={filteredBillData.map((row) => ({
                                    ...row,
                                    select: (
                                        <input
                                            type="checkbox"
                                            checked={selectedSalesIds.includes(row.sales_id)}
                                            onChange={() => handleItemSelect(row.sales_id)}
                                        />
                                    ),
                                }))}
                                columns={columns}
                                emptyMessage='No items found'
                            />
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant="light"
                        onClick={() => {
                            initForm(initValues);
                            onHide();
                            setFilteredBillData([]);
                            setInvoiceId('')
                            setErrorMessage(null);
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="dark"
                        onClick={handleReturnSubmit}
                    >
                        Return Items
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default ReturnModal;
