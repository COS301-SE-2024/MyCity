import React, { FormEvent, useState } from 'react';
import { Input, Button } from '@nextui-org/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';


export default function CitizenLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const  handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const response = await axios.post('https://f1ihjeakmg.execute-api.af-south-1.amazonaws.com/api/auth/login/user',{
        email : email,
        username : "Dindoss",
        password : password
    });
    console.log("Something happened")
    // if ( !response.ok) {
    //   throw new Error(`HTTP error! status: ${response.status}`);
    // }
    const data = await response.data;
    console.log(data)
    console.log(data.Status)
    if(data.Success)
    {
      router.push("/dashboard")
    }
  
    
    // Handle the submit action here
    // console.log(`User Type: Citizen, Email: ${email}, Password: ${password}`);
  };

  return (
    <div className="px-12">
      <form data-testid="citizen-login-form" onSubmit={handleSubmit} className="flex flex-col gap-y-8 pt-8">

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
          value={email} onChange={(event) => setEmail(event.target.value)} />

        <Input
          variant={"bordered"}
          fullWidth
          label={<span className="font-semibold text-medium block mb-[0.20em]">Password</span>}
          labelPlacement={"outside"}
          classNames={{
            inputWrapper: "h-[3em]",
          }}
          type="password"
          name="password"
          autoComplete="new-password"
          placeholder="Password"
          value={password}
          onChange={(event) => setPassword(event.target.value)} />

        <Link href={"/forgot-password"} className="text-blue-500 underline text-right mt-[-1em]">Forgot password?</Link>
        <button  type="submit" data-testid="login-btn">
          <div className="bg-blue-500 text-white px-4 py-2 rounded-3xl cursor-pointer hover:bg-blue-200 transition duration-300 text-center font-bold w-max mx-auto mt-4">
            Login
          </div>
        </button>

      </form>
    </div>
  );
}