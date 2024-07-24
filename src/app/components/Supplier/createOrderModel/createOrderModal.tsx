'use client'
import React, { useState, useRef } from "react";
import Modal from "@/app/widgets/modal/Modal";
import Button from "@/app/widgets/Button/Button";
import CreateOrder from "@/app/components/Supplier/createOrderModel/createOrderForm/createOrder";

interface OrderCreateProps {
    setOrderData: React.Dispatch<React.SetStateAction<any[]>>;
}

const CreateOrderModal: React.FC<OrderCreateProps> = ({ setOrderData }) => {
    const [showModal, setShowModal] = useState(false);
    const [modalTitle, setModalTitle] = useState("");

    const formSubmitRef = useRef<{ submitForm: () => void }>(null);

    const handleOpenModal = (title: string) => {
        setModalTitle(title);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setModalTitle("");
    };

    const handleSubmitModal = (newOrder: any) => {
        setOrderData((prevData) => [...prevData, newOrder]);
        handleCloseModal();
    };
    return (
        <div>
            <div>
                <Button
                    onClick={() => handleOpenModal("Create Order")}
                    variant="dark"
                >
                    Create Order
                </Button>
            </div>
            <Modal
                title={modalTitle}
                body={<CreateOrder onSubmit={handleSubmitModal} />}
                buttonName={modalTitle}
                show={showModal}
                handleClose={handleCloseModal}
                handleSubmit={() => formSubmitRef.current?.submitForm()}
            />
        </div>
    );
};

export default CreateOrderModal;