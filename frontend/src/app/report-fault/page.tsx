'use client'

import React, { useState } from 'react';
import { Input, Button, Autocomplete, AutocompleteItem, Textarea, Checkbox } from '@nextui-org/react';
import { BadgeAlert } from 'lucide-react';

export default function ReportFault() {
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

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        // console.log(`Province: ${province}, Fault: ${Fault}, Verification Code: ${verificationCode}`);
    };

    return (
        <main className="h-screen flex justify-center p-20">

            <div className="flex flex-col items-center justify-center rounded-lg border-t-0 border shadow-lg shadow-orange-800/15 w-[32em] h-fit py-12">

                <span className="text-[2.5em] font-bold">Create a Fault Ticket</span>

                <div className="px-12">

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
                                        <BadgeAlert className="flex-shrink-0 text-orange-700" size={18} />
                                        <span className="text-small">{faultType.name}</span>
                                    </div>
                                </AutocompleteItem>}
                        </Autocomplete>



                        <Textarea
                            label="Description"
                            placeholder="add Description..."
                        />

                        <div>
                            <span className="font-semibold text-medium">Fault type <sup className="text-blue-500">*</sup></span>

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


                        <div className="m-auto">
                            <span>Use current location as Fault Location? </span>
                            <Checkbox size={"md"} radius="lg"></Checkbox>
                        </div>



                        <Button className="w-28 h-11 rounded-lg m-auto bg-orange-500 text-white font-semibold" type="submit">
                            Submit
                        </Button>

                    </form>
                </div>
            </div>
        </main>
    );
}