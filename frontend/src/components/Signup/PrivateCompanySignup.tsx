import React, { FormEvent, useState } from 'react';
import { Input, Button } from '@nextui-org/react';
import { useRouter } from 'next/navigation';


export default function ServiceProviderSignup() {

  const router = useRouter();



  type ServiceArea = {
    id: number | string;
    name: string;
  };


  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget as HTMLFormElement);
    const companyname = form.get('company-name');
    const number = form.get('contact-number');
    const email = form.get('email')
    console.log("company name:",companyname )
  };

  return (
    <div className="px-12">
      <form data-testid="service-provider-signup-form" onSubmit={handleSubmit} className="flex flex-col gap-y-8 pt-8">

      <Input
          variant={"bordered"}
          fullWidth
          label={
            <span className="font-semibold text-medium block mb-[0.20em]">
              Company Name <span className="text-blue-500">*</span>
            </span>
          }
          labelPlacement={"outside"}
          classNames={{
            inputWrapper: "h-[3em]",
          }}
          type="text"
          name="company-name"
          autoComplete="Teska"
          placeholder="Tesla"
          required
        />

        <Input
          variant={"bordered"}
          fullWidth
          label={
            <span className="font-semibold text-medium block mb-[0.20em]">
              Contact Number <span className="text-blue-500">*</span>
            </span>
          }
          labelPlacement={"outside"}
          classNames={{
            inputWrapper: "h-[3em]",
          }}
          type="text"
          name="contact-number"
          autoComplete="new-number"
          placeholder="0116543211"
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

        <Button name="submit" className="w-28 h-11 rounded-lg m-auto bg-blue-500 text-white font-semibold" type="submit">
          Submit
        </Button>

      </form>
    </div>
  );
}
