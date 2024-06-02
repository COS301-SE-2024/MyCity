'use client'

import React from 'react';

import ReportFaultMap from '@/components/Faults/ReportFaultMap';
import ReportFaultForm from '@/components/Faults/ReportFaultForm';

export default function ReportFault() {

    return (
        <main className="h-screen flex justify-center py-10">

            <div className="flex flex-row justify-evenly w-[70em] h-full rounded-lg border-t-0 border shadow-lg shadow-orange-800/15">
                <ReportFaultForm className="w-[50%]" />
                <ReportFaultMap className="w-[50%]" />
            </div>

        </main>
    );
}