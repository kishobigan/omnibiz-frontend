"use client";
import React from "react";
import Background from "@/app/components/background/background";
import CreateOwner from "@/app/components/createOwner/createOwner";

const createOwner = () => {
    return (
        <div>
            <Background
                backgroundImage="/img/bg-1.svg"
                heading="Create Owner to the OmniBiz"
                className="bg-image"
            >
                <CreateOwner title="Create Owner" linkUrl="/pages/createOwner"/>
            </Background>
        </div>
    );
};

export default createOwner;
