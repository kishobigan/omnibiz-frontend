'use client'
import React, {useState, useEffect} from "react";
import Table from "@/app/widgets/table/Table";
import SearchBar from "@/app/widgets/searchBar/searchBar";
import "./inventory.css";
import Pagination from "@/app/widgets/pagination/pagination";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEye, faEdit} from "@fortawesome/free-solid-svg-icons";
import Button from "@/app/widgets/Button/Button";
import CreateInventoryForm from "@/app/components/Inventory/createInventoryForm/createInventory";
import CreateOrderForm from "@/app/components/Inventory/createOrderForm/createOrder";
import {useParams} from "next/navigation";
import api from "@/app/utils/Api/api";
import {formatDate} from "@/app/utils/UtilFunctions/dateUtils";
import FeatherIcon from "feather-icons-react";

interface InventoryItem {
    item: string;
    category: string;
    quantity: number;
    buyingPrice: number;
    sellingPrice: number;
    suppliers: string;
}

interface Inventory {
    created_at: string;
    created_by: string;
    inventory_id: string;
    supplier: string;
    inventory_items: InventoryItem[];
}

interface FlattenedInventoryItem extends InventoryItem {
    created_at: string;
    created_by: string;
    inventory_id: string;
    supplier: string;
}

interface OrderItem {
    delivery_date: string;
    amount_ordered: number;
    amount_paid: number;
    amount_due_date: string;
    supplier: string;
}

