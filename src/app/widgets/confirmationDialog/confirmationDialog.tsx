import React from 'react';
import {Modal} from 'react-bootstrap';
import Button from "@/app/widgets/Button/Button";

interface ConfirmationDialogProps {
    show: boolean;
    onHide: () => void;
    onConfirm: () => void;
    message: string;
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({ show, onHide, onConfirm, message }) => {
    return (
        <Modal
            show={show}
            onHide={onHide}
            aria-labelledby="contained-modal-title-vcenter"
            centered
            backdrop="static"
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Confirmation
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>{message}</p>
            </Modal.Body>
            <Modal.Footer>
                <Button type='button' variant='light' onClick={onHide}>
                    No
                </Button>
                <Button type='button' variant='dark' onClick={onConfirm}>
                    Yes
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ConfirmationDialog;

