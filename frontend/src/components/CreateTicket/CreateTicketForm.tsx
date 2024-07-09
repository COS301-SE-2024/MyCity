'use client'

import React, { FormEvent, useEffect, useState } from 'react';
import { AutocompleteItem, Textarea, Button, Autocomplete } from '@nextui-org/react';
import { cn } from '@/lib/utils';
import { MapboxContextProps } from '@/context/MapboxContext';

import { toast, ToastContainer } from 'react-toastify';

import { useProfile } from "@/hooks/useProfile";
import { FaultType } from '@/types/custom.types';
import { getFaultTypes, CreatTicket } from '@/services/tickets.service';



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
                const data = await getFaultTypes();
                console.log("Data recieved: ")
                console.log(data)
                if (data && data.length > 0)
                {
                    setFaultTypes(data);                    
                }
                else {
                    setFaultTypes([]);
                } 
                // setFaultTypes(data.map((item: any) => ({
                //     name: item.asset_id,  // asset_id is used as the unique name
                //     icon: item.assetIcon,
                //     multiplier: item.multiplier,
                // })));



            } catch (error) {
                console.error('Error fetching fault types:', error);
                setFaultTypes([]);
            }
        }

        fetchFaultTypes();
    }, []);


    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();
        const user_data = await getUserProfile();
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
        const params_data = {
            asset: selectedFault,
            description : faultDescription,
            latitude : latitude,
            longitude : longitude,
            username : userId,
        }

        try{
            const sessiont = user_data.current?.session_token || ' '
            const isCreated = await CreatTicket(sessiont,String(selectedFault),String(faultDescription),String(latitude),String(longitude),String(userId))
            if( isCreated == true)
            {
                toast.success("Ticket succesfully created");
            }
            else throw new Error(`HTTP! status: Error`)
        } catch(error)
        {
            console.error('Error:', error);
        }
        
    };



    return (
        <div className={cn("", className)}>
            <ToastContainer />

            <div className="py-8 flex flex-col items-center justify-center">

                <span className="text-[2.2rem] font-bold">Create a Fault Ticket</span>

                <div className="px-10 w-full">

                    <form onSubmit={handleSubmit} className="flex flex-col gap-y-8 pt-8">
                        {faultTypes.length > 0 ? (
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
                                    <AutocompleteItem key={faultType.asset_id} textValue={faultType.asset_id}>
                                        <div className="flex gap-2 items-center">
                                            <img src={faultType.assetIcon} alt={faultType.asset_id} width={6} height={6} className="flex-shrink-0 w-6 h-6" />
                                            <span className="text-small">{faultType.asset_id}</span>
                                        </div>
                                    </AutocompleteItem>
                                }
                            </Autocomplete>
                        ) : (
                            <p>Loading fault types...</p>
                        )}



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