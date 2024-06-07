'use client'

import React from 'react';

import ReportFaultMap from '@/components/Faults/ReportFaultMap';
import ReportFaultForm from '@/components/Faults/ReportFaultForm';
import NavbarWhite from "@/components/Navbar/NavbarWhite";

export default function ReportFault() {

    return (
        <div>
            <NavbarWhite />
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