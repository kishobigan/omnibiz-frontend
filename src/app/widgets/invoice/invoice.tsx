// import React, {useRef} from 'react';
// import {toPng} from 'html-to-image';
// import Button from "@/app/widgets/Button/Button";
//
// interface InvoiceProps {
//     billingData: {
//         balance: string;
//         discount: string;
//         items: { itemId: number; itemName: string; quantity: number; unitPrice: number; amount: number; }[];
//         recipientAmount: string;
//         subTotal: string;
//         total: string;
//     };
// }
//
// const Invoice: React.FC<InvoiceProps> = ({billingData}) => {
//     const invoiceRef = useRef<HTMLDivElement>(null);
//
//     const handlePrint = async () => {
//         if (invoiceRef.current) {
//             const dataUrl = await toPng(invoiceRef.current);
//             const link = document.createElement('a');
//             link.href = dataUrl;
//             link.download = 'invoice.png';
//             link.click();
//         }
//     };
//
//     return (
//         <div>
//             <div ref={invoiceRef} style={{padding: '20px', background: '#fff', color: '#000', width: '800px'}}>
//                 <h2>Invoice</h2>
//                 <p>Subtotal: {billingData.subTotal}</p>
//                 <p>Discount: {billingData.discount}</p>
//                 <p>Total: {billingData.total}</p>
//                 <p>Recipient Amount: {billingData.recipientAmount}</p>
//                 <p>Balance: {billingData.balance}</p>
//                 <h3>Items</h3>
//                 <table>
//                     <thead>
//                     <tr>
//                         <th>Item Name</th>
//                         <th>Quantity</th>
//                         <th>Unit Price</th>
//                         <th>Amount</th>
//                     </tr>
//                     </thead>
//                     <tbody>
//                     {billingData.items.map((item) => (
//                         <tr key={item.itemId}>
//                             <td>{item.itemName}</td>
//                             <td>{item.quantity}</td>
//                             <td>{item.unitPrice}</td>
//                             <td>{item.amount}</td>
//                         </tr>
//                     ))}
//                     </tbody>
//                 </table>
//             </div>
//             <Button onClick={handlePrint} variant='dark'>Generate Invoice</Button>
//         </div>
//     );
// };
//
// export default Invoice;

import React, {useRef} from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import Button from "@/app/widgets/Button/Button";

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

const Invoice: React.FC<InvoiceProps> = ({billingData}) => {
    const invoiceRef = useRef<HTMLDivElement>(null);

    const handlePrint = async () => {
        if (invoiceRef.current) {
            const canvas = await html2canvas(invoiceRef.current);
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            pdf.addImage(imgData, 'PNG', 0, 0, 210, 297);
            pdf.save('invoice.pdf');
        }
    };

    return (
        <div>
            <div ref={invoiceRef} style={{padding: '20px', background: '#fff', color: '#000', width: '800px'}}>
                <h2>Invoice</h2>
                <p>Subtotal: {billingData.subTotal}</p>
                <p>Discount: {billingData.discount}</p>
                <p>Total: {billingData.total}</p>
                <p>Recipient Amount: {billingData.recipientAmount}</p>
                <p>Balance: {billingData.balance}</p>
                <h3>Items</h3>
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
            <Button onClick={handlePrint} variant='dark'>Generate Invoice</Button>
        </div>
    );
};

export default Invoice;
