import React, { FormEvent, useState } from 'react';
import { Input, Button, Autocomplete, AutocompleteItem } from '@nextui-org/react';
import { Building2 } from 'lucide-react';
import { signUp,signIn,signOut, SignUpOutput, autoSignIn } from 'aws-amplify/auth';
import { getCurrentUser } from 'aws-amplify/auth';
import { fetchUserAttributes } from 'aws-amplify/auth';
import { useRouter } from 'next/navigation';
import { UserRole } from '@/app/types/user.types';

export default function MunicipalitySignup() {
  const router = useRouter();

  type Province = {
    id: number | string;
    name: string;
  };

  type Municipality = {
    id: number | string;
    name: string;
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget as HTMLFormElement);

    try {
      const {  nextStep } = await signUp({
        username: String(form.get('email')),
        password: String(form.get('password')),
        options: {
          userAttributes: {
            email: String(form.get('email')),
            given_name: String(form.get('firstname')),
            family_name: String(form.get('surname')),
            'custom:municipality': String(form.get('municipality')),
            'custom:user_role': UserRole.MUNICIPALITY,
          },
        },
      });

      handleSignUpStep(nextStep);


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
          //redirect to municipality dashboard
          console.log("signup successful, you are now logged in.");
        }
    };
  }

  return (
    <div className="px-12">
      <form data-testid="municipality-signup-form" onSubmit={handleSubmit} className="flex flex-col gap-y-8 pt-8">


      <Input
          variant={"bordered"}
          fullWidth
          label={<span className="font-semibold text-medium block mb-[0.20em]">Username</span>}
          labelPlacement={"outside"}
          classNames={{
            inputWrapper: "h-[3em]",
          }}
          type="text"
          name="username"
          autoComplete="new-username"
          placeholder="janedoe"
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
          type="text"
          name="municipality"
          autoComplete="new-municipality"
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
          type="text"
          name="firstname"
          autoComplete="new-firstname"
          placeholder="Jane"
        />

        <Input
          variant={"bordered"}
          fullWidth
          label={<span className="font-semibold text-medium block mb-[0.20em]">Surname</span>}
          labelPlacement={"outside"}
          classNames={{
            inputWrapper: "h-[3em]",
          }}
          type="text"
          name="surname"
          autoComplete="new-surname"
          placeholder="Doe"
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
