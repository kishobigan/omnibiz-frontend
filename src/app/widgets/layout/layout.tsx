'use client'
import React, {ReactNode} from 'react';
import './layout.css';
import Sidebar from "@/app/widgets/sidebar/sidebar";
import {useParams} from "next/navigation";

interface LayoutProps {
    children: ReactNode;
    role: 'owner' | 'admin' | 'staff' | 'higher_staff';
}

function Layout({children, role}: LayoutProps) {
    const {user_id} = useParams();
    const userId = Array.isArray(user_id) ? user_id[0] : user_id;
    return (
        <div className='container-fluid'>
            <div className='row'>
                <div className='col-sm-2 navbar navbar-expand-sm sticky-top sidebar'>
                    <button className="navbar-toggler" type="button" data-bs-toggle="offcanvas"
                            data-bs-target="#navbarSupportedContent"
                            aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className='offcanvas offcanvas-start w-75 bg_color' id='navbarSupportedContent'>
                        <div className='offcanvas-header bg_color'>
                            <button type='button' className='btn-close text-reset text-white'
                                    data-bs-dismiss="offcanvas"
                                    aria-label="Close">
                            </button>
                        </div>
                        <div className='offcanvas-body'>
                            <Sidebar userId={userId} role={role}/>
                        </div>
                    </div>
                </div>
                <div className='col-sm-10 vh-100 gradient-bg'>
                    <div className='mt-0'>
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Layout;