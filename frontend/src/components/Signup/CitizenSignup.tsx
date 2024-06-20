import React, { FormEvent, useState } from "react";
import { Input, Button } from "@nextui-org/react";
import Link from "next/link";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Upload } from "lucide-react";
import NavbarBluish from "../Navbar/NavbarGuest";
import {
  signUp,
  signIn,
  signOut,
  SignUpOutput,
  autoSignIn,
} from "aws-amplify/auth";
import { getCurrentUser } from "aws-amplify/auth";
import { fetchUserAttributes } from "aws-amplify/auth";
import { UserRole } from "@/app/types/user.types";

export default function CitizenSignup() {
  const router = useRouter();

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget as HTMLFormElement);

    try {
      const { nextStep } = await signUp({
        username: String(form.get("email")),
        password: String(form.get("password")),
        options: {
          userAttributes: {
            email: String(form.get("email")),
            given_name: String(form.get("firstname")),
            family_name: String(form.get("surname")),
            "custom:municipality": String(form.get("municipality")),
            "custom:user_role": UserRole.CITIZEN,
          },
          autoSignIn: true,
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

  const handleSignUpStep = async (step: SignUpOutput["nextStep"]) => {
    switch (step.signUpStep) {
      case "CONFIRM_SIGN_UP":
      // Redirect end-user to confirm-sign up screen.

      case "COMPLETE_AUTO_SIGN_IN":
        const { isSignedIn } = await autoSignIn();

        if (isSignedIn) {
          //redirect to citizen dashboard
          console.log("signup successful, you are now logged in.");
        }
    }
  };

  return (
    <div className="px-12">
      <form
        data-testid="citizen-signup-form"
        onSubmit={handleSubmit}
        className="flex flex-col gap-y-8 pt-8"
      >
        <Input
          variant={"bordered"}
          fullWidth
          label={
            <span className="font-semibold text-medium block mb-[0.20em]">
              First Name <span className="text-blue-500">*</span>
            </span>
          }
          labelPlacement={"outside"}
          classNames={{
            inputWrapper: "h-[3em]",
          }}
          type="text"
          name="firstname"
          autoComplete="new-firstname"
          placeholder="Jane"
          required
        />

        <Input
          variant={"bordered"}
          fullWidth
          label={
            <span className="font-semibold text-medium block mb-[0.20em]">
             Last Name <span className="text-blue-500">*</span>
            </span>
          }
          labelPlacement={"outside"}
          classNames={{
            inputWrapper: "h-[3em]",
          }}
          type="text"
          name="surname"
          autoComplete="new-surname"
          placeholder="Doe"
          required
        />

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
        />

        <Input
          variant={"bordered"}
          fullWidth
          label={
            <span className="font-semibold text-medium block mb-[0.20em]">
              Municipality <span className="text-blue-500">*</span>
            </span>
          }
          labelPlacement={"outside"}
          classNames={{
            inputWrapper: "h-[3em]",
          }}
          type="text"
          name="municipality"
          autoComplete="new-municipality"
          placeholder="City of Tshwane Metropolitan"
          required
        />

        <Input
          variant={"bordered"}
          fullWidth
          label={
            <span className="font-semibold text-medium block mb-[0.20em]">
              Create Password <span className="text-blue-500">*</span>
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
          required
        />

        <Input
          variant={"bordered"}
          fullWidth
          label={
            <span className="font-semibold text-medium block mb-[0.20em]">
              Confirm Password <span className="text-blue-500">*</span>
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
          required
        />
        <Button
          name="submit"
          className="w-28 h-11 rounded-lg m-auto bg-blue-500 text-white font-semibold"
          type="submit"
        >
          Submit
        </Button>
      </form>
    </div>
  );
}
