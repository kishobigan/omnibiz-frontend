"use client";
import React, { useState } from "react";
import CreateInventoryForm from "@/app/components/Inventory/createInventoryForm/createInventory";
import DashboardLayout from "@/app/widgets/dashboardLayout/dashboardLayout";

const role = "owner"

const CreateInventory: React.FC = () => {
  return (
    // <DashboardLayout role={role}>
    //         <CreateInventoryForm type="Add" />
    // </DashboardLayout>
    <div className="container mt-5 col-md-8">
      <CreateInventoryForm type="Add" />
    </div>
  );
};

export default CreateInventory;
