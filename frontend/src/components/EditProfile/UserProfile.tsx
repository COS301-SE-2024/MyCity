import React, { useState } from 'react';
import { Input, Button } from '@nextui-org/react';
import NavbarUser from '../Navbar/NavbarUser';

import "react-toastify/dist/ReactToastify.css";
import { Upload } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import { UserData } from '@/types/custom.types';

interface Props extends React.HTMLAttributes<HTMLElement> {
  data: UserData | null;
}


export default function CitizenSignup({ data }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // Handle the submit action here
    try {
      console.log(`User Type: Citizen, Email: ${email}, Password: ${password}`);
      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error("Problem occured while updating the profile.");
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log(`New Profile Picture selected.`);
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
      <NavbarUser />
      <ToastContainer />
      <form onSubmit={handleSubmit} className="flex flex-col gap-y-8 pt-8 w-full">

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
            label={<span className="font-semibold text-medium block mb-[0.20em]">Municipality</span>}
            labelPlacement={"outside"}
            classNames={{
              inputWrapper: "h-[3em]",
            }}
            type="input"
            autoComplete="new-email"
            placeholder="Municipality"

            onChange={(event) => setEmail(event.target.value)} />

        </div>

        <div className='flex gap-x-2 items-end'>
          <Input
            variant={"bordered"}
            fullWidth
            label={<span className="font-semibold text-medium block mb-[0.20em]">New Password</span>}
            labelPlacement={"outside"}
            classNames={{ inputWrapper: "h-[3em]" }}
            type="password"
            placeholder="New Password"
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>

        <div>
          <span className="font-semibold text-medium block mb-2">Change Profile Picture</span>
          <div className="flex justify-evenly items-center align-middle">
            <div className="rounded-2xl border border-black/15 border-dashed px-8 py-7 w-fit h-fit">
              <label className="flex flex-col items-center justify-center cursor-pointer">
                <Upload className="text-blue-400" size={40} />
                <input
                  type="file"
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                />
              </label>
            </div>
            <span className="text-blue-400">Upload a file or drag and drop.</span>
          </div>
        </div>

        <Button type="submit" className="m-auto bg-blue-500 text-white w-24 px-4 py-2 font-bold rounded-3xl hover:bg-blue-600 transition duration-300">
          Update
        </Button>

      </form >
    </div >
  );
}
