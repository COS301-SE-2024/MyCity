import React, { useState } from 'react';
import { Input, Button } from '@nextui-org/react';
import Link from 'next/link';
import Navbar from '../Navbar/nav';
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

    <div className="px-12</div>">
      <ToastContainer />
      <form onSubmit={handleSubmit} className="flex flex-col gap-y-8 pt-8">

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
            disabled
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
            value={"chad.martin@example.com"}
            onChange={(event) => setEmail(event.target.value)}
          />
          {/* <Link href="/"> */}
          <div className="border bg-blue-500 text-white px-4 py-2 rounded-3xl cursor-pointer hover:bg-blue-200 transition duration-300 text-center font-bold w-max mx-auto mt-2" onClick={() => toast("Email updated succesfully!")}>
            Update
          </div>
          {/* </Link> */}

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
            placeholder="example@mail.com"
            value={"Chad"}
            onChange={(event) => setEmail(event.target.value)}
          />
          {/* <Link href="/dashboard"> */}
            <div className="border bg-blue-500 text-white px-4 py-2 rounded-3xl cursor-pointer hover:bg-blue-200 transition duration-300 text-center font-bold w-max mx-auto mt-2" onClick={() => toast("Firstname updated succesfully!")}>
              {/* <div className="border bg-blue-500 text-white px-4 py-2 rounded-3xl cursor-pointer hover:bg-blue-200 transition duration-300 text-center font-bold w-max mx-auto mt-4"> */}
              Update
            </div>
          {/* </Link> */}

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
            placeholder="example@mail.com"
            value={"Martin"}
            onChange={(event) => setEmail(event.target.value)} />
          {/* <Link href="/dashboard"> */}
            <div className="border bg-blue-500 text-white px-4 py-2 rounded-3xl cursor-pointer hover:bg-blue-200 transition duration-300 text-center font-bold w-max mx-auto mt-2" onClick={() => toast("Surname updated succesfully!")}>
              {/* <div className="border bg-blue-500 text-white px-4 py-2 rounded-3xl cursor-pointer hover:bg-blue-200 transition duration-300 text-center font-bold w-max mx-auto mt-4"> */}
              Update
            </div>
          {/* </Link> */}

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
            placeholder="example@mail.com"
            value={"0658402012"}
            onChange={(event) => setEmail(event.target.value)} />
          {/* <Link href="/dashboard"> */}
            <div className="border bg-blue-500 text-white px-4 py-2 rounded-3xl cursor-pointer hover:bg-blue-200 transition duration-300 text-center font-bold w-max mx-auto mt-2" onClick={() => toast("Cellphone number updated succesfully!")}>
              {/* <div className="border bg-blue-500 text-white px-4 py-2 rounded-3xl cursor-pointer hover:bg-blue-200 transition duration-300 text-center font-bold w-max mx-auto mt-4"> */}
              Update
            </div>
          {/* </Link> */}

        </div>

        {/* <Link href="/dashboard">
          <div className="bg-blue-500 text-white px-4 py-2 rounded-3xl cursor-pointer hover:bg-blue-200 transition duration-300 text-center font-bold w-max mx-auto mt-4">
            Submit
          </div>
        </Link> */}
        {/* Social Media Sign Up Options */}
        {/* Render different options based on userType */}
      </form >
    </div >
  );
}
