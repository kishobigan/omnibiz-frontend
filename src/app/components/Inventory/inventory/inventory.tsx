"use client";
import React, {useState, useEffect} from "react";
import Table from "@/app/widgets/table/Table";
import SearchBar from "@/app/widgets/searchBar/searchBar";
import AddItemForm from "@/app/components/Inventory/addItemForm/addItem";
import AddCategoryForm from "@/app/components/Inventory/addCategoryForm/addCategory";
import "./inventory.css";
import Pagination from "@/app/widgets/pagination/pagination";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEye, faEdit} from "@fortawesome/free-solid-svg-icons";
import Button from "@/app/widgets/Button/Button";
import CreateInventoryForm from "@/app/components/Inventory/createInventoryForm/createInventory";
import {useParams} from "next/navigation";
import api from "@/app/utils/Api/api";

interface InventoryItem {
    item: string;
    category: string;
    quantity: number;
    buyingPrice: number;
    sellingPrice: number;
    suppliers: string;
}

function Inventory() {
    const [searchText, setSearchText] = useState<string>("");
    const [inventoryData, setInventoryData] = useState<InventoryItem[]>([])
    const [filteredData, setFilteredData] = useState<InventoryItem[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 10;

    const [modalType, setModalType] = useState<"Add" | "Edit" | "View">("Add")
    const [showCategoryModal, setShowCategoryModal] = useState(false);
    const [showItemModal, setShowItemModal] = useState(false);
    const [showInventoryModal, setShowInventoryModal] = useState(false);
    const [selectedInventory, setSelectedInventory] = useState(null)
    const [update, setUpdate] = useState(false);
    const {business_id} = useParams()

    useEffect(() => {
        const fetchInventoryData = async () => {
            try {
                const response = await api.get(`inventory/list-inventory/${business_id}`);
                setInventoryData(response.data);
                setFilteredData(response.data);
            } catch (error) {
                console.error("Error fetching inventory data:", error);
            }
        };

        fetchInventoryData();
    }, [business_id, update]);

    useEffect(() => {
        setFilteredData(
            inventoryData.filter(
                (item) =>
                    item.suppliers.toLowerCase().includes(searchText.toLowerCase()) ||
                    item.item.toLowerCase().includes(searchText.toLowerCase()) ||
                    item.category.toLowerCase().includes(searchText.toLowerCase())
            )
        );
    }, [searchText]);

    const columns = [
        {key: "item", header: "Item"},
        {key: "category", header: "Category"},
        {key: "quantity", header: "Quantity"},
        {key: "buying_price", header: "Buying Price"},
        {key: "selling_price", header: "Selling Price"},
        {key: "suppliers", header: "Suppliers"},
        {key: "action", header: "Actions"},
    ];

    const handleViewClick = (selectedInventory: any) => {
        setSelectedInventory(selectedInventory)
        setModalType("View")
        setShowInventoryModal(true)
    };

    const handleEditClick = (selectedInventory: any) => {
        setSelectedInventory(selectedInventory)
        setModalType("Edit")
        setShowInventoryModal(true)
    };

    const actions = [
        {
            icon: <FontAwesomeIcon icon={faEdit} style={{color: "blue"}}/>,
            onClick: handleEditClick,
        },
        {
            icon: <FontAwesomeIcon icon={faEye} style={{color: "green"}}/>,
            onClick: handleViewClick,
        },
    ];

    const totalPages = Math.ceil(inventoryData.length / rowsPerPage);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const startRow = (currentPage - 1) * rowsPerPage;
    const endRow = startRow + rowsPerPage;
    const currentData = filteredData.slice(startRow, endRow);

    return (
        <div className="container-fluid">
            <div className="button-container d-flex justify-content-end mt-4">
                <Button
                    onClick={() => setShowItemModal(true)}
                    variant="light"
                    className="me-2 buttonWithPadding"
                >
                    Add Item
                </Button>
                <Button
                    onClick={() => setShowCategoryModal(true)}
                    variant="light"
                    className="me-2 buttonWithPadding"
                >
                    Add Category
                </Button>
                <Button
                    onClick={() => {
                        setModalType("Add");
                        setShowInventoryModal(true)
                    }}
                    variant="dark"
                    className="me-2 buttonWithPadding"
                    type="button"
                >
                    Create Inventory
                </Button>
            </div>
            <div className="row justify-content-center align-items-center mt-5 mb-5">
                <div className="col-6">
                    <h6>
                        <b>Inventory Details</b>
                    </h6>
                </div>
                <div className="col-6">
                    <div className="d-flex justify-content-end align-items-center">
                        <SearchBar searchText={searchText} setSearchText={setSearchText}/>
                    </div>
                </div>
            </div>
            <Table
                data={currentData}
                columns={columns}
                currentPage={currentPage}
                rowsPerPage={rowsPerPage}
                actions={actions}
                emptyMessage="inventory"
            />
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
            />
            <AddCategoryForm
                show={showCategoryModal}
                onHide={() => {
                    setShowCategoryModal(false);
                }}
            />
            <AddItemForm
                show={showItemModal}
                update={() => setUpdate(!update)}
                onHide={() => {
                    setShowItemModal(false);
                }}
            />
            <CreateInventoryForm
                show={showInventoryModal}
                type={modalType}
                selectedInventory={selectedInventory}
                update={() => setUpdate(!update)}
                onHide={() => {
                    setShowInventoryModal(false);
                    setSelectedInventory(null)
                }}
            />
        </div>
    );
}

export default Inventory;
