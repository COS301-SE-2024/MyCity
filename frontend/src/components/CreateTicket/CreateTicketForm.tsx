'use client'

import React, { useState, useEffect, FormEvent } from 'react';
import { Input, Autocomplete, AutocompleteItem, Textarea, Checkbox } from '@nextui-org/react';
import { BadgeAlert } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface ReportFaultFormProps extends React.HTMLAttributes<HTMLElement> {}

type FaultType = {
    name: string;
    icon: string;
    multiplier: number;
};

export default function ReportFaultForm({ className }: ReportFaultFormProps) {
    const [faultType, setFaultType] = useState('');
    const [faultTypes, setFaultTypes] = useState<FaultType[]>([]);
    const [streetAddress, setStreetAddress] = useState('');
    const [suburb, setSuburb] = useState('');
    const [city, setCity] = useState('');

    useEffect(() => {
        async function fetchFaultTypes() {
            try {
                const response = await fetch('/tickets/fault-types', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                console.log('Response:', response);
                const data = await response.json();
                console.log('Data from backend:', data);

                setFaultTypes(data.map((item: any) => ({
                    name: item.asset_id,  // asset_id is used as the unique name
                    icon: item.assetIcon,
                    multiplier: item.multiplier,
                })));

            } catch (error) {
                console.error('Error fetching fault types:', error);
            }
        }

        fetchFaultTypes();
    }, []);

    const handleSubmit = (event: FormEvent) => {
        event.preventDefault();
        // Handle form submission
    };

    return (
        <div className={cn("", className)}>
            <div className="py-8 flex flex-col items-center justify-center">
                <span className="text-[2.5em] font-bold">Create a Fault Ticket</span>
                <div className="px-10 w-full">
                    <form onSubmit={handleSubmit} className="flex flex-col gap-y-8 pt-8">
                        <Autocomplete
                            label={<span className="font-semibold text-medium">Fault type <sup className="text-blue-500">*</sup></span>}
                            labelPlacement="outside"
                            placeholder="Fault Type"
                            fullWidth
                            items={faultTypes}
                            disableSelectorIconRotation
                            isClearable={false}
                            menuTrigger={"input"}
                            size={"lg"}
                            type="text"
                            autoComplete="new-fault"
                            onChange={(event) => setFaultType(event.target.value)}
                        >
                            {(faultType) => (
                                <AutocompleteItem key={faultType.name} textValue={faultType.name}>
                                    <div className="flex gap-2 items-center">
                                        <img src={faultType.icon} alt={faultType.name} className="flex-shrink-0 w-6 h-6" />
                                        <span className="text-small">{faultType.name}</span>
                                    </div>
                                </AutocompleteItem>
                            )}
                        </Autocomplete>

                        <Textarea
                            label={<span className="font-semibold text-medium">Description</span>}
                            labelPlacement="outside"
                            placeholder="Add Description..."
                        />

                        <div>
                            <span className="font-semibold text-medium">Address <sup className="text-blue-500">*</sup></span>
                            <div className="flex flex-col gap-y-5">
                                <Input
                                    variant={"bordered"}
                                    fullWidth
                                    classNames={{
                                        inputWrapper: "h-[3em]",
                                    }}
                                    type="text"
                                    autoComplete="new-address"
                                    placeholder="Street Address"
                                    value={streetAddress}
                                    onChange={(e) => setStreetAddress(e.target.value)}
                                />
                                <Input
                                    variant={"bordered"}
                                    fullWidth
                                    classNames={{
                                        inputWrapper: "h-[3em]",
                                    }}
                                    type="text"
                                    autoComplete="new-suburb"
                                    placeholder="Suburb"
                                    value={suburb}
                                    onChange={(e) => setSuburb(e.target.value)}
                                />
                                <Input
                                    variant={"bordered"}
                                    fullWidth
                                    classNames={{
                                        inputWrapper: "h-[3em]",
                                    }}
                                    type="text"
                                    autoComplete="new-city"
                                    placeholder="City/Town"
                                    value={city}
                                    onChange={(e) => setCity(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="m-auto flex items-center">
                            <span className="text-medium font-semibold">Use current location as Fault Location? </span>
                            <Checkbox className="ms-2.5" size={"lg"} radius="sm"></Checkbox>
                        </div>

                        <Link href="/dashboard">
                            <div className="bg-blue-500 text-white px-4 py-2 rounded-3xl cursor-pointer hover:bg-blue-200 transition duration-300 text-center font-bold w-max mx-auto mt-4">
                                Submit
                            </div>
                        </Link>
                    </form>
                </div>
            </div>
        </div>
    );
}
