import React, { FormEvent, useState } from 'react';
import { Input, Button, Autocomplete, AutocompleteItem } from '@nextui-org/react';
import { Upload } from 'lucide-react';
import { useRouter } from 'next/navigation';
import axios from 'axios';


export default function ServiceProviderSignup() {

  const [servicetype, setServicetype] = useState('');
  const router = useRouter();



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


  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    // const form = new FormData(event.currentTarget as HTMLFormElement);
    // console.log("Service Area: " + form.get("service-area"))
    // const response = await axios.post('https://f1ihjeakmg.execute-api.af-south-1.amazonaws.com/api/auth/signup/company', {
    //   email: form.get("email"),
    //   name: form.get("company"),
    //   service_type: form.get("service-area"),
    //   password: form.get("password")
    // });
    // console.log("Something happened")
    // const data = await response.data;
    // if (data.Status == 200) {
    //   sessionStorage.setItem('pid', data.pid)
    //   sessionStorage.setItem('name', data.name)
    //   sessionStorage.setItem('service_type', data.service_type)
    //   router.push("/dashboard/service-provider")
    // }
    // Handle the submit action here
    // console.log(`User Type: Organization, Email: ${email}, Password: ${password}`);
  };

  return (
    <div className="px-12">
      <form data-testid="service-provider-signup-form" onSubmit={handleSubmit} className="flex flex-col gap-y-8 pt-8">

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
          name="company"
          autoComplete="new-company"
          placeholder="Company Name"

        />


        <div>
          <span className="font-semibold text-medium block mb-2">Add Company Branding</span>

          <div className="flex justify-evenly items-center align-middle">
            <div className="rounded-2xl border border-black/15 border-dashed px-8 py-7 w-fit h-fit">
              <Upload className="text-blue-400" size={40} />
            </div>

            <span className="text-blue-400">Upload a file or drag and drop.</span>

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
          type="text"
          name="service-area"
          autoComplete="new-service-area"
          menuTrigger={"input"}
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
          name="email"
          autoComplete="new-email"
          placeholder="example@company.com"
        />

        <Input
          variant={"bordered"}
          fullWidth
          label="Create password"
          labelPlacement={"outside"}
          classNames={{
            inputWrapper: "h-[3em]",
            label: "font-semibold text-medium mt-[-1px]"
          }}
          type="password"
          name="password"
          autoComplete="new-password"
          placeholder="create secure password"
        />


        <Button name="submit" className="w-28 h-11 rounded-lg m-auto bg-blue-500 text-white font-semibold" type="submit">
          Submit
        </Button>

      </form>
    </div>
  );
}
