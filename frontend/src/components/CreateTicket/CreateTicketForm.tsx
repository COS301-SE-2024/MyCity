'use client'

import React, { FormEvent, useEffect, useState } from 'react';
import { AutocompleteItem, Textarea, Checkbox, Button, Autocomplete } from '@nextui-org/react';
import { cn } from '@/lib/utils';
import { MapboxContextProps } from '@/context/MapboxContext';
import axios from 'axios';
import Image from 'next/image';




type FaultType = {
    name: string;
    icon: string;
    multiplier: number;
};



interface Props extends React.HTMLAttributes<HTMLElement> {
    useMapboxProp: () => MapboxContextProps;
}



export default function CreateTicketForm({ className, useMapboxProp }: Props) {
    const { panToCurrentLocation } = useMapboxProp();


    const [faultTypes, setFaultTypes] = useState<FaultType[]>([]);

    useEffect(() => {
        async function fetchFaultTypes() {
            try {
                const response = await axios.get('https://f1ihjeakmg.execute-api.af-south-1.amazonaws.com/api/tickets/fault-types', {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                const data = await response.data;

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

        const form = new FormData(event.currentTarget as HTMLFormElement);


    };


    const handleCheckboxChange = (isSelected: boolean) => {
        if (isSelected) {
            panToCurrentLocation();
        }
    };



    return (
        <div className={cn("", className)}>

            <div className="py-8 flex flex-col items-center justify-center">

                <span className="text-[2.2rem] font-bold">Create a Fault Ticket</span>

                <div className="px-10 w-full">

                    <form onSubmit={handleSubmit} className="flex flex-col gap-y-8 pt-8">

                        <Autocomplete
                            label={<span className="font-semibold text-sm">Fault type <sup className="text-blue-500">*</sup></span>}
                            labelPlacement="outside"
                            name="fault-type"
                            placeholder="Fault Type"
                            fullWidth
                            defaultItems={faultTypes}
                            disableSelectorIconRotation
                            isClearable={false}
                            menuTrigger={"input"}
                            size={"lg"}
                            type="text"
                            autoComplete="new-fault"
                        >
                            {(faultType) =>
                                <AutocompleteItem key={faultType.name} textValue={faultType.name}>
                                    <div className="flex gap-2 items-center">
                                        <Image src={faultType.icon} alt={faultType.name} width={6} height={6} className="flex-shrink-0 w-6 h-6" />
                                        <span className="text-small">{faultType.name}</span>
                                    </div>
                                </AutocompleteItem>
                            }
                        </Autocomplete>



                        <Textarea
                            label={<span className="font-semibold text-sm">Description</span>}
                            labelPlacement="outside"
                            name="fault-description"
                            placeholder="Add Description..."
                        />

                        <div>
                            {/* <span className="font-semibold text-medium">Address <sup className="text-blue-500">*</sup></span> */}
                            <span className="font-semibold text-sm">Selected Address:</span>

                            <div className="flex flex-col gap-y-0.5 text-xs ps-2">
                                <span>42 Jane Street</span>
                                <span>Hatfield</span>
                                <span>Pretoria</span>
                                <span>Gauteng</span>
                            </div>

                        </div>


                        <div className="m-auto flex items-center">
                            <span className="text-medium font-semibold">Use current location as Fault Location? </span>
                            <Checkbox className="ms-2.5" size={"lg"} radius="sm" onValueChange={handleCheckboxChange}></Checkbox>
                        </div>


                        <Button type="submit" className="m-auto bg-blue-500 text-white w-24 px-4 py-2 font-bold rounded-3xl hover:bg-blue-600 transition duration-300">
                            Submit
                        </Button>

                    </form>
                </div>
            </div>
        </div>
    );
}