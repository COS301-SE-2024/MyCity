import React, { FormEvent, useState } from 'react';
import { Input, Button } from '@nextui-org/react';
import Link from 'next/link';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { Upload } from 'lucide-react';
import NavbarBluish from '../Navbar/NavbarGuest';
import { signUp, signIn, signOut, SignUpOutput, autoSignIn } from 'aws-amplify/auth';
import { getCurrentUser } from 'aws-amplify/auth';
import { fetchUserAttributes } from 'aws-amplify/auth';
import { UserRole } from '@/app/types/user.types';

export default function CitizenSignup() {
  const router = useRouter();

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget as HTMLFormElement);

    try {
      const { nextStep } = await signUp({
        username: String(form.get('email')),
        password: String(form.get('password')),
        options: {
          userAttributes: {
            email: String(form.get('email')),
            given_name: String(form.get('firstname')),
            family_name: String(form.get('surname')),
            'custom:municipality': String(form.get('municipality')),
            'custom:user_role': UserRole.CITIZEN,
          },
          autoSignIn: true
        },
      });

      handleSignUpStep(nextStep);

      // try{

      //   if (isSignUpComplete) {
      //     const { username, userId, signInDetails } = await getCurrentUser();
      //     const user_details = await fetchUserAttributes();
      //   }
      // }
      // catch (error)
      // {
      //   console.log("Fetch: " + error)
      // }
    } catch (error) {
      console.log("Error: " + error);
    }
  };



  const handleSignUpStep = async(step: SignUpOutput["nextStep"]) => {
    switch (step.signUpStep) {
      case "CONFIRM_SIGN_UP":
      // Redirect end-user to confirm-sign up screen.

      case "COMPLETE_AUTO_SIGN_IN":
        const { isSignedIn } = await autoSignIn();

        if (isSignedIn) {
          //redirect to citizen dashboard
          console.log("signup successful, you are now logged in.");
        }
    };
  }

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
      </form>
    </div>
  );
}
