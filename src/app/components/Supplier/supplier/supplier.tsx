'use client'
import React, {useEffect, useState} from 'react';
import './supplier.css';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faArrowsAltH, faEye, faEdit} from "@fortawesome/free-solid-svg-icons";
import Search from "@/app/widgets/search/search";
import Table from "@/app/widgets/table/Table";
import Pagination from "@/app/widgets/pagination/pagination";
import {useParams} from "next/navigation";
import FeatherIcon from "feather-icons-react";
import Button from "@/app/widgets/Button/Button";
import AddSupplier from "@/app/components/Supplier/addSupplierForm/addSupplier";
import api from "@/app/utils/Api/api";

const Supplier: React.FC = () => {
    const [supplierData, setSupplierData] = useState([]);
    const [orderData, setOrderData] = useState<any[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 10;

    const [modalType, setModalType] = useState<"Add" | "Edit" | "View">("Add")
    const [showModal, setShowModal] = useState(false)
    const [selectedSupplier, setSelectedSupplier] = useState(null)
    const [update, setUpdate] = useState(false)
    const {business_id} = useParams()

    useEffect(() => {
        const fetchSupplierData = async () => {
            try {
                const response = await api.get(`suppliers/get-supplier/${business_id}`);
                setSupplierData(response.data);
            } catch (error) {
                console.error("Error in fetching suppliers data", error)
            }
        }
        fetchSupplierData()
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

    const columns = [
        {key: 'supplier_name', header: 'Supplier Name'},
        {key: 'supplier_address', header: 'Address'},
        {key: 'supplier_phone', header: 'Phone Number'},
        {key: 'supplier_email', header: 'Email ID'},
        {key: 'supplier_website', header: 'Website URL'},
        {key: 'action', header: 'Actions'},
    ];

    const actions = [
        {
            icon: <FontAwesomeIcon icon={faEdit} style={{color: 'blue'}}/>,
            onClick: handleEditClick,
        },
        {
            icon: <FontAwesomeIcon icon={faEye} style={{color: 'green'}}/>,
            onClick: handleViewClick,
        }
    ];

    const totalPages = Math.ceil(supplierData.length / rowsPerPage);

    return (
        <div className='container-fluid row'>
            <div className="header-container">
                <h5>Suppliers</h5>
                <div className="filter-container">
                    <span>
                        {/*<FontAwesomeIcon icon={faArrowsAltH} className="filter-icon"/>*/}
                        Filter by:
                    </span>
                    <div className="search">
                        <Search/>
                    </div>
                    <div className="supplier-add">
                        <Button
                            onClick={() => {
                                setModalType("Add");
                                setShowModal(true);
                            }}
                            variant="dark"
                            className="me-2 buttonWithPadding"
                            type="button"
                        >
                            <FeatherIcon className={"action-icons me-2"} icon={"plus"}/>
                            Create Supplier
                        </Button>
                    </div>
                </div>
            </div>

            <div className="table-container _body">
                <Table data={supplierData}
                       columns={columns}
                       actions={actions}
                       currentPage={currentPage}
                       rowsPerPage={rowsPerPage}
                       emptyMessage="suppliers"
                />
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
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
                    setSelectedSupplier(null)
                }}
            />
        </div>
    );
};

export default Supplier;
