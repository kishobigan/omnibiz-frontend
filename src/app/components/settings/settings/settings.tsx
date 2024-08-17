import React from 'react';
import UpdateOwner from '@/app/components/settings/updateOwner/updateOwner';
import ChangePassword from '@/app/components/settings/changePassword/changePassword';
import './settings.css';

const Settings: React.FC = () => {
    return (
        <div className="settings-container">
            <div className="settings-content">
                <div className="form-box update-owner-container">
                    <UpdateOwner/>
                </div>
                <div className="form-box change-password-container">
                    <ChangePassword/>
                </div>
            </div>
        </div>
    );
}

export default Settings;
