"use client";
import React, { useState } from "react";
import CreateInventoryForm from "@/app/components/Inventory/createInventoryForm/createInventory";
import DashboardLayout from "@/app/widgets/dashboardLayout/dashboardLayout";
import Billing from "@/app/components/Billing/billing/billing";
import Supplier from "@/app/components/Supplier/supplier/supplier";
import Staff from "@/app/components/Staff/staff/staff";
import Inventory from "@/app/components/Inventory/inventory/inventory";
import Accounts from "@/app/components/accounts/accounts";
import ProtectedRoute from "@/app/utils/Routing/ProtectedRoute";

const role = "owner";
const tabItems = [
  { label: "Billing", component: <Billing /> },
  { label: "Supplier", component: <Supplier /> },
  { label: "Staffs", component: <Staff /> },
  { label: "Inventory", component: <Inventory /> },
  { label: "Accounts", component: <Accounts /> },
];

const CreateInventory: React.FC = () => {
  return (
    // <DashboardLayout role={role} tabItems={tabItems}>
    //         {/* <CreateInventoryForm type="Add" /> */}
    // </DashboardLayout>

    <ProtectedRoute>
      <DashboardLayout role={role} tabItems={tabItems}>
        <CreateInventoryForm type="Add" />
      </DashboardLayout>
    </ProtectedRoute>

    //   <div className="container mt-5 col-md-8">
    //   <CreateInventoryForm type="Add" />
    // </div>
  );
};

export default CreateInventory;
