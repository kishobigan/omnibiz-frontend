'use client'
import React, { useState, useRef,useImperativeHandle } from "react";
import Input from "@/app/widgets/input/Input";
import {DateSelector} from "@/app/widgets/datepicker/datepicker";
import './createOrder.css'
import FormHandler from "@/app/utils/FormHandler/Formhandler";
import {createOrderSchema, validate} from '@/app/utils/Validation/validations';

interface CreateOrderProps {
    onSubmit: (newOrder: any) => void;
}

const CreateOrder: React.ForwardRefRenderFunction<any, CreateOrderProps> = (props, ref) => {
    const { onSubmit } = props;

    const { values, errors, handleChange, handleSubmit, initForm } = FormHandler(
        () => {
            console.log('Form submitted:', values);
        },
        validate,
        createOrderSchema
    );

    useImperativeHandle(ref, () => ({
        submitForm: handleSubmit,
    }));

    React.useEffect(() => {
        initForm({
            deliveryDate: '',
            orderAmount: '',
            paidAmount: '',
            dueDate: '',
        });
    }, [initForm]);

    return (
        <div>
            <form onSubmit={handleSubmit} className="row g-3 ms-5 me-5">
                <div className="col-md-6">
                    <label htmlFor="payback-period" className="form-label">Delivery Date</label>
                    <DateSelector/>
                </div>
                <div className="col-md-6">
                    <div className="form-group">
                        <Input label='Order Amount' icon={null} placeholder="Order Amount" type={"text"}
                               value={values.amount}
                               onChange={handleChange}/>
                        {errors.Name && <span className="error">{errors.amount}</span>}
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="form-group">
                        <Input label='Paid Amount' placeholder="Paid Amount" type={"text"}
                               value={values.paid}
                               onChange={handleChange}/>
                        {errors.email && <span className="error">{errors.paid}</span>}
                    </div>
                </div>
                <div className="col-md-6">
                    <label htmlFor="payback-period" className="form-label">Amount Due Date</label>
                    <DateSelector/>
                </div>
            </form>
        </div>
    );
};

export default CreateOrder;

