'use client'

import React, { Key, useState } from "react";
import { Tabs, Tab } from "@nextui-org/react";

import CitizenSignup from "@/components/Signup/CitizenSignup";
import MunicipalitySignup from "@/components/Signup/MunicipalitySignup";
import ServiceProviderSignup from "@/components/Signup/ServiceProviderSignup";
import Navbar from "@/components/Navbar/Navbar";




export default function Signup() {
    const headers: string[] = ["Get Connected.", "Take Control.", "Be The Change."];
    const [currentFormHeader, setCurrentFormHeader] = useState(headers[0]);


    const handleTabChange = (key: Key) => {
        const index = Number(key);
        setCurrentFormHeader(headers[index]);
    };


    return (
        <div>

            <Navbar />

            <main className="h-screen flex justify-center p-20">

                <div className="flex flex-col items-center justify-center rounded-lg border-t-0 border shadow-lg shadow-blue-800/15 w-[32em] h-fit py-12">

                    <span className="text-[2.5em] font-bold">{currentFormHeader}</span>

                    <Tabs aria-label="Signup Options" defaultSelectedKey={0} className="mt-5 flex justify-center w-full" classNames={{
                        tab: "min-w-32 min-h-10",
                        panel: "w-full",
                        cursor: "w-full bg-blue-200/20 border-3 border-blue-700/40",
                        tabContent: "group-data-[selected=true]:font-bold group-data-[selected=true]:dop-shadow-md"
                    }} onSelectionChange={handleTabChange}>
                        <Tab key={0} title="Citizen" data-testid="citizen-tab">
                            <CitizenSignup />
                        </Tab>

                        <Tab key={1} title="Municipality" data-testid="municipality-tab">
                            <MunicipalitySignup />
                        </Tab>

                        <Tab key={2} title="Service Provider" data-testid="service-provider-tab">
                            <ServiceProviderSignup />
                        </Tab>
                    </Tabs>

                </div>
            </main>
        </div>
    );
}
