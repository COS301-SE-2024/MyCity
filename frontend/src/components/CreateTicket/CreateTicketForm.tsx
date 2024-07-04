'use client'

import React, { FormEvent, useEffect, useState } from 'react';
import { AutocompleteItem, Textarea, Checkbox, Button, Autocomplete } from '@nextui-org/react';
import { cn } from '@/lib/utils';
import { MapboxContextProps } from '@/context/MapboxContext';
import axios from 'axios';
import Image from 'next/image';
import { useProfile } from "@/hooks/useProfile";


type FaultType = {
    name: string;
    icon: string;
    multiplier: number;
};

interface Props extends React.HTMLAttributes<HTMLElement> {
    useMapboxProp: () => MapboxContextProps;
}

export default function CreateTicketForm({ className, useMapboxProp }: Props) {
    const { selectedAddress } = useMapboxProp();
    const { getUserProfile } = useProfile();
    
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


    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();

        const form = new FormData(event.currentTarget as HTMLFormElement);

        //1. coordinates
        const latitude = selectedAddress?.lat;
        const longitude = selectedAddress?.lng;

        //2. form data
        const selectedFault = form.get("fault-type");
        const faultDescription = form.get("fault-description");

        if (!selectedFault) {
            console.log("Fault type is required!!");
        }

        //3. currently logged in user data
        const userData = await getUserProfile();

        if (!userData.current) {
            console.log("please log in if you wish to create a ticket.")
            return;
        }

        const userId = userData.current.sub;
        const givenName = userData.current.given_name;
        //can extract more user details as neeeded

        //to visualize all the data
        console.log("selected fault: ", selectedFault);
        console.log("fault description: ", faultDescription);
        console.log("user data: ", userData.current);
        console.log("selected address: ", selectedAddress);


        //**** make request to create ticket below ****
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
                                        <img src={faultType.icon} alt={faultType.name} width={6} height={6}  className="flex-shrink-0 w-6 h-6" />
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

                            <span className="font-semibold text-sm">Selected Address:</span>

                            <div className="flex flex-col gap-y-0.5 text-xs ps-2">

                                <span>{selectedAddress?.street?.name}</span>
                                {/* <span>Hatfield</span> */}
                                <span>{selectedAddress?.county}</span>
                                <span>{selectedAddress?.city}</span>
                                <span>{selectedAddress?.administrative}</span>

                            </div>

                        </div>


                        <Button type="submit" disabled={!selectedAddress} className="m-auto bg-blue-500 text-white w-24 px-4 py-2 font-bold rounded-3xl hover:bg-blue-600 transition duration-300">
                            Submit
                        </Button>

                    </form>
                </div>
            </div>
        </div>
    );
}