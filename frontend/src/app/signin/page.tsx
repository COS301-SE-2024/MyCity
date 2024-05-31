'use client'

import { Tabs, Tab } from "@nextui-org/react";
import CitizenSignIn from "@/components/SignIn/CitizenSignIn";
import MunicipalitySignIn from "@/components/SignIn/MunicipalitySignIn";
import ServiceProviderSignIn from "@/components/SignIn/ServiceProviderSignIn";


export default function Signup() {
    const formHeader: string = "Sign In.";

    return (
        <main className="h-screen flex justify-center p-20">

            <div className="flex flex-col items-center justify-center rounded-lg border-t-0 border shadow-lg shadow-orange-800/15 w-[32em] h-fit py-12">

                <span className="text-[2.5em] font-bold">{formHeader}</span>

                <Tabs aria-label="Signup Options" defaultSelectedKey={0} className="mt-5 flex justify-center w-full" classNames={{
                    tab: "min-w-32 min-h-10",
                    panel: "w-full",
                    cursor: "w-full bg-orange-200/20 border-3 border-orange-700/40",
                    tabContent: "group-data-[selected=true]:font-bold group-data-[selected=true]:dop-shadow-md"
                }}>
                    <Tab key={0} title="Citizen">
                        <CitizenSignIn />
                    </Tab>

                    <Tab key={1} title="Municipality" >
                        <MunicipalitySignIn />
                    </Tab>

                    <Tab key={2} title="Service Provider" >
                        <ServiceProviderSignIn />
                    </Tab>
                </Tabs>

            </div>
        </main>
    );
}
