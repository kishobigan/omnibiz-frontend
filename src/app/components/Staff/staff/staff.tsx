"use client";
import React, {useState, useEffect} from "react";
import Table from "@/app/widgets/table/Table";
import "./staff.css";
import Pagination from "@/app/widgets/pagination/pagination";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEye, faEdit} from "@fortawesome/free-solid-svg-icons";
import {useParams} from "next/navigation";
import api from "@/app/utils/Api/api";
import Button from "@/app/widgets/Button/Button";
import AddStaffForm from "@/app/components/Staff/createStaffForm/createStaff";

const initialStaffData = [
    {
        staffId: 1,
        name: "mala",
        roleName: "manager",
        status: "on",
        permissions: ["managing", "store keeping"],
    },
    {
        staffId: 2,
        name: "kamal",
        roleName: "stock manager",
        status: "off",
        permissions: ["stock managing"],
    },
    {
        staffId: 3,
        name: "jana",
        roleName: "stock keeper",
        status: "off",
        permissions: ["store keeping"],
    },
];

function Staff() {
    const [staffData, setStaffData] = useState(initialStaffData);
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 10;

    const [modalType, setModalType] = useState<"Add" | "Edit" | "View">("Add");
    const [showModal, setShowModal] = useState(false);
    const [selectedStaff, setSelectedStaff] = useState(null);
    const [update, setUpdate] = useState(false);
    const {business_id} = useParams();

    const handleStatusChange = (id: number, status: boolean) => {
        const updatedData = staffData.map((staff) =>
            staff.staffId === id ? {...staff, status: status ? "on" : "off"} : staff
        );
        setStaffData(updatedData);
    };

    useEffect(() => {
        const fetchStaffData = async () => {
            try {
                const response = await api.get(`staff/get-staff/${business_id}/staff/`);
                // setStaffData(response.data);
            } catch (error) {
                console.error("Error in fetching staff data:", error);
            }
        };

        fetchStaffData();
    }, [business_id, update]);

    const columns = [
        {key: "staffId", header: "Staff Id"},
        {key: "name", header: "Name"},
        {key: "roleName", header: "Role Name"},
        {key: "status", header: "Duty Status"},
        {
            key: "permissions",
            header: "Permissions",
            render: (permissions: string[]) => permissions.join(", "),
        },
        {key: "action", header: "Actions"},
    ];

    const startRow = (currentPage - 1) * rowsPerPage;
    const endRow = startRow + rowsPerPage;
    const currentData = staffData.slice(startRow, endRow);

    const totalPages = Math.ceil(staffData.length / rowsPerPage);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handleViewClick = (selectedStaff: any) => {
        setSelectedStaff(selectedStaff);
        setModalType("View");
        setShowModal(true);
    };

    const handleEditClick = (selectedStaff: any) => {
        setSelectedStaff(selectedStaff);
        setModalType("Edit");
        setShowModal(true);
    };

    const actions = [
        {
            icon: <FontAwesomeIcon icon={faEdit} style={{color: "blue"}}/>,
            onClick: handleEditClick,
        },
        {
            icon: <FontAwesomeIcon icon={faEye} style={{color: "green"}}/>,
            onClick: handleViewClick,
        }
    ];

    return (
        <div className="container-fluid">
            <div className="button-container d-flex justify-content-end mt-4">
                <Button
                    onClick={() => {
                        setModalType("Add");
                        setShowModal(true);
                    }}
                    variant="dark"
                    className="me-2 buttonWithPadding"
                    type="button"
                >
                    Create Staff
                </Button>
            </div>
            <h6 className="mb-5">
                <b>Staff Details</b>
            </h6>
            <Table
                data={currentData}
                columns={columns}
                currentPage={currentPage}
                rowsPerPage={rowsPerPage}
                actions={actions}
                handleStatusChange={handleStatusChange}
                emptyMessage="staff"
            />
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
            />
            <AddStaffForm
                show={showModal}
                type={modalType}
                initialValues={selectedStaff}
                update={() => setUpdate(!update)}
                onHide={() => {
                    setShowModal(false);
                    setSelectedStaff(null);
                }}
            />
        </div>
    );
}

export default Staff;
