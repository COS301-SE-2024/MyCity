'use client'

import React, { Key, useState } from "react";
import { Tabs, Tab } from "@nextui-org/react";

import CitizenSignup from "@/components/SignUp/CitizenSignUp";
import MunicipalitySignup from "@/components/SignUp/MunicipalitySignUp";
import ServiceProviderSignup from "@/components/SignUp/ServiceProviderSignUp";



export default function Signup() {
    const headers: string[] = ["Get Connected.", "Take Control.", "Be The Change."];
    const [currentFormHeader, setCurrentFormHeader] = useState(headers[0]);


    const handleTabChange = (key: Key) => {
        const index = Number(key);
        setCurrentFormHeader(headers[index]);
    };


    return (
        <main className="h-screen flex justify-center p-20">

            <div className="flex flex-col items-center justify-center rounded-lg border-t-0 border shadow-lg shadow-orange-800/15 w-[32em] h-fit py-12">

                <span className="text-[2.5em] font-bold">{currentFormHeader}</span>

                <Tabs aria-label="Signup Options" defaultSelectedKey={0} className="mt-5 flex justify-center w-full" classNames={{
                    tab: "min-w-32 min-h-10",
                    panel: "w-full",
                    cursor: "w-full bg-orange-200/20 border-3 border-orange-700/40",
                    tabContent: "group-data-[selected=true]:font-bold group-data-[selected=true]:dop-shadow-md"
                }} onSelectionChange={handleTabChange}>
                    <Tab key={0} title="Citizen">
                        <CitizenSignup />
                    </Tab>

                    <Tab key={1} title="Municipality" >
                        <MunicipalitySignup />
                    </Tab>

                    <Tab key={2} title="Service Provider" >
                        <ServiceProviderSignup />
                    </Tab>
                </Tabs>

            </div>
        </main>
    );
}
