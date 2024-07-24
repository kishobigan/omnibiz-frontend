import React from "react";
import Button from "@/app/widgets/Button/Button";

interface ModalProps {
    title: string;
    buttonName: string;
    body: React.ReactNode;
    show: boolean;
    handleClose: () => void;
    handleSubmit: () => void;
}

const Modal: React.FC<ModalProps> = ({title, body, buttonName, show, handleClose, handleSubmit}) => {
    return (
        <>
            <div className={`modal fade ${show ? 'show' : ''}`} id="exampleModalToggle" aria-hidden={!show}
                 aria-labelledby="exampleModalToggleLabel" style={{display: show ? 'block' : 'none'}} tabIndex={-1}>
                <div className="modal-dialog modal-dialog-centered modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalToggleLabel">{title}</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"
                                    onClick={handleClose}></button>
                        </div>
                        <div className="modal-body">{body}</div>
                        <div className="modal-footer">
                            <Button type='button' variant='light' onClick={handleClose}>Close</Button>
                            <Button type='submit' variant='dark' onClick={handleSubmit}>{buttonName}</Button>
                        </div>
                    </div>
                </div>
            </div>
            {show && <div className="modal-backdrop fade show"></div>}
        </>
    );
};

export default Modal;
