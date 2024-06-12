'use client'

import React from 'react';

import ReportFaultMap from '@/components/CreateTicket/CreateTicketMap';
import ReportFaultForm from '@/components/CreateTicket/CreateTicketForm';
import NavbarUser from '@/components/Navbar/NavbarUser';

export default function CreateTicket() {

    return (
        <div>
            <NavbarUser />
            <main className="h-screen flex justify-center py-5">

                <div className="flex flex-row justify-evenly w-[70em] h-screen rounded-lg border-t-0 border shadow-lg shadow-blue-800/15">
                    <ReportFaultForm className="w-full h-full" />
                </div>
                <div className="flex flex-row justify-evenly w-[70em] h-full rounded-lg border-t-0 border shadow-lg shadow-blue-800/15">
                    <ReportFaultMap className="w-full" />
                </div>

            </main>
        </div>
    );
}