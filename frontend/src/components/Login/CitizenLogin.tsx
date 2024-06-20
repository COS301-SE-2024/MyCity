import React, { FormEvent, useState } from 'react';
import { Input, Button } from '@nextui-org/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import { signIn,signOut } from 'aws-amplify/auth';
import { getCurrentUser } from 'aws-amplify/auth';
import { fetchUserAttributes } from 'aws-amplify/auth';
import { FcGoogle } from 'react-icons/fc';


export default function CitizenLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget as HTMLFormElement);

    const {isSignedIn} = await signIn({
      username: String(form.get('email')),
      password: String(form.get('password')),
    });

    // const { username, userId, signInDetails } = await getCurrentUser();
    // const user_details = await fetchUserAttributes();
    // sessionStorage.setItem('firstname', String(user_details['given_name']));
    // sessionStorage.setItem('email', String(user_details['family_name']));


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
          value={email} onChange={(event) => setEmail(event.target.value)} />

        <Input
          variant={"bordered"}
          fullWidth
          label={
            <span className="font-semibold text-medium block mb-[0.20em]">
              Password <span className="text-blue-500">*</span>
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
          value={password}
          required
          onChange={(event) => setPassword(event.target.value)} />

        <Link href={"/forgot-password"} className="text-blue-500 underline text-right mt-[-1rem]">Forgot password?</Link>

        {/* <Button name="submit" data-testid="submit-btn" radius="full" className="bg-blue-500 text-white px-4 py-2 hover:bg-blue-400 transition duration-300 text-center font-bold w-max mx-auto mt-4" type="submit">
          Login
        </Button> */}


        <div className="flex flex-col items-center justify-center px-16">

          <Button fullWidth name="submit" data-testid="submit-btn" radius="md" className="bg-blue-500 text-white px-4 py-2 hover:bg-blue-400 transition duration-300 text-center font-semibold" type="submit">
            Login
          </Button>

          <div className="w-full flex flex-row items-center my-3">
            <hr className="flex-grow border-t border-gray-300" />
            <span className="mx-4 text-sm">OR</span>
            <hr className="flex-grow border-t border-gray-300" />
          </div>

          <Button fullWidth name="gogle-submit" data-testid="google-login-btn" radius="md" className=" text-gray-800 px-4 py-2 hover:bg-gray-300 transition duration-300 text-center font-semibold">
            <FcGoogle size={20} />
            <span>Continue with Google</span>
          </Button>

        </div>

      </form>
    </div>
  );
}