function Inventory() {
    const [searchText, setSearchText] = useState<string>("");
    const [inventoryData, setInventoryData] = useState<FlattenedInventoryItem[]>([]);
    const [filteredData, setFilteredData] = useState<FlattenedInventoryItem[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 10;

    const [modalType, setModalType] = useState<"Add" | "Edit" | "View">("Add");
    const [showInventoryModal, setShowInventoryModal] = useState(false);
    const [showOrderModal, setShowOrderModal] = useState(false);
    const [selectedInventory, setSelectedInventory] = useState<FlattenedInventoryItem | null>(null);
    const [orderData, setOrderData] = useState<OrderItem[]>([]);
    const [update, setUpdate] = useState(false);
    const {business_id} = useParams();
    const [activeTab, setActiveTab] = useState<"Inventory" | "Order">("Inventory");

    useEffect(() => {
        const fetchInventoryData = async () => {
            try {
                const response = await api.get<Inventory[]>(`inventory/list-inventory/${business_id}`);
                const flattenedData: FlattenedInventoryItem[] = response.data
                    .map((inventory: Inventory) => {
                        return inventory.inventory_items.map((item: InventoryItem) => ({
                            ...item,
                            created_at: inventory.created_at,
                            created_by: inventory.created_by,
                            inventory_id: inventory.inventory_id,
                            supplier: inventory.supplier,
                        }));
                    })
                    .flat();
                setInventoryData(flattenedData);
                setFilteredData(flattenedData);
            } catch (error) {
                console.error("Error fetching inventory data:", error);
            }
        };

        const fetchOrderData = async () => {
            try {
                const response = await api.get<OrderItem[]>(`suppliers/list-order/${business_id}`);
                const formattedOrders = response.data.map((order: OrderItem) => ({
                    ...order,
                    delivery_date: formatDate(order.delivery_date),
                    amount_due_date: formatDate(order.amount_due_date),
                }));
                setOrderData(formattedOrders);
            } catch (error) {
                console.error("Error fetching order data:", error);
            }
        };

        fetchInventoryData();
        fetchOrderData();
    }, [business_id, update]);

    useEffect(() => {
        setFilteredData(
            inventoryData.filter(
                (item) =>
                    item.supplier.toLowerCase().includes(searchText.toLowerCase()) ||
                    item.item.toLowerCase().includes(searchText.toLowerCase()) ||
                    item.category.toLowerCase().includes(searchText.toLowerCase())
            )
        );
    }, [searchText]);

    const inventoryColumns = [
        {key: "item", header: "Item"},
        {key: "category", header: "Category"},
        {key: "quantity", header: "Quantity"},
        {key: "buying_price", header: "Buying Price"},
        {key: "selling_price", header: "Selling Price"},
        {key: "supplier", header: "Suppliers"},
        {key: "action", header: "Actions"},
    ];

    const orderColumns = [
        {key: "supplier_name", header: "Supplier"},
        {key: "delivery_date", header: "Delivery Date"},
        {key: "amount_ordered", header: "Ordered amount"},
        {key: "amount_paid", header: "Paid amount"},
        {key: "amount_due_date", header: "Amount Due-date"},
        {key: "order_status", header: "Order status"},
    ];

    const handleViewClick = (selectedInventory: FlattenedInventoryItem) => {
        setSelectedInventory(selectedInventory);
        setModalType("View");
        setShowInventoryModal(true);
    };

    const handleEditClick = (selectedInventory: FlattenedInventoryItem) => {
        setSelectedInventory(selectedInventory);
        setModalType("Edit");
        setShowInventoryModal(true);
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

    const totalPages = Math.ceil(filteredData.length / rowsPerPage);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const startRow = (currentPage - 1) * rowsPerPage;
    const endRow = startRow + rowsPerPage;
    const currentInventoryData = filteredData.slice(startRow, endRow);
    const currentOrderData = orderData.slice(startRow, endRow);

    return (
        <div className="container-fluid">
            <div className="button-container">
                <Button
                    onClick={() => setShowOrderModal(true)}
                    variant="dark"
                    className="buttonWithPadding"
                >
                    <FeatherIcon className={"action-icons me-2"} icon={"plus"}/>
                    Create Order
                </Button>
                <Button
                    onClick={() => {
                        setModalType("Add");
                        setShowInventoryModal(true);
                    }}
                    variant="dark"
                    className="me-2 buttonWithPadding"
                    type="button"
                >
                    <FeatherIcon className={"action-icons me-2"} icon={"plus"}/>
                    Create Inventory
                </Button>
            </div>
            <div className="search-and-tabs-container">
                <div className="tabs-container">
                    <div
                        className={`tab ${activeTab === "Inventory" ? "active" : ""}`}
                        onClick={() => setActiveTab("Inventory")}
                    >
                        Inventory
                    </div>
                    <div
                        className={`tab ${activeTab === "Order" ? "active" : ""}`}
                        onClick={() => setActiveTab("Order")}
                    >
                        Order
                    </div>
                </div>
                <SearchBar searchText={searchText} setSearchText={setSearchText}/>
            </div>

            {activeTab === "Inventory" && (
                <div>
                    <Table
                        data={currentInventoryData}
                        columns={inventoryColumns}
                        currentPage={currentPage}
                        rowsPerPage={rowsPerPage}
                        actions={actions}
                        emptyMessage="No inventory found"
                    />
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                    />
                </div>
            )}

            {activeTab === "Order" && (
                <div>
                    <Table
                        data={currentOrderData}
                        columns={orderColumns}
                        currentPage={currentPage}
                        rowsPerPage={rowsPerPage}
                        emptyMessage="No orders found"
                    />
                    <Pagination
                        currentPage={currentPage}
                        totalPages={Math.ceil(orderData.length / rowsPerPage)}
                        onPageChange={handlePageChange}
                    />
                </div>
            )}

            <CreateInventoryForm
                show={showInventoryModal}
                type={modalType}
                selectedInventory={selectedInventory}
                update={() => setUpdate(!update)}
                onHide={() => {
                    setShowInventoryModal(false);
                    setSelectedInventory(null);
                }}
            />
            <CreateOrderForm
                show={showOrderModal}
                type={modalType}
                onHide={() => setShowOrderModal(false)}
                update={() => setUpdate(!update)}
            />
        </div>
    );
}

export default Inventory;