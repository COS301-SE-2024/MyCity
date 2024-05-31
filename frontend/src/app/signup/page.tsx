'use client'

import React, { Key, useState } from "react";
import { Tabs, Tab } from "@nextui-org/react";

import CitizenSignup from "@/components/SignUp/CitizenSignUp";
import MunicipalitySignup from "@/components/SignUp/MunicipalitySignUp";
import OrganizationSignup from "@/components/SignUp/OrganizationSignUp";



export default function Signup() {
    const headers: string[] = ["Get Connected.", "Take Control.", "Be The Change."];
    const [currentFormHeader, setCurrentFormHeader] = useState(headers[0]);


    const handleTabChange = (key: Key) => {
        const index = Number(key);
        setCurrentFormHeader(headers[index]);
    };


    return (
        <main className="h-screen flex flex-col items-center p-24">

            <span className="text-[2.5em] font-bold">{currentFormHeader}</span>

            <Tabs aria-label="Signup Options" defaultSelectedKey={"citizen"} className="mt-5" onSelectionChange={handleTabChange}>
                <Tab key={0} title="Citizen">
                    <CitizenSignup />
                </Tab>

                <Tab key={1} title="Municipality">
                    <MunicipalitySignup />
                </Tab>

                <Tab key={2} title="Organization">
                    <OrganizationSignup />
                </Tab>
            </Tabs>

        </main>
    );
}
