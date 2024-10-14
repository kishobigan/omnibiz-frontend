'use client';
import React, {useEffect, useState} from "react";
import PaymentMethodTabs from "@/app/widgets/paymentMethodTabs/paymentMethodTabs";
import FormHandler from "@/app/utils/FormHandler/Formhandler";
import {validate, paymentSchema} from "@/app/utils/Validation/validations";
import Input from "@/app/widgets/input/Input";
import Button from "@/app/widgets/Button/Button";
import {useParams} from "next/navigation";
import api from "@/app/utils/Api/api";
import Loader from "@/app/widgets/loader/loader";
import Table from "@/app/widgets/table/Table";
import InvoiceModal from "@/app/components/Billing/InvoiceModal/invoiceModal";
import FeatherIcon from "feather-icons-react";

interface PaymentProps {
    subtotal: string;
    discount: string;
    total: string;
    tableData: any[];
    customerResponse: any;
}

interface Draft {
    business_id: string;
    amount: number;
    invoice_status: string;
    customer: string | null;
    payment_type: string;
    payee_name: string | null;
    cheque_number: string | null;
    due_date: string | null;
    invoice_items: {
        category: number;
        item: number;
        price: number;
        quantity: number;
    }[];
}

const Payment: React.FC<PaymentProps> = ({subtotal, discount, total, tableData, customerResponse}) => {
    const [activeTab, setActiveTab] = useState('cash');
    const [balance, setBalance] = useState('0.00');
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [drafts, setDrafts] = useState<Draft[]>([]);
    const [showModal, setShowModal] = useState(false)
    const {business_id} = useParams();

    const [billingData, setBillingData] = useState<{
        balance: string;
        discount: string;
        items: { itemId: number; itemName: string; quantity: number; unitPrice: number; amount: number; }[];
        recipientAmount: string;
        subTotal: string;
        total: string;
        business_id: string;
        amount: number;
        invoice_status: string;
        customer: string | null;
        payment_type: string;
        payee_name: string | null;
        cheque_number: string | null;
        due_date: string | null;
    }>({
        balance: '0.00',
        discount: '0.00',
        items: [],
        recipientAmount: '0.00',
        subTotal: '0.00',
        total: '0.00',
        business_id: "",
        amount: 0.00,
        invoice_status: "paid",
        customer: null,
        payment_type: "cash",
        payee_name: null,
        cheque_number: null,
        due_date: null,
    });

    const {handleChange, handleSubmit, values, errors, setValue} = FormHandler(
        async () => {
            if (navigator.onLine) {
                setLoading(true);
                const requestData: Draft = {
                    business_id: business_id as string,
                    amount: parseFloat(total),
                    invoice_status: "paid",
                    customer: customerResponse ? customerResponse.id : null,
                    payment_type: activeTab,
                    payee_name: activeTab === 'cheque' ? values.cheque?.name || null : null,
                    cheque_number: activeTab === 'cheque' ? values.cheque?.cheque_no || null : null,
                    due_date: activeTab === 'cheque' ? values.cheque?.dueDate || null : null,
                    invoice_items: tableData.map(item => ({
                        category: item.categoryId,
                        item: item.itemId,
                        price: item.unitPrice,
                        quantity: item.quantity,
                    })),
                };

                try {
                    setBillingData({
                        balance: balance,
                        discount: discount || '0.00',
                        items: tableData.map(item => ({
                            itemId: item.itemId,
                            itemName: item.itemName,
                            quantity: item.quantity,
                            unitPrice: item.unitPrice,
                            amount: item.unitPrice * item.quantity,
                        })),
                        recipientAmount: values.cash?.recipientAmount || '0.00',
                        subTotal: subtotal || '0.00',
                        total: total,
                        business_id: business_id as string,
                        amount: parseFloat(total),
                        invoice_status: "paid",
                        customer: customerResponse?.customerId || null,
                        payment_type: activeTab,
                        payee_name: values.cheque?.name || null,
                        cheque_number: values.cheque?.cheque_no || null,
                        due_date: values.cheque?.dueDate || null,
                    });

                    const response = await api.post("billing/create-bill", requestData);
                    if (response.status === 201) {
                        setShowModal(true)
                        console.log("Billing created successfully", response.data);
                    } else {
                        setErrorMessage("Oops! Something went wrong, try again later.");
                        console.error("Error in creating billing", response.data.message);
                    }
                } catch (error) {
                    setErrorMessage("Oops! Something went wrong, try again later.");
                    console.error("Error in creating billing", error);
                } finally {
                    setLoading(false);
                }
            } else {
                saveDraft();
            }
        },
        validate, paymentSchema
    );

    const handleTabChange = (tab: string) => {
        setActiveTab(tab);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>, category: string, field: string) => {
        const value = e.target.value;
        setValue({
            [category]: {...values[category], [field]: value},
        });
    };

    const saveDraft = () => {
        const newDraft: Draft = {
            business_id: business_id as string,
            amount: parseFloat(total),
            invoice_status: "draft",
            customer: null,
            payment_type: activeTab,
            payee_name: null,
            cheque_number: null,
            due_date: null,
            invoice_items: tableData.map(item => ({
                category: item.categoryId,
                item: item.itemId,
                price: item.unitPrice,
                quantity: item.quantity,
            })),
        };

        const existingDrafts: Draft[] = JSON.parse(localStorage.getItem("billingDraft-Omnibiz") ?? '[]');
        existingDrafts.push(newDraft);
        localStorage.setItem('billingDraft-Omnibiz', JSON.stringify(existingDrafts));
        alert("Draft saved successfully!");
    };

    useEffect(() => {
        const syncDrafts = async () => {
            const drafts: Draft[] = JSON.parse(localStorage.getItem('billingDraft-Omnibiz') ?? '[]');
            if (drafts.length > 0) {
                for (const draft of drafts) {
                    try {
                        const response = await api.post("billing/create-bill", draft);
                        if (response.status === 201) {
                            console.log("Billing created successfully", response.data);
                            const updatedDrafts = drafts.filter((d: Draft) => d !== draft);
                            localStorage.setItem('billingDraft-Omnibiz', JSON.stringify(updatedDrafts));
                        } else {
                            console.error("Error in creating billing", response.data.message);
                        }
                    } catch (error) {
                        console.error("Error in creating billing", error);
                    }
                }
            }
        };

        const handleOnline = () => {
            console.log("Network is online");
            syncDrafts();
        };

        const handleOffline = () => {
            console.log("Network is offline");
        };

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    useEffect(() => {
        if (activeTab === 'cash') {
            const recipientAmount = parseFloat(values.cash?.recipientAmount || '0');
            const calculatedBalance = recipientAmount - parseFloat(total);
            setBalance(calculatedBalance.toFixed(2));
        }
    }, [values.cash?.recipientAmount, total, activeTab]);

    useEffect(() => {
        const loadDrafts = () => {
            const drafts: Draft[] = JSON.parse(localStorage.getItem("billingDraft-Omnibiz") ?? '[]');
            const transformedDrafts = drafts.map(draft => ({
                ...draft,
                itemsList: draft.invoice_items.map(item => item.item).join(', '),
            }));
            setDrafts(transformedDrafts);
        };

        loadDrafts();
    }, []);

    const columns = [
        {key: 'business_id', header: 'Business ID'},
        {key: 'amount', header: 'Amount'},
        {key: 'invoice_status', header: 'Invoice Status'},
        {key: 'itemsList', header: 'Invoice Items'},
    ];

    return (
        <div className='container-fluid'>
            <div className='row'>
                <div className='col-sm-4'>
                    <form onSubmit={handleSubmit}>
                        <div>
                            <PaymentMethodTabs activeTab={activeTab} onTabChange={handleTabChange}/>
                        </div>
                        <div className='mt-2'>
                            {activeTab === 'cash' && (
                                <div>
                                    <div className='row col-sm-9'>
                                        <Input
                                            label="Recipient Amount"
                                            type="text"
                                            name="recipientAmount"
                                            placeholder='recipient amount'
                                            value={values.cash?.recipientAmount || ''}
                                            onChange={(e) => handleInputChange(e, 'cash', 'recipientAmount')}
                                        />
                                        {errors['cash.recipientAmount'] && (
                                            <p className='text-danger'>{errors['cash.recipientAmount']}</p>
                                        )}
                                    </div>
                                    <div className='d-flex flex-row fw-bold'>
                                        <label className='me-5'>Balance</label>
                                        <p>{balance}</p>
                                    </div>
                                </div>
                            )}
                            {activeTab === 'card' && (
                                <div>
                                    <Input
                                        label="Card number"
                                        type="text"
                                        name="cardNo"
                                        value={values.card?.cardNo || ''}
                                        onChange={(e) => handleInputChange(e, 'card', 'cardNo')}
                                    />
                                    {errors['card.cardNo'] && (
                                        <p className='text-danger'>{errors['card.cardNo']}</p>
                                    )}
                                    <Input
                                        label="Card holder name"
                                        type="text"
                                        name="holderName"
                                        value={values.card?.holderName || ''}
                                        onChange={(e) => handleInputChange(e, 'card', 'holderName')}
                                    />
                                    {errors['card.holderName'] && (
                                        <p className='text-danger'>{errors['card.holderName']}</p>
                                    )}
                                </div>
                            )}
                            {activeTab === 'cheque' && (
                                <div className='row'>
                                    <div className=''>
                                        <Input
                                            label="Cheque number"
                                            type="text"
                                            name="cheque_no"
                                            value={values.cheque?.cheque_no || ''}
                                            onChange={(e) => handleInputChange(e, 'cheque', 'cheque_no')}
                                        />
                                        {errors['cheque.cheque_no'] && (
                                            <p className='text-danger'>{errors['cheque.cheque_no']}</p>
                                        )}
                                    </div>
                                    <div className='col-md-6'>
                                        <Input
                                            label="Name"
                                            type="text"
                                            name="name"
                                            value={values.cheque?.name || ''}
                                            onChange={(e) => handleInputChange(e, 'cheque', 'name')}
                                        />
                                        {errors['cheque.name'] && (
                                            <p className='text-danger'>{errors['cheque.name']}</p>
                                        )}
                                    </div>
                                    <div className='col-md-6'>
                                        <Input
                                            label="Amount"
                                            type="text"
                                            name="amount"
                                            value={values.cheque?.amount || ''}
                                            onChange={(e) => handleInputChange(e, 'cheque', 'amount')}
                                        />
                                        {errors['cheque.amount'] && (
                                            <p className="text-danger">{errors['cheque.amount']}</p>
                                        )}
                                    </div>
                                    <Input
                                        label='Due date'
                                        type="date"
                                        name='dueDate'
                                        value={values.cheque?.dueDate || ''}
                                        onChange={(e) => handleInputChange(e, 'cheque', 'dueDate')}
                                    />
                                    {errors['cheque.dueDate'] && (
                                        <p className="text-danger">{errors['cheque.dueDate']}</p>
                                    )}
                                </div>
                            )}
                        </div>
                        {loading ? <Loader/> : (
                            <div>
                                <Button type='submit' variant='dark' className='mt-2'>
                                    <FeatherIcon className={"action-icons me-2"} icon={"file-text"}/>
                                    Submit Bill
                                </Button>
                                <Button type='button' variant='dark' className='mt-2 ms-5' onClick={saveDraft}>
                                    <FeatherIcon className={"action-icons me-2"} icon={"paperclip"}/>
                                    Save as Draft
                                </Button>
                            </div>
                        )}
                        {errorMessage && <p className="error">{errorMessage}</p>}
                    </form>
                </div>
                <div className='col-sm-8'>
                    <div>
                        <p className='text-center fw-bold'>Draft bills</p>
                        <Table data={drafts} columns={columns}/>
                    </div>
                </div>
            </div>
            <InvoiceModal
                billingData={billingData}
                show={showModal}
                onHide={() => setShowModal(false)}
            />
        </div>
    );
}

export default Payment;



