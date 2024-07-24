'use client'
import React, {useEffect, useState} from "react";
import Card from "@/app/widgets/card/card";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEdit} from "@fortawesome/free-solid-svg-icons";
import CreateBusinessModal from "@/app/components/Business/createBusinessModal/createBusinessModal";
import CreateHigherStaff from "@/app/components/Business/createHigherStaff/createHigherStaff";
import FeatherIcon from "feather-icons-react";
import api from "@/app/utils/Api/api";
import Loader from "@/app/widgets/loader/loader";
import {useParams, useRouter} from "next/navigation";
import Button from "@/app/widgets/Button/Button";

const Businesses = () => {
    const [modalType, setModalType] = useState<"Add" | "Edit" | "View">("Add");
    const [showBusinessModal, setShowBusinessModal] = useState(false);
    const [showHigherStaffModal, setShowHigherStaffModal] = useState(false);
    const [selectedBusiness, setSelectedBusiness] = useState(null);
    const [selectedHigherStaff, setSelectedHigherStaff] = useState(null);
    const [update, setUpdate] = useState(false);

    const [businessData, setBusinessData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const {user_id} = useParams();

    useEffect(() => {
        const fetchBusinessData = async () => {
            try {
                const response = await api.get(`business/get-all-businesses/${user_id}`);
                if (response.status === 200) {
                    const data = Array.isArray(response.data) ? response.data : [response.data];
                    setBusinessData(data);
                } else {
                    setError('Failed to fetch business data.');
                }
            } catch (error: any) {
                setError('An error occurred while fetching business data.');
            } finally {
                setLoading(false);
            }
        };

        fetchBusinessData();
    }, [update, user_id]);

    const handleBusinessNavigate = (businessId: string) => {
        router.push(`/pages/dashboard/busi/${user_id}/${businessId}`);
    };

    if (loading) return <Loader/>;
    if (error) return <p className='error'>{error}</p>;

    return (
        <div className="container-fluid mt-5">
            <h4>Businesses</h4>
            <div className="button-container d-flex justify-content-end mb-5 mt-3">
                <Button
                    onClick={() => {
                        setModalType("Add");
                        setShowBusinessModal(true);
                    }}
                    variant="dark"
                    className="me-2 buttonWithPadding"
                    type="button"
                >
                    <FeatherIcon className={"action-icons me-2"} icon={"plus"}/>
                    Create Business
                </Button>
                <Button
                    onClick={() => {
                        setModalType("Add");
                        setShowHigherStaffModal(true);
                    }}
                    variant="dark"
                    className="me-2 buttonWithPadding"
                    type="button"
                >
                    <FeatherIcon className={"action-icons me-2"} icon={"plus"}/>
                    Create Higher-Staff
                </Button>
            </div>
            <div className="row d-flex justify-content-center">
                {businessData.length > 0 ? businessData.map((business, index) => (
                    <div key={index} className="col-md-3 mx-auto mb-4">
                        <div onClick={() => handleBusinessNavigate(business.business_id)}>
                            <Card
                                className="cardWithBorderRadius"
                                title={business.business_name}
                                body={
                                    <div className="mb-2">
                                        <p><b>Initial: </b>{business.initial}</p>
                                        <p><b>Address: </b>{business.business_address}</p>
                                    </div>
                                }
                                logo={business.logo}
                                actions={
                                    <FontAwesomeIcon
                                        icon={faEdit}
                                        style={{cursor: "pointer"}}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setSelectedBusiness(business);
                                            setModalType("Edit");
                                            setShowBusinessModal(true);
                                        }}
                                    />
                                }
                                style={{cursor: 'pointer'}}
                            />
                        </div>
                    </div>
                )) : <p className='fw-bold'>No business found.</p>}
            </div>
            <CreateBusinessModal
                show={showBusinessModal}
                type={modalType}
                selectedBusiness={selectedBusiness}
                update={() => setUpdate(!update)}
                onHide={() => {
                    setShowBusinessModal(false);
                    setSelectedBusiness(null);
                }}
            />
            <CreateHigherStaff
                show={showHigherStaffModal}
                type={modalType}
                selectedHigherStaff={selectedHigherStaff}
                update={() => setUpdate(!update)}
                onHide={() => {
                    setShowHigherStaffModal(false);
                    setSelectedHigherStaff(null);
                }}
            />
        </div>
    );
};

export default Businesses;


