'use client';
import React, {useEffect, useState} from "react";
import PaymentMethodTabs from "@/app/widgets/paymentMethodTabs/paymentMethodTabs";
import FormHandler from "@/app/utils/FormHandler/Formhandler";
import {validate, paymentSchema} from "@/app/utils/Validation/validations";
import Input from "@/app/widgets/input/Input";
import Button from "@/app/widgets/Button/Button";
import {useParams} from "next/navigation";
import api from "@/app/utils/Api/api";
import Invoice from "@/app/widgets/invoice/invoice";
import Loader from "@/app/widgets/loader/loader";

interface PaymentProps {
    subtotal: string;
    discount: string;
    total: string;
    tableData: any[];
    customerResponse: any;
}

const Payment: React.FC<PaymentProps> = ({subtotal, discount, total, tableData, customerResponse}) => {
    const [activeTab, setActiveTab] = useState('cash');
    const [balance, setBalance] = useState('0.00');
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false)
    const {business_id} = useParams();

    const {handleChange, handleSubmit, values, errors, setValue} = FormHandler(
        async () => {
            setLoading(true)
            const requestData = {
                business_id: business_id,
                amount: parseFloat(total),
                // customer: customerResponse.customer,
                invoice_status: "paid",
                invoice_items: tableData.map(item => ({
                    category: item.categoryId,
                    item: item.itemId,
                    price: item.unitPrice,
                    quantity: item.quantity,
                })),
            };
            try {
                const response = await api.post("billing/create-bill", requestData);
                if (response.status === 201) {
                    console.log("Billing created successfully", response.data);
                    // Handle successful billing creation, e.g., show a success message or redirect
                } else {
                    setErrorMessage("Oops! Something went wrong, try again later.");
                    console.error("Error in creating billing", response.data.message);
                }
            } catch (error) {
                setErrorMessage("Oops! Something went wrong, try again later.");
                console.error("Error in creating billing", error);
            } finally {
                setLoading(false)
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

    useEffect(() => {
        if (activeTab === 'cash') {
            const recipientAmount = parseFloat(values.cash?.recipientAmount || '0');
            const calculatedBalance = recipientAmount - parseFloat(total);
            setBalance(calculatedBalance.toFixed(2));
        }
    }, [values.cash?.recipientAmount, total, activeTab]);

    return (
        <div className='container-fluid row col-sm-4'>
            <form onSubmit={handleSubmit}>
                <div>
                    <PaymentMethodTabs activeTab={activeTab} onTabChange={handleTabChange}/>
                </div>
                <div>
                    <div className='d-flex flex-row justify-content-between'>
                        <label>Subtotal</label>
                        <p>{subtotal}</p>
                    </div>
                    <div className='d-flex flex-row justify-content-between'>
                        <label>Discount</label>
                        <p>{discount}</p>
                    </div>
                    <div className='d-flex flex-row justify-content-between'>
                        <label>Total</label>
                        <p>{total}</p>
                    </div>
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
                            <div className='d-flex flex-row justify-content-between'>
                                <label>Balance</label>
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
                        <div>
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
                    )}
                </div>
                {loading ? <Loader/> : <Button type='submit' variant='dark' className='mt-2'>Submit Bill</Button>}
                {errorMessage && <p className="error">{errorMessage}</p>}
            </form>
            {/*<Invoice subtotal={subtotal} discount={discount} total={total} tableData={tableData} customerResponse={customerResponse} />*/}
        </div>
    );
}

export default Payment;


