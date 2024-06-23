'use client'

import React from 'react';

import ReportFaultForm from '@/components/ViewTicket/ViewTicketForm';
import NavbarUser from '@/components/Navbar/NavbarUser';

export default function CreateTicket() {

    return (
        <div>
            <NavbarUser />
            <main className="h-screen flex justify-center py-5">

                <div className="flex flex-row justify-evenly w-[70em] h-screen rounded-lg border-t-0 border shadow-lg shadow-blue-800/15">
                    <ReportFaultForm className="w-full h-full" />
                </div>

            </main>
        </div>
    );
}