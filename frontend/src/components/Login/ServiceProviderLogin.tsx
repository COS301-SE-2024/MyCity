import React, { FormEvent, useState } from 'react';
import { Input, Button, Autocomplete, AutocompleteItem } from '@nextui-org/react';
import Link from 'next/link';
import { CircleHelp } from 'lucide-react';


export default function ServiceProviderLogin() {
  // const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [password, setPassword] = useState('');

  type Company = {
    id: number | string;
    name: string;
  };


  const companies: Company[] = [
    { id: 0, name: "Bob's Electronics" },
    { id: 1, name: "West Coast Saviours" },
    { id: 2, name: "Aubrey's Angels" },
  ];


  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    // Handle the submit action here
    // console.log(`User Type: Organization, Email: ${email}, Password: ${password}`);
  };

  return (
    <div className="px-12">
      <form data-testid="service-provider-login-form" onSubmit={handleSubmit} className="flex flex-col gap-y-8 pt-8">

        <Autocomplete
          label={<span className="font-semibold text-medium">Company Name</span>}
          labelPlacement="outside"
          placeholder="e.g Plumbing"
          defaultItems={companies}
          fullWidth
          disableSelectorIconRotation
          isClearable={false}
          size={"lg"}
          type="text"
          name="company"
          autoComplete="new-company"
          menuTrigger={"input"}
          onChange={(event) => setCompany(event.target.value)}
        >
          {(company) => <AutocompleteItem key={company.id}>{company.name}</AutocompleteItem>}
        </Autocomplete>

        <Input
          variant={"bordered"}
          fullWidth
          label={<span className="font-semibold text-medium mb-[0.20em] flex items-center align-middle">Comapny Password<CircleHelp className="ml-2.5 text-blue-500" size={20} /></span>}
          labelPlacement={"outside"}
          classNames={{
            inputWrapper: "h-[3em]",
          }}
          type="password"
          name="password"
          autoComplete="new-password"
          placeholder="Company Password"
          value={password}
          onChange={(event) => setPassword(event.target.value)} />

        <Link href={"/forgot-password"} className="text-blue-500 underline text-right mt-[-1em]">Forgot password?</Link>

        <Button name="submit" className="w-28 h-11 rounded-lg m-auto bg-blue-500 text-white font-semibold" type="submit">
          Submit
        </Button>
        {/* Social Media Sign Up Options */}
        {/* Render different options based on userType */}
      </form>
    </div>
  );
}
