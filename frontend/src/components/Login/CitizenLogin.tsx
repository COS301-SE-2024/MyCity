import React, { FormEvent, useState } from 'react';
import { Input, Button } from '@nextui-org/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import { signIn } from 'aws-amplify/auth';
import { getCurrentUser } from 'aws-amplify/auth';
import { fetchUserAttributes } from 'aws-amplify/auth';


export default function CitizenLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    // if ( !response.ok) {
    //   throw new Error(`HTTP error! status: ${response.status}`);
    // }
    const form = new FormData(event.currentTarget as HTMLFormElement);
    const response = await signIn({
      'username' : String(form.get('email')),
      'password' : String(form.get('password')),
    })

    const { username, userId, signInDetails } = await getCurrentUser();
    const user_details = await fetchUserAttributes();
    sessionStorage.setItem('firstname', String(user_details['given_name']));
    sessionStorage.setItem('email', String(user_details['family_name']));

  
    // if (data.Success) {
    //   sessionStorage.setItem('username', data.username)
    //   sessionStorage.setItem('name', data.firstname)
    //   router.push("/dashboard/citizen")
    // }


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

        <Button name="submit" data-testid="submit-btn" radius="full" className="bg-blue-500 text-white px-4 py-2 hover:bg-blue-400 transition duration-300 text-center font-bold w-max mx-auto mt-4" type="submit">
          Login
        </Button>

      </form>
    </div>
  );
}