'use client'

import React, { useState, useEffect, FormEvent } from 'react';
import { Input, Autocomplete, AutocompleteItem, Textarea, Checkbox } from '@nextui-org/react';
import { BadgeAlert, Ticket } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import Image from 'next/image';
import { useProfile } from "@/hooks/useProfile";
import { getTicket } from '@/services/tickets.service';

interface ReportFaultFormProps extends React.HTMLAttributes<HTMLElement> {}

type ticket = {
    Upvotes: Number,  // asset_id is used as the unique name
    FaultType: String,
    Description: String 
};

export default function ReportFaultForm({ className }: ReportFaultFormProps) {
    const [faultType, setFaultType] = useState('');
    const userProfile = useProfile();
    const [ticketdata, setTicketData] = useState<ticket[]>([]);
    const [streetAddress, setStreetAddress] = useState('');
    const [suburb, setSuburb] = useState('');
    const [city, setCity] = useState('');
    const [ticket_id, setTicket] = useState(''); 
    

    async function fetchticketdata() {
        try {
            const user_data = await userProfile.getUserProfile();
            const user_session = String(user_data.current?.session_token);
            const data = await getTicket(ticket_id, user_session);
    
            if (data) {
                console.log(data);
    
                setTicketData(data.map((item: any) => ({
                    Upvotes: item.upvotes,  // asset_id is used as the unique name
                    FaultType: item.asset_id,
                    Description: item.description                    
                })));
            } else {
                console.error('No data received from getTicket');
            }
        } catch (error) {
            console.error('Error fetching fault types:', error);
        }
    }
    

    const handleSubmit = (event: FormEvent) => {
        event.preventDefault();
        // Handle form submission
        fetchticketdata();  
        console.log("Ticket Data to follow");
        console.log(ticketdata);
    };

    return (
        <div className={cn("", className)}>
            <div className="py-8 flex flex-col items-center justify-center">
                <span className="text-[2.5em] font-bold">Create a Fault Ticket</span>
                <div className="px-10 w-full">
                    <form onSubmit={handleSubmit} className="flex flex-col gap-y-8 pt-8">
                        <Input
                            variant={"bordered"}
                            fullWidth
                            classNames={{
                                inputWrapper: "h-[3em]",
                            }}
                            type="text"
                            value={ticket_id}
                            onChange={(e) => setTicket(e.target.value)}
                        />

                        <button
                            className="bg-blue-500 text-white px-4 py-2 rounded-3xl cursor-pointer hover:bg-blue-200 transition duration-300 text-center font-bold w-max mx-auto mt-4"
                            type="submit"
                            onClick={handleSubmit}
                        >
                            Submit
                        </button>

                    </form>
                </div>
            </div>
        </div>
    );
}
