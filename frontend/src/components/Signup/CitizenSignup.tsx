import React, { FormEvent, useState } from 'react';
import { Input, Button } from '@nextui-org/react';
import Link from 'next/link';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { Upload } from 'lucide-react';
import NavbarBluish from '../Navbar/NavbarBluish';


export default function CitizenSignup() {

  const router = useRouter();

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget as HTMLFormElement);
    console.log("Username: " + form.get("username"))
    console.log("email: " + form.get("email"))
    const firstname = form.get("firstname")
    const response = await axios.post('https://f1ihjeakmg.execute-api.af-south-1.amazonaws.com/api/auth/signup/user',{
        username : form.get("username"),
        email : form.get("email"),
        firstname : form.get("firstname"),
        surname : form.get("surname"),
        municipality : form.get("municipality"),
        password : form.get("password")
    });
    console.log("Something happened")
    const data = await response.data;
    if(data.Status == 200)
    {
      sessionStorage.setItem('fistname',String(firstname))
      sessionStorage.setItem('username',String(form.get("username")));
      router.push("/dashboard/citizen")
    }
    // Handle the submit action here
    // console.log(`User Type: Citizen, Email: ${email}, Password: ${password}`);
  };

  return (
    <div className="px-12">
      <form data-testid="citizen-signup-form" onSubmit={handleSubmit} className="flex flex-col gap-y-8 pt-8">
      
      <div>
          <span className="font-semibold text-medium block mb-2">Add Profile Picture</span>

          <div className="flex justify-evenly items-center align-middle">
            <div className="rounded-2xl border border-black/15 border-dashed px-8 py-7 w-fit h-fit">
              <Upload className="text-blue-400" size={40} />
            </div>

            <span className="text-blue-400">Upload a file or drag and drop.</span>

          </div>
        </div>

      <Input
          variant={"bordered"}
          fullWidth
          label={<span className="font-semibold text-medium block mb-[0.20em]">Username</span>}
          labelPlacement={"outside"}
          classNames={{
            inputWrapper: "h-[3em]",
          }}
          type="username"
          name="username"
          autoComplete="Andinda-Allmighty"
          placeholder="Andinda"
          />

        <Input
          variant={"bordered"}
          fullWidth
          label={<span className="font-semibold text-medium block mb-[0.20em]">Email</span>}
          labelPlacement={"outside"}
          classNames={{
            inputWrapper: "h-[3em]",
          }}
          type="email"
          name="email"
          autoComplete="new-email"
          placeholder="example@mail.com"
          />

          <Input
          variant={"bordered"}
          fullWidth
          label={<span className="font-semibold text-medium block mb-[0.20em]">Municipality</span>}
          labelPlacement={"outside"}
          classNames={{
            inputWrapper: "h-[3em]",
          }}
          type="municipality"
          name="municipality"
          autoComplete="City of Tshwane Metropolitan"
          placeholder="City of Tshwane Metropolitan"
          />

        <Input
          variant={"bordered"}
          fullWidth
          label={<span className="font-semibold text-medium block mb-[0.20em]">First Name</span>}
          labelPlacement={"outside"}
          classNames={{
            inputWrapper: "h-[3em]",
          }}
          type="firstname"
          name="firstname"
          autoComplete="new-password"
          placeholder="Joe"
           />

        <Input
          variant={"bordered"}
          fullWidth
          label={<span className="font-semibold text-medium block mb-[0.20em]">Surname</span>}
          labelPlacement={"outside"}
          classNames={{
            inputWrapper: "h-[3em]",
          }}
          type="surname"
          name="surname"
          autoComplete="new-password"
          placeholder="Bidden"
           />

        <Input
          variant={"bordered"}
          fullWidth
          label={<span className="font-semibold text-medium block mb-[0.20em]">Create Password</span>}
          labelPlacement={"outside"}
          classNames={{
            inputWrapper: "h-[3em]",
          }}
          type="password"
          name="password"
          autoComplete="new-password"
          placeholder="Password"
           />

        <Button name="submit" className="w-28 h-11 rounded-lg m-auto bg-blue-500 text-white font-semibold" type="submit">
          Submit
        </Button>

        {/* Social Media Sign Up Options */}
        {/* Render different options based on userType */}
      </form>
    </div>
  );
}
