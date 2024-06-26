import React, { FormEvent, useState } from "react";
import {
  Input,
  Button,
  Autocomplete,
  AutocompleteItem,
} from "@nextui-org/react";
import { Building2 } from "lucide-react";
import {
  signUp,
  signIn,
  signOut,
  SignUpOutput,
  autoSignIn,
} from "aws-amplify/auth";
import { getCurrentUser } from "aws-amplify/auth";
import { fetchUserAttributes } from "aws-amplify/auth";
import { useRouter } from "next/navigation";
import { UserRole } from "@/types/user.types";
import { handleSignUp } from "@/lib/cognitoActions";

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
      handleSignUp(form, UserRole.MUNICIPALITY);
    }
    catch (error) {
      console.log("Error: " + error);
    }

  };


  return (
    <div className="px-12">
      <form
        data-testid="municipality-signup-form"
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

        <Input
          variant={"bordered"}
          fullWidth
          label={
            <span className="font-semibold text-medium block mb-[0.20em]">
              MuniCode <span className="text-blue-500">*</span>
            </span>
          }
          labelPlacement={"outside"}
          classNames={{
            inputWrapper: "h-[3em]",
          }}
          type="text"
          name="municode"
          autoComplete="new-municode"
          placeholder="MuniCode"
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
