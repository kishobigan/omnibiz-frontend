'use client'
import React, {useEffect, useState} from 'react';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faUser, faShoppingCart, faTrash} from '@fortawesome/free-solid-svg-icons';
import Input from "@/app/widgets/input/Input";
import Button from "@/app/widgets/Button/Button";
import Table from "@/app/widgets/table/Table";
import Payment from "@/app/components/Billing/payment/payment";
import FormHandler from "@/app/utils/FormHandler/Formhandler";
import InputDropdown from "@/app/widgets/productInput/inputDropdown";
import {billingSchema, validate} from "@/app/utils/Validation/validations";
import './billing.css'
import api from "@/app/utils/Api/api";
import {useParams, useRouter} from "next/navigation";
import Cookies from "js-cookie";
import {ACCESS_TOKEN} from "@/app/utils/Constants/constants";
import ConfirmationDialog from "@/app/widgets/confirmationDialog/confirmationDialog";

interface Product {
    itemId: number;
    itemName: string;
    unitPrice: number;
    categoryId: string;
}

const Billing: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [allProducts, setAllProducts] = useState<Product[]>([]);
    const [tableData, setTableData] = useState<any[]>([]);
    const [billingData, setBillingData] = useState<any>(null);
    const [customerResponse, setCustomerResponse] = useState<any>(null);
    const [showConfirm, setShowConfirm] = useState<boolean>(false);
    const [selectedRow, setSelectedRow] = useState<any>(null);
    const [selectedItem, setSelectedItem] = useState<string>('');
    const {business_id} = useParams()
    const router = useRouter()
    const token = Cookies.get(ACCESS_TOKEN);

    useEffect(() => {
        async function fetchProducts() {
            try {
                const response = await api.get(`inventory/list-item/${business_id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                });
                const filteredProducts = response.data.map((item: any) => ({
                    itemId: item.item_id,
                    categoryId: item.category_id,
                    itemName: item.name,
                    unitPrice: parseFloat(item.unit_price),
                }));
                setAllProducts(filteredProducts);
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        }

        fetchProducts();
    }, [business_id, token]);

    const columns = [
        {key: 'itemName', header: 'Product Name'},
        {key: 'quantity', header: 'Quantity'},
        {key: 'unitPrice', header: 'Unit Price'},
        {key: 'amount', header: 'Amount'},
        {key: 'action', header: 'Action'},
    ];

    const handleDelete = (row: any) => {
        setSelectedRow(row);
        setShowConfirm(true);
        setSelectedItem(row.itemName)
    };

    const confirmDelete = () => {
        setTableData(prevData => prevData.filter(data => data.itemName !== selectedRow.itemName));
        setShowConfirm(false);
    };

    const actions = [
        {
            icon: <FontAwesomeIcon icon={faTrash} style={{color: 'red'}}/>,
            onClick: handleDelete,
        }
    ];

    const {
        handleChange: handleCustomerChange,
        handleSubmit: handleCustomerSubmit,
        values: customerValues,
        errors: customerErrors,
        setValue: setCustomerValue
    } = FormHandler(
        async () => {
            setLoading(true);
            try {
                const customerData = {
                    business_id: business_id,
                    name: customerValues.customerName,
                    address: customerValues.address,
                    phone: customerValues.phoneNumber,
                };
                const customerResponse = await createCustomer(customerData);
                setCustomerResponse(customerResponse);
            } catch (error) {
                console.error("Error in customer creation", error);
            } finally {
                setLoading(false);
            }
        },
        validate,
        billingSchema
    );

    const {
        handleChange,
        handleSubmit,
        values,
        setValue,
        errors
    } = FormHandler(
        async () => {
            setLoading(true);
            try {
                const selectedItem = allProducts.find(product => product.itemId.toString() === values.item);
                if (selectedItem) {
                    const amount = selectedItem.unitPrice * parseInt(values.quantity, 10);
                    setTableData(prevData => [
                        ...prevData,
                        {
                            itemId: selectedItem.itemId,
                            itemName: selectedItem.itemName,
                            categoryId: selectedItem.categoryId,
                            quantity: parseInt(values.quantity, 10),
                            unitPrice: selectedItem.unitPrice,
                            amount: amount
                        }
                    ]);
                    setValue({
                        ...values,
                        item: '',
                        quantity: ''
                    });
                }
            } catch (error) {
                console.error("Error in billing request", error);
            } finally {
                setLoading(false);
            }
        },
        validate,
        billingSchema
    );

    const handleDropdownChange = (name: string, value: string) => {
        handleChange({target: {name, value}} as React.ChangeEvent<HTMLInputElement>);
    };

    const subtotal = tableData.reduce((acc, item) => acc + item.amount, 0).toFixed(2);
    const discount = values.discount ? ((subtotal * parseFloat(values.discount)) / 100).toFixed(2) : "0.00";
    const total = (subtotal - parseFloat(discount)).toFixed(2);

    return (
        <div className='container-fluid mt-3'>
            <div>
                <form onSubmit={handleCustomerSubmit}>
                    <div>
                        <div className='d-flex flex-row justify-content-between'>
                            <div className='d-flex flex-row '>
                                <FontAwesomeIcon className='me-2' icon={faUser}/>
                                <p className='fw-large p_tag'>Customer Details</p>
                            </div>
                            <div>
                                <Button
                                    variant="dark"
                                    className="buttonWithPadding"
                                    onClick={() => router.push('/return')}
                                >
                                    Return
                                </Button>
                            </div>
                        </div>
                        <div className='row'>
                            <div className='d-flex flex-column flex-sm-row gap-md-5 gap-sm-3 gap-1'>
                                <Input
                                    label="Customer name"
                                    placeholder="Enter customer name"
                                    icon={null}
                                    value={customerValues.customerName || ''}
                                    onChange={handleCustomerChange}
                                    name="customerName"
                                    type="text"
                                />
                                <Input
                                    label="Phone number"
                                    placeholder="Enter phone number"
                                    icon={null}
                                    value={customerValues.phoneNumber || ''}
                                    onChange={handleCustomerChange}
                                    name="phoneNumber"
                                    type="text"
                                />
                                <Input
                                    label="Address"
                                    placeholder="Enter address"
                                    icon={null}
                                    value={customerValues.address || ''}
                                    onChange={handleCustomerChange}
                                    name="address"
                                    type="text"
                                />
                                <div className='d-flex align-items-center'>
                                    <Button type='submit' variant='dark' className='mt-2'>Create
                                        Customer
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
                <form onSubmit={handleSubmit}>
                    <div>
                        <div className='d-flex flex-row'>
                            <FontAwesomeIcon className='me-2 mt-1' icon={faShoppingCart}/>
                            <p className='fw-medium p_tag'>Product Details</p>
                        </div>
                        <div className='row'>
                            <div className='d-flex flex-column flex-sm-row gap-md-5 gap-sm-3 gap-1'>
                                <InputDropdown
                                    label="Product"
                                    options={allProducts.map(product => ({
                                        value: product.itemId.toString(),
                                        label: product.itemName
                                    }))}
                                    value={values.item || ''}
                                    onChange={handleDropdownChange}
                                    name="item"
                                />
                                <Input
                                    label="Quantity"
                                    placeholder="Quantity"
                                    icon={null}
                                    value={values.quantity || ''}
                                    onChange={handleChange}
                                    name="quantity"
                                    type="number"
                                />
                                <div className='d-flex align-items-center'>
                                    <Button type='submit' variant='dark'>
                                        <span className="d-sm-flex d-md-none">Add</span>
                                        <span className="d-none d-md-block">Add to Bill</span>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
                <div className="scrollable_table mt-2 mb-4">
                    <Table data={tableData} columns={columns} actions={actions} emptyMessage='products'/>
                    <ConfirmationDialog
                        show={showConfirm}
                        onHide={() => setShowConfirm(false)}
                        onConfirm={confirmDelete}
                        message={`Do you want to remove ${selectedItem} from billing?`}
                    />
                </div>
                <div className='container-fluid'>
                    <div className='row row-cols-auto'>
                        <div className='col'>
                            <form onSubmit={handleSubmit}>
                                <Input
                                    label='Apply discount(%) to all items?'
                                    placeholder="discount in percentage%"
                                    icon={null}
                                    value={values.discount || ''}
                                    onChange={handleChange}
                                    name="discount"
                                    type="text"
                                />
                            </form>
                        </div>
                        <div className='col fw-bold text-center ms-5 pt-3'>
                            <label>Subtotal</label>
                            <p>{subtotal}</p>
                        </div>
                        <div className='col fw-bold text-center pt-3 px-5'>
                            <label className='fs-3'>-</label>
                        </div>
                        <div className='col fw-bold text-center pt-3'>
                            <label>Discount</label>
                            <p>{discount}</p>
                        </div>
                        <div className='col fw-bold text-center pt-3 px-5'>
                            <label className='fs-5'>=</label>
                        </div>
                        <div className='col fw-bold text-center pt-3'>
                            <label>Total</label>
                            <p>{total}</p>
                        </div>
                    </div>
                </div>
                <Payment subtotal={subtotal} discount={discount} total={total} tableData={tableData}
                         customerResponse={customerResponse}/>
            </div>
        </div>
    );
}

const createCustomer = async (customerData: any) => {
    const token = Cookies.get(ACCESS_TOKEN);
    try {
        const response = await api.post('billing/create-customer', customerData, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error creating customer:', error);
        throw new Error('Error creating customer: ' + error);
    }
};

export default Billing;




