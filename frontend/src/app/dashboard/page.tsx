'use client'

import Nav from "@/components/Navbar/nav";
import React, { Key, useState } from "react";
import { Tabs, Tab } from "@nextui-org/react";
import FaultCardUser from "@/components/FaultCardUser/FaultCardUser";
import FaultCardContainer from "@/components/FaultCardContainer/FaultCardContainer";


export default function Home() {
    const [currentIndex, setCurrentIndex] = useState(0);

    // Dummy data or components for the carousel
    const carouselItems = [
        <FaultCardUser key={1} />,
        <FaultCardUser key={2} />,
        <FaultCardUser key={3} />,
        // Add more FaultCardUser components as needed
    ];

    const nextSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex === carouselItems.length - 1 ? 0 : prevIndex + 1));
    };

    const prevSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex === 0 ? carouselItems.length - 1 : prevIndex - 1));
    };

    const handleTabChange = (key: Key) => {
        const index = Number(key);
    };

    return (
        <div>
            <Nav />
            <h1 className="text-4xl font-bold mb-2 mt-2 ml-2">
                Dashboard
            </h1>
            <h2 className="text-3xl font-bold mt-2 ml-2 text-orange-700">
                Jane Doe
            </h2>
            <div className="flex flex-col items-center justify-center rounded-lg h-fit py-1">

                <Tabs aria-label="Signup Options" defaultSelectedKey={0} className="mt-5 flex justify-center w-full" classNames={{
                    tab: "min-w-32 min-h-10",
                    panel: "w-full",
                    cursor: "w-full bg-orange-200/20 border-3 border-orange-700/40",
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
                    </Tab>

                    <Tab key={1} title="List" >

                    </Tab>

                    <Tab key={2} title="Map" >

                    </Tab>
                </Tabs>
            </div>
        </div>
    );
}