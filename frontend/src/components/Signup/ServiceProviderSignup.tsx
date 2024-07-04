import React, { FormEvent, useState } from 'react';
import { Input, Button } from '@nextui-org/react';
import { useRouter } from 'next/navigation';


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
  };

  return (
    <div className="px-12">
      <form data-testid="service-provider-signup-form" onSubmit={handleSubmit} className="flex flex-col gap-y-8 pt-8">

      <Input
          variant={"bordered"}
          fullWidth
          label={
            <span className="font-semibold text-medium block mb-[0.20em]">
              First Name <span className="text-blue-500">*</span>
            </span>
          }
          labelPlacement={"outside"}
          classNames={{
            inputWrapper: "h-[3em]",
          }}
          type="text"
          name="firstname"
          autoComplete="new-firstname"
          placeholder="Jane"
          required
        />

        <Input
          variant={"bordered"}
          fullWidth
          label={
            <span className="font-semibold text-medium block mb-[0.20em]">
              Last Name <span className="text-blue-500">*</span>
            </span>
          }
          labelPlacement={"outside"}
          classNames={{
            inputWrapper: "h-[3em]",
          }}
          type="text"
          name="surname"
          autoComplete="new-surname"
          placeholder="Doe"
          required
        />

        <Input
          variant={"bordered"}
          fullWidth
          label={
            <span className="font-semibold text-medium block mb-[0.20em]">
              Email<span className="text-blue-500">*</span>
            </span>
          }
          labelPlacement={"outside"}
          classNames={{
            inputWrapper: "h-[3em]",
          }}
          type="email"
          name="email"
          autoComplete="new-email"
          placeholder="example@mail.com"
          required
        />

        <Input
          variant={"bordered"}
          fullWidth
          label={
            <span className="font-semibold text-medium block mb-[0.20em]">
              Create Password <span className="text-blue-500">*</span>
            </span>
          }
          labelPlacement={"outside"}
          classNames={{
            inputWrapper: "h-[3em]",
          }}
          type="password"
          name="password"
          autoComplete="new-password"
          placeholder="Password"
          required
        />

        <Input
          variant={"bordered"}
          fullWidth
          label={
            <span className="font-semibold text-medium block mb-[0.20em]">
              Confirm Password <span className="text-blue-500">*</span>
            </span>
          }
          labelPlacement={"outside"}
          classNames={{
            inputWrapper: "h-[3em]",
          }}
          type="password"
          name="password"
          autoComplete="new-password"
          placeholder="Password"
          required
        />

        <Input
          variant={"bordered"}
          fullWidth
          label={
            <span className="font-semibold text-medium block mb-[0.20em]">
              AuthCode <span className="text-blue-500">*</span>
            </span>
          }
          labelPlacement={"outside"}
          classNames={{
            inputWrapper: "h-[3em]",
          }}
          type="text"
          name="authcode"
          autoComplete="new-authcode"
          placeholder="AuthCode"
          required
        />


        


        <Button name="submit" className="w-28 h-11 rounded-lg m-auto bg-blue-500 text-white font-semibold" type="submit">
          Submit
        </Button>

      </form>
    </div>
  );
}
