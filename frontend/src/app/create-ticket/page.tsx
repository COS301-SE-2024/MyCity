'use client'

import React from 'react';

import CreateTicketMap from '@/components/CreateTicket/CreateTicketMap';
import CreateTicketForm from '@/components/CreateTicket/CreateTicketForm';
import { useMapbox } from '@/context/MapboxContext';
import Navbar from '@/components/Navbar/Navbar';

export default function CreateTicket() {
    return (
        <div>
            <Navbar />
            <main className="h-screen flex justify-center py-5">

                <div className="flex flex-row justify-evenly w-[70em] h-screen rounded-lg border-t-0 border shadow-lg shadow-blue-800/15">
                    <CreateTicketForm useMapboxProp={useMapbox} className="w-full h-full" />
                </div>
                <div className="flex flex-row justify-evenly w-[70em] h-screen rounded-lg border-t-0 border shadow-lg shadow-blue-800/15">
                    <CreateTicketMap useMapboxProp={useMapbox} className="w-full h-full" />
                </div>
            </main>

        </div>
    );
}