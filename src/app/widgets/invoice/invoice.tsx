'use client'
import React, {useRef, forwardRef, useImperativeHandle} from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import "./invoice.css";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faFileInvoice} from "@fortawesome/free-solid-svg-icons";

interface InvoiceProps {

    billingData: {
        invoice_id: string;
        balance: string;
        discount: string;
        items: {
            itemId: number;
            itemName: string;
            quantity: number;
            unitPrice: number;
            amount: number;
        }[];
        recipientAmount: string;
        subTotal: string;
        total: string;
    };
}

export interface InvoiceHandle {
    handlePrint: () => Promise<void>;
}

const Invoice = forwardRef<InvoiceHandle, InvoiceProps>(({billingData}, ref) => {
    const invoiceRef = useRef<HTMLDivElement>(null);
    const currentDate = new Date().toLocaleDateString();
    const currentTime = new Date().toLocaleTimeString();
    const cashierName = "Raja";

    useImperativeHandle(ref, () => ({
        handlePrint: async () => {
            if (invoiceRef.current) {
                const canvas = await html2canvas(invoiceRef.current);
                const imgData = canvas.toDataURL('image/png');
                const pdf = new jsPDF('p', 'mm', 'a5');
                pdf.addImage(imgData, 'PNG', 0, 0, 148, 210);
                pdf.save('invoice.pdf');
            }
        }
    }));

    return (
        <div ref={invoiceRef} className="container-fluid d-flex justify-content-center align-items-center">
            <div ref={invoiceRef} className="invoice-container col-sm-6">
                <div className="header">
                    <div className="top-line"></div>
                    <div className="header-left">
                        <FontAwesomeIcon icon={faFileInvoice} className="invoice-icon"/>
                        <h2 className="invoice-title">Invoice</h2>
                    </div>
                    <div className="header-right">
                        <h3>OmniBiz</h3>
                        <p>Your Business Address</p>
                    </div>
                </div>
                <div className="separator"></div>
                <div className="billing-info">
                    <p>Invoice ID: {billingData.invoice_id}</p>
                    <p>Date: {currentDate}</p>
                    <p>Time: {currentTime}</p>
                    <p>Cashier: {cashierName}</p>
                </div>
                <div className="separator"></div>
                <div className="items-table">
                    <table>
                        <thead>
                        <tr>
                            <th>Item Name</th>
                            <th>Quantity</th>
                            <th>Unit Price</th>
                            <th>Amount</th>
                        </tr>
                        </thead>
                        <tbody>
                        {billingData.items.map((item) => (
                            <tr key={item.itemId}>
                                <td>{item.itemName}</td>
                                <td>{item.quantity}</td>
                                <td>{item.unitPrice}</td>
                                <td>{item.amount}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
                <div className="billing-info">
                    <div className="billing-info-row">
                        <span className="label">Subtotal:</span>
                        <span className="value">{billingData.subTotal}</span>
                    </div>
                    <div className="billing-info-row">
                        <span className="label">Discount:</span>
                        <span className="value">{billingData.discount}</span>
                    </div>
                    <div className="billing-info-row">
                        <span className="label">Recipient Amount:</span>
                        <span className="value">{billingData.recipientAmount}</span>
                    </div>
                    <div className="billing-info-row">
                        <span className="label">Balance:</span>
                        <span className="value">{billingData.balance}</span>
                    </div>
                </div>
                <div className="total">
                    <h6>TOTAL</h6>
                    <h2>
                        <b>{billingData.total}</b>
                    </h2>
                </div>
            </div>
        </div>
    );
});
Invoice.displayName = 'Invoice';

export default Invoice;


