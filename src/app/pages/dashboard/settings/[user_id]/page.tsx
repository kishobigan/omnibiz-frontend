import React from 'react';
import Settings from "@/app/components/settings/settings/settings";
import Layout from "@/app/widgets/layout/layout";

const role = 'owner'

const settings = () => {
    return (
        <div>
            <Layout role={role}>
                <Settings/>
            </Layout>
        </div>
    );
}

export default settings;