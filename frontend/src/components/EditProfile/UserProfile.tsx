import React, { useState } from 'react';
import { Input, Button } from '@nextui-org/react';
import Link from 'next/link';
import { Baseline } from 'lucide-react';
// import {toast} from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

import { toast, ToastContainer } from 'react-toastify';


export default function CitizenSignup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // Handle the submit action here
    console.log(`User Type: Citizen, Email: ${email}, Password: ${password}`);
  };

  return (

    // username: string;
    // email: string;
    // name: string;
    // surname: string;
    // age: number;
    // password: string;
    // cellphone: string;
    // municipality: string;

    <div className="px-12 w-full">
      <ToastContainer />
      <form onSubmit={handleSubmit} className="flex flex-col gap-y-8 pt-8 w-full">

        <div className='flex gap-x-2'>
          <Input
            variant={"bordered"}
            fullWidth
            label={<span className="font-semibold text-medium block mb-[0.20em]">Username</span>}
            labelPlacement={"outside"}
            classNames={{
              inputWrapper: "h-[3em]",
            }}
            type="input"
            autoComplete="new-email"
            placeholder="example@mail.com"
            value={"chadmartin81"}

          />
        </div>

        <div className='flex gap-x-2 items-end' >
          {/* <span className="font-semibold text-medium block mb-[0.20em]">Email</span> */}
          <Input
            variant={"bordered"}
            fullWidth
            label={<span className="font-semibold text-medium block mb-[0.20em]">Email</span>}
            labelPlacement={"outside"}
            classNames={{
              inputWrapper: "h-[3em]",
            }}

            type="input"
            autoComplete="new-email"
            placeholder="example@mail.com"

            onChange={(event) => setEmail(event.target.value)}
          />

        </div>

        <div className='flex gap-x-2 items-end'>
          <Input
            variant={"bordered"}
            fullWidth
            label={<span className="font-semibold text-medium block mb-[0.20em]">Firstname</span>}
            labelPlacement={"outside"}
            classNames={{
              inputWrapper: "h-[3em]",
            }}
            type="input"
            autoComplete="new-email"
            placeholder="Chad"

            onChange={(event) => setEmail(event.target.value)}
          />

        </div>

        <div className='flex gap-x-2 items-end'>

          <Input
            variant={"bordered"}
            fullWidth
            label={<span className="font-semibold text-medium block mb-[0.20em]">Surname</span>}
            labelPlacement={"outside"}
            classNames={{
              inputWrapper: "h-[3em]",
            }}
            type="input"
            autoComplete="new-email"
            placeholder="Surname"

            onChange={(event) => setEmail(event.target.value)} />

        </div>

        <div className='flex gap-x-2 items-end'>
          <Input
            variant={"bordered"}
            fullWidth
            label={<span className="font-semibold text-medium block mb-[0.20em]">Cellphone Number</span>}
            labelPlacement={"outside"}
            classNames={{
              inputWrapper: "h-[3em]",
            }}
            type="input"
            autoComplete="new-email"
            placeholder="Cellphone Number"

            onChange={(event) => setEmail(event.target.value)} />

        </div>

        <div className="border bg-blue-500 text-white px-4 py-2 rounded-3xl cursor-pointer hover:bg-blue-200 transition duration-300 text-center font-bold w-max mx-auto mt-2" onClick={() => toast("Email updated succesfully!")}>
          Update
        </div>

        <Button type="submit" className="bg-blue-500">
          Update
        </Button>

      </form >
    </div >
  );
}
