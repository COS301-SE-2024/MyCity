import React, { FormEvent, useState } from 'react';
import { Input, Button } from '@nextui-org/react';
import Link from 'next/link';


export default function CitizenLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
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

        <Link href={"/forgot-password"} className="text-orange-500 underline text-right mt-[-1em]">Forgot password?</Link>
        <Link href="/dashboard" data-testid="submit-btn">
          <div className="bg-orange-500 text-white px-4 py-2 rounded-3xl cursor-pointer hover:bg-orange-200 transition duration-300 text-center font-bold w-max mx-auto mt-4">
            Login
          </div>
        </Link>

      </form>
    </div>
  );
}