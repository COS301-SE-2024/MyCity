import React, { useState } from 'react';
import { Input, Button, Autocomplete, AutocompleteItem } from '@nextui-org/react';
import { Upload } from 'lucide-react';


export default function ServiceProviderSignup() {
  const [email, setEmail] = useState('');
  const [serviceArea, setServiceArea] = useState('');



  type ServiceArea = {
    id: number | string;
    name: string;
  };


  const serviceAreas: ServiceArea[] = [
    { id: 0, name: "Plumbing" },
    { id: 1, name: "Cleaning" },
    { id: 2, name: "Pest Control" },
    { id: 3, name: "Landscaping" },
    { id: 4, name: "Electrical Services" }
  ];


  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // Handle the submit action here
    console.log(`User Type: Organization, Email: ${email}, Password: ${password}`);
  };

  return (
    <div className="px-12">
      <form onSubmit={handleSubmit} className="flex flex-col gap-y-8 pt-8">


        {/* <Autocomplete
          label={<span className="font-semibold text-medium">Province</span>}
          labelPlacement="outside"
          placeholder="Gauteng"
          defaultItems={provinces}
          fullWidth
          disableSelectorIconRotation
          isClearable={false}
          size={"lg"}
          menuTrigger={"input"}
          onChange={(event) => setProvince(event.target.value)}
        >
          {(province) => <AutocompleteItem key={province.id}>{province.name}</AutocompleteItem>}
        </Autocomplete> */}

        <Input
          variant={"bordered"}
          fullWidth
          label="Registered Company Name"
          labelPlacement={"outside"}
          classNames={{
            inputWrapper: "h-[3em]",
            label: "font-semibold text-medium mt-[-1px]"
          }}
          type="text"
          placeholder="Company Name"
          value={email} onChange={(e) => setEmail(e.target.value)}
        />


        <div>
          <span className="font-semibold text-medium block mb-2">Add Company Branding</span>

          <div className="flex justify-evenly items-center align-middle">
            <div className="rounded-2xl border border-black/15 border-dashed px-8 py-7 w-fit h-fit">
              <Upload className="text-orange-400" size={40} />
            </div>

            <span className="text-orange-400">Upload a file or drag and drop.</span>

          </div>
        </div>


        <Autocomplete
          label={<span className="font-semibold text-medium">Service Area</span>}
          labelPlacement="outside"
          placeholder="e.g Plumbing"
          defaultItems={serviceAreas}
          fullWidth
          disableSelectorIconRotation
          isClearable={false}
          size={"lg"}
          menuTrigger={"input"}
          onChange={(event) => setServiceArea(event.target.value)}
        >
          {(serviceArea) => <AutocompleteItem key={serviceArea.id}>{serviceArea.name}</AutocompleteItem>}
        </Autocomplete>


        <Input
          variant={"bordered"}
          fullWidth
          label="Email"
          labelPlacement={"outside"}
          classNames={{
            inputWrapper: "h-[3em]",
            label: "font-semibold text-medium mt-[-1px]"
          }}
          type="email"
          placeholder="example@company.com"
          value={email} onChange={(e) => setEmail(e.target.value)}
        />


        <Button className="w-28 h-11 rounded-lg m-auto bg-orange-500 text-white font-semibold" type="submit">
          Submit
        </Button>

      </form>
    </div>
  );
}
