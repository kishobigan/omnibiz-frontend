'use client';
import React, { useEffect, useState } from 'react';
import './supplier.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faEye } from "@fortawesome/free-solid-svg-icons";
import { useParams } from "next/navigation";
import FeatherIcon from "feather-icons-react";
import Button from "@/app/widgets/Button/Button";
import Table from "@/app/widgets/table/Table";
import Pagination from "@/app/widgets/pagination/pagination";
import AddSupplier from "@/app/components/Supplier/addSupplierForm/addSupplier";
import api from "@/app/utils/Api/api";
import CreateContractForm from "@/app/components/Supplier/createContract/createContract";

const Supplier: React.FC = () => {
    const [supplierData, setSupplierData] = useState([]);
    const [contractData, setContractData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 10;

    const [modalType, setModalType] = useState<"Add" | "Edit" | "View">("Add");
    const [showModal, setShowModal] = useState(false);
    const [showContractModal, setShowContractModal] = useState(false);
    const [selectedSupplier, setSelectedSupplier] = useState(null);
    const [update, setUpdate] = useState(false);
    const { business_id } = useParams();
    const [activeTab, setActiveTab] = useState<'suppliers' | 'contracts'>('suppliers');

    useEffect(() => {
        const fetchSupplierData = async () => {
            try {
                const response = await api.get(`suppliers/get-supplier/${business_id}`);
                setSupplierData(response.data);
            } catch (error) {
                console.error("Error in fetching suppliers data", error);
            }
        };
        fetchSupplierData();
    }, [business_id, update]);

    useEffect(() => {
        const fetchContractData = async () => {
            try {
                const response = await api.get(`suppliers/get-all-contract/${business_id}`);
                setContractData(response.data);
            } catch (error) {
                console.error("Error in fetching contracts data", error);
            }
        };
        fetchContractData();
    }, [business_id, update]);

    const handleViewClick = (selectedSupplier: any) => {
        setSelectedSupplier(selectedSupplier);
        setModalType("View");
        setShowModal(true);
    };

    const handleEditClick = (selectedSupplier: any) => {
        setSelectedSupplier(selectedSupplier);
        setModalType("Edit");
        setShowModal(true);
    };

    const supplierColumns = [
        { key: 'supplier_name', header: 'Supplier Name' },
        { key: 'supplier_address', header: 'Address' },
        { key: 'supplier_phone', header: 'Phone Number' },
        { key: 'supplier_email', header: 'Email ID' },
        { key: 'supplier_website', header: 'Website URL' },
        { key: 'action', header: 'Actions' },
    ];

    const contractColumns = [
        { key: 'supplier_id', header: 'Supplier Name' },
        { key: 'contact_period', header: 'Contract Period' },
    ];

    const actions = [
        {
            icon: <FontAwesomeIcon icon={faEdit} style={{ color: 'blue' }} />,
            onClick: handleEditClick,
        },
        {
            icon: <FontAwesomeIcon icon={faEye} style={{ color: 'green' }} />,
            onClick: handleViewClick,
        }
    ];

    const totalSupplierPages = Math.ceil(supplierData.length / rowsPerPage);
    const totalContractPages = Math.ceil(contractData.length / rowsPerPage);

    return (
        <div className='container-fluid row'>
            <div className="header-container">
                <div className="nav-links">
                    <span
                        className={`custom-nav-link ${activeTab === 'suppliers' ? 'active' : ''}`}
                        onClick={() => setActiveTab('suppliers')}
                    >
                        Suppliers
                    </span>
                    <span
                        className={`custom-nav-link ${activeTab === 'contracts' ? 'active' : ''}`}
                        onClick={() => setActiveTab('contracts')}
                    >
                        Create Contract
                    </span>
                </div>
                <div className="button-container">
                    <Button
                        onClick={() => {
                            setModalType("Add");
                            setShowModal(true);
                        }}
                        variant="dark"
                        className="me-2 buttonWithPadding"
                        type="button"
                    >
                        <FeatherIcon className={"action-icons me-2"} icon={"plus"} />
                        Add Supplier
                    </Button>
                    <Button
                        onClick={() => setShowContractModal(true)}
                        variant="dark"
                        className="me-2 buttonWithPadding"
                        type="button"
                    >
                        <FeatherIcon className={"action-icons me-2"} icon={"plus"} />
                        Create Contract
                    </Button>
                </div>
            </div>

            {activeTab === 'suppliers' && (
                <div className="table-container _body">
                    <Table
                        data={supplierData}
                        columns={supplierColumns}
                        actions={actions}
                        currentPage={currentPage}
                        rowsPerPage={rowsPerPage}
                        emptyMessage="No suppliers found."
                    />
                    <div className="pagination-container">
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalSupplierPages}
                            onPageChange={setCurrentPage}
                        />
                    </div>
                    <AddSupplier
                        show={showModal}
                        type={modalType}
                        selectedSupplier={selectedSupplier}
                        update={() => setUpdate(!update)}
                        onHide={() => {
                            setShowModal(false);
                            setSelectedSupplier(null);
                        }}
                    />
                </div>
            )}

            {activeTab === 'contracts' && (
                <div className="table-container _body">
                    <Table
                        data={contractData}
                        columns={contractColumns}
                        actions={actions}
                        currentPage={currentPage}
                        rowsPerPage={rowsPerPage}
                        emptyMessage="No contracts found."
                    />
                    <div className="pagination-container">
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalContractPages}
                            onPageChange={setCurrentPage}
                        />
                    </div>
                </div>
            )}

            <CreateContractForm
                show={showContractModal}
                onHide={() => setShowContractModal(false)}
                updateContracts={() => setUpdate(!update)} // Pass the function here
            />
        </div>
    );
};

export default Supplier;
