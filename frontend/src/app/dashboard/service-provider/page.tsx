'use client'


import React, { Key } from "react";
import { Tabs, Tab } from "@nextui-org/react";
import FaultCardContainer from "@/components/FaultCardContainer/FaultCardContainer";
import FaultTable from "@/components/FaultTable/FaultTable";
import FaultMapView from "@/components/FaultMapView/FaultMapView";

export default function ServiceProviderDashboard() {

    const handleTabChange = (key: Key) => {
        const index = Number(key);
    };

    return (
        <div>

            

            <main>

                <h1 className="text-4xl font-bold mb-2 mt-2 ml-2">
                    Service Provider Dashboard
                </h1>
                <h2 className="text-3xl font-bold mt-2 ml-2 text-blue-700">
                    Bob&apos;s Electronics
                </h2>

                <div className="hidden">

                    <div className="flex flex-col items-center justify-center rounded-lg h-fit py-1">

                        <Tabs aria-label="Signup Options" defaultSelectedKey={0} className="mt-5 flex justify-center w-full" classNames={{
                            tab: "min-w-32 min-h-10",
                            panel: "w-full",
                            cursor: "w-full bg-blue-200/20 border-3 border-blue-700/40",
                            tabContent: "group-data-[selected=true]:font-bold group-data-[selected=true]:dop-shadow-md"
                        }} onSelectionChange={handleTabChange}>
                            <Tab key={0} title="Cards">
                                <h1 className="text-2xl font-bold mt-2 ml-2">
                                    Most up-voted
                                </h1>
                                <h1 className="text-l mb-4 ml-2">
                                    Based on votes from the community in your area.
                                </h1>
                                <FaultCardContainer />
                                <h1 className="text-2xl font-bold mt-2 ml-2">
                                    Nearest to you
                                </h1>
                                <h1 className="text-l mb-4 ml-2">
                                    Based on your proximity to the issue.
                                </h1>
                                <FaultCardContainer />
                                <h1 className="text-2xl font-bold mt-2 ml-2">
                                    Watchlist
                                </h1>
                                <h1 className="text-l mb-4 ml-2">
                                    All of the issues you have added to your watchlist.
                                </h1>
                                <FaultCardContainer />
                            </Tab>

                            <Tab key={1} title="List" >
                                <FaultTable tableitems={[]} />
                            </Tab>

                            <Tab key={2} title="Map" >
                                <h1 className="text-4xl font-bold mb-4 mt-2 ml-2 text-center">
                                    Pretoria
                                </h1>
                                <FaultMapView />
                            </Tab>
                        </Tabs>
                    </div>
                </div>
            </main>
        </div>
    );
}