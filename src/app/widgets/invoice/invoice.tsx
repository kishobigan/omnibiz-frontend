import React, {useRef, forwardRef, useImperativeHandle} from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface InvoiceProps {
    billingData: {
        balance: string;
        discount: string;
        items: { itemId: number; itemName: string; quantity: number; unitPrice: number; amount: number; }[];
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

    useImperativeHandle(ref, () => ({
        handlePrint: async () => {
            if (invoiceRef.current) {
                const canvas = await html2canvas(invoiceRef.current);
                const imgData = canvas.toDataURL('image/png');
                const pdf = new jsPDF('p', 'mm', 'letter');
                pdf.addImage(imgData, 'PNG', 0, 0, 210, 297);
                pdf.save('invoice.pdf');
            }
        }
    }));

    return (
        <div ref={invoiceRef} style={{padding: '20px', background: '#fff', color: '#000', width: '466px'}}>
            <h4>Invoice</h4>
            <h5>Items</h5>
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
            <p>Subtotal: {billingData.subTotal}</p>
            <p>Discount: {billingData.discount}</p>
            <p>Total: {billingData.total}</p>
            <p>Recipient Amount: {billingData.recipientAmount}</p>
            <p>Balance: {billingData.balance}</p>
        </div>
    );
});

Invoice.displayName = 'Invoice';

export default Invoice;


