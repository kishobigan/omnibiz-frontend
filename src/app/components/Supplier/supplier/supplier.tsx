'use client';
import React, {useEffect, useState} from 'react';
import './supplier.css';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faEdit, faEye} from "@fortawesome/free-solid-svg-icons";
import {useParams} from "next/navigation";
import FeatherIcon from "feather-icons-react";
import Button from "@/app/widgets/Button/Button";
import AddSupplier from "@/app/components/Supplier/addSupplierForm/addSupplier";
import api from "@/app/utils/Api/api";
import CreateContractForm from "@/app/components/Supplier/createContract/createContract";
import Table from "@/app/widgets/table/Table";
import Pagination from "@/app/widgets/pagination/pagination";
import SearchBar from "@/app/widgets/searchBar/searchBar";

interface Supplier {
    supplier_name: string;
    supplier_address: string;
    supplier_phone: string;
    supplier_email: string;
    supplier_website: string;
}

interface Contract {
    supplier_id: string;
    contract_end_date: string;
}

interface TableAction<T> {
    icon: React.JSX.Element;
    onClick: (row: T) => void;
}

const Supplier: React.FC = () => {
    const [supplierData, setSupplierData] = useState<Supplier[]>([]);
    const [filteredSupplierData, setFilteredSupplierData] = useState<Supplier[]>([]);
    const [contractData, setContractData] = useState<Contract[]>([]);
    const [filteredContractData, setFilteredContractData] = useState<Contract[]>([]);
    const [searchText, setSearchText] = useState<string>("");
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 4;

    const [modalType, setModalType] = useState<"Add" | "Edit" | "View">("Add");
    const [showModal, setShowModal] = useState(false);
    const [showContractModal, setShowContractModal] = useState(false);
    const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
    const [update, setUpdate] = useState(false);
    const { business_id } = useParams();
    const [activeTab, setActiveTab] = useState<'suppliers' | 'contracts'>('suppliers');

    useEffect(() => {
        const fetchSupplierData = async () => {
            try {
                const response = await api.get(`suppliers/get-supplier/${business_id}`);
                setSupplierData(response.data);
                setFilteredSupplierData(response.data);
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
                const formattedContracts = response.data.map((contract: any) => ({
                    ...contract,
                    contract_end_date: formatDate(contract.contract_end_date)
                }));
                setContractData(formattedContracts);
                setFilteredContractData(formattedContracts);
                console.log("contract data fetched", formattedContracts)
            } catch (error) {
                console.error("Error in fetching contracts data", error);
            }
        };
        fetchContractData();
    }, [business_id, update]);

    useEffect(() => {
        filterSuppliers(searchText);
        filterContracts(searchText);
    }, [searchText, supplierData, contractData]);

    const handleViewClick = (selectedSupplier: Supplier) => {
        setSelectedSupplier(selectedSupplier);
        setModalType("View");
        setShowModal(true);
    };

    const handleEditClick = (selectedSupplier: Supplier) => {
        setSelectedSupplier(selectedSupplier);
        setModalType("Edit");
        setShowModal(true);
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    };

    const filterSuppliers = (text: string) => {
        const filtered = supplierData.filter(supplier =>
            supplier.supplier_name.toLowerCase().includes(text.toLowerCase()) ||
            supplier.supplier_address.toLowerCase().includes(text.toLowerCase()) ||
            supplier.supplier_phone.toLowerCase().includes(text.toLowerCase()) ||
            supplier.supplier_email.toLowerCase().includes(text.toLowerCase()) ||
            supplier.supplier_website.toLowerCase().includes(text.toLowerCase())
        );
        setFilteredSupplierData(filtered);
    };

    const filterContracts = (text: string) => {
        const filtered = contractData.filter(contract =>
            contract.supplier_id.toLowerCase().includes(text.toLowerCase()) ||
            contract.contract_end_date.toLowerCase().includes(text.toLowerCase())
        );
        setFilteredContractData(filtered);
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
        { key: 'contract_end_date', header: 'End Date' },
    ];

    const supplierActions: TableAction<Supplier>[] = [
        {
            icon: <FontAwesomeIcon icon={faEdit} style={{ color: 'blue' }} />,
            onClick: (row: Supplier) => handleEditClick(row),
        },
        {
            icon: <FontAwesomeIcon icon={faEye} style={{ color: 'green' }} />,
            onClick: (row: Supplier) => handleViewClick(row),
        }
    ];

    const contractActions: TableAction<Contract>[] = [
        {
            icon: <FontAwesomeIcon icon={faEdit} style={{ color: 'blue' }} />,
            onClick: (row: Contract) => handleEditClick(row as any), // Adjust as needed
        },
        {
            icon: <FontAwesomeIcon icon={faEye} style={{ color: 'green' }} />,
            onClick: (row: Contract) => handleViewClick(row as any), // Adjust as needed
        }
    ];

    const totalSupplierPages = Math.ceil(filteredSupplierData.length / rowsPerPage);
    const totalContractPages = Math.ceil(filteredContractData.length / rowsPerPage);

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
                        Contracts
                    </span>
                    <div>
                        <SearchBar searchText={searchText} setSearchText={setSearchText}/>
                    </div>
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
                        data={filteredSupplierData}
                        columns={supplierColumns}
                        actions={supplierActions}
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
                </div>
            )}

            {activeTab === 'contracts' && (
                <div className="table-container _body">
                    <Table
                        data={filteredContractData}
                        columns={contractColumns}
                        actions={contractActions}
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

            <CreateContractForm
                show={showContractModal}
                onHide={() => setShowContractModal(false)}
                updateContracts={() => setUpdate(!update)}
            />
        </div>
    );
};

export default Supplier;

