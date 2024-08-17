'use client'
import React, {useEffect, useState} from "react";
import Card from "@/app/widgets/card/card";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEdit} from "@fortawesome/free-solid-svg-icons";
import CreateBusinessModal from "@/app/components/Business/createBusinessModal/createBusinessModal";
import CreateHigherStaff from "@/app/components/Business/createHigherStaff/createHigherStaff";
import FeatherIcon from "feather-icons-react";
import api from "@/app/utils/Api/api";
import {useParams, useRouter} from "next/navigation";
import Button from "@/app/widgets/Button/Button";

interface BusinessesProps {
    user_role: "owner" | "higher-staff";
}

const Businesses: React.FC<BusinessesProps> = ({user_role}) => {
    const [modalType, setModalType] = useState<"Add" | "Edit" | "View">("Add");
    const [showBusinessModal, setShowBusinessModal] = useState(false);
    const [showHigherStaffModal, setShowHigherStaffModal] = useState(false);
    const [selectedBusiness, setSelectedBusiness] = useState(null);
    const [selectedHigherStaff, setSelectedHigherStaff] = useState(null);
    const [update, setUpdate] = useState(false);

    const [businessData, setBusinessData] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const {user_id} = useParams();

    useEffect(() => {
        const fetchBusinessData = async () => {
            try {
                let businesses = [];
                if (user_role === "owner") {
                    const response = await api.get(`business/get-all-businesses/${user_id}`);
                    if (response.status === 200) {
                        businesses = Array.isArray(response.data) ? response.data : [response.data];
                    } else {
                        setError('Failed to fetch business data.');
                    }
                } else if (user_role === "higher-staff") {
                    const accessResponse = await api.get(`super/get-higher-staff-accesses/${user_id}`)
                    console.log("Access response higher-staff", accessResponse)
                    if (accessResponse.status === 200) {
                        const businessIds = accessResponse.data
                        console.log("business ids of hs", businessIds)
                        for (const businessId of businessIds) {
                            const businessResponse = await api.get(`business/get-business/${businessId}`)
                            console.log("business response of every business", businessResponse)
                            if (businessResponse.status === 200) {
                                businesses.push(businessResponse.data)
                            }
                        }
                    } else {
                        setError('Failed to fetch business data.');
                    }
                }
                setBusinessData(businesses);
            } catch (error: any) {
                setError('An error occurred while fetching business data.');
            } finally {
                setLoading(false);
            }
        };

        fetchBusinessData();
    }, [update, user_id]);

    const handleBusinessNavigate = (businessId: string) => {
        let url = ''
        if (user_role === 'owner') {
            url = `/pages/dashboard/busi/${user_id}/${businessId}`
        } else if (user_role === 'higher-staff') {
            url = `/pages/higher-staff/busi/${user_id}/${businessId}`
        }
        router.push(url)
    };
    if (error) return <p className='error'>{error}</p>;

    return (
        <div className="container-fluid mt-5">
            <h4>Businesses</h4>
            <div className="button-container d-flex justify-content-end mb-5 mt-3">
                {user_role === "owner" && (
                    <>
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
                    </>
                )}
            </div>
            <div className="row">
                {businessData.length > 0 ? businessData.map((business, index) => (
                    <div key={index} className="col-lg-4 col-md-6 col-sm-6 col-12 mb-5">
                        <div onClick={() => handleBusinessNavigate(business.business_id)}>
                            <Card
                                className="cardWithBorderRadius shadow"
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
                                        className='text-white'
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
    )
};

export default Businesses;


