'use client'
import React, {useRef} from "react";
import {Modal} from "react-bootstrap";
import Invoice, {InvoiceHandle} from "@/app/widgets/invoice/invoice";
import Button from "@/app/widgets/Button/Button";

interface InvoiceModalProps {
    show: boolean;
    onHide: () => void;
    billingData: {
        balance: string;
        discount: string;
        items: { itemId: number; itemName: string; quantity: number; unitPrice: number; amount: number; }[];
        recipientAmount: string;
        subTotal: string;
        total: string;
    };
}

const InvoiceModal: React.FC<InvoiceModalProps> = ({show, onHide, billingData}) => {
    const invoiceRef = useRef<InvoiceHandle>(null);

    const handlePrintClick = async () => {
        if (invoiceRef.current) {
            await invoiceRef.current.handlePrint();
        }
        onHide();
    };

    return (
        <Modal
            show={show}
            onHide={onHide}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            backdrop="static"
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Invoice
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Invoice ref={invoiceRef} billingData={billingData}/>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="light" onClick={onHide}>
                    Cancel
                </Button>
                <Button variant="dark" onClick={handlePrintClick}>
                    Print invoice
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default InvoiceModal;
