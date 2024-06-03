'use client'

import React, { useState, FormEvent } from 'react';
import { Input, Button, Autocomplete, AutocompleteItem, Textarea, Checkbox } from '@nextui-org/react';
import { BadgeAlert } from 'lucide-react';
import { cn } from '@/lib/utils';


interface ReportFaultFormProps extends React.HTMLAttributes<HTMLElement> {

}


export default function ReportFaultForm({ className }: ReportFaultFormProps) {
    const [fault, setFault] = useState('');
    const [faultType, setFaultType] = useState('');
    const [streetAddress, setStreetAddress] = useState('');
    const [suburb, setSuburb] = useState('');
    const [city, setCity] = useState('');
    // const [verificationCode, setVerificationCode] = useState('123456');
    // const [showCode, setShowCode] = useState(false);



    type FaultType = {
        id: number | string;
        name: string;
    };




    const faultTypes: FaultType[] = [
        { id: 0, name: "Pothole" },
        { id: 1, name: "Transformer" },
        { id: 2, name: "Sewage" },
        { id: 2, name: "Burst Water Pipe" },
    ];

    const handleSubmit = (event: FormEvent) => {
        event.preventDefault();
        // console.log(`Province: ${province}, Fault: ${Fault}, Verification Code: ${verificationCode}`);
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
                            defaultItems={faultTypes}
                            disableSelectorIconRotation
                            isClearable={false}
                            menuTrigger={"input"}
                            size={"lg"}
                            type="text"
                            autoComplete="new-fault"
                            onChange={(event) => setFaultType(event.target.value)}
                        >
                            {(faultType) =>
                                <AutocompleteItem key={faultType.id} textValue={faultType.name}>
                                    <div className="flex gap-2 items-center">
                                        <BadgeAlert className="flex-shrink-0 text-blue-700" size={18} />
                                        <span className="text-small">{faultType.name}</span>
                                    </div>
                                </AutocompleteItem>}
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
                                    value={streetAddress} onChange={(e) => setStreetAddress(e.target.value)}
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
                                    value={suburb} onChange={(e) => setSuburb(e.target.value)}
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
                                    value={city} onChange={(e) => setCity(e.target.value)}
                                />

                            </div>
                        </div>


                        <div className="m-auto flex items-center">
                            <span className="text-medium font-semibold">Use current location as Fault Location? </span>
                            <Checkbox className="ms-2.5" size={"lg"} radius="sm"></Checkbox>
                        </div>



                        <Button className="w-28 h-11 rounded-lg m-auto bg-blue-500 text-white font-semibold" type="submit">
                            Submit
                        </Button>

                    </form>
                </div>
            </div>
        </div>
    );
}