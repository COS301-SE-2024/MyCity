import React, { FormEvent, useState } from "react";
import Link from "next/link";
import {
  Input,
  Button,
  Autocomplete,
  AutocompleteItem,
} from "@nextui-org/react";
import { Building2, CircleHelp } from "lucide-react";
import { signIn, signOut } from "aws-amplify/auth";
import { getCurrentUser } from "aws-amplify/auth";
import { fetchUserAttributes } from "aws-amplify/auth";

export default function MunicipalityLogin() {
  const [municipality, setMunicipality] = useState("");
  const [password, setPassword] = useState("");

  type Municipality = {
    id: number | string;
    name: string;
  };

  const municipalities: Municipality[] = [
    { id: 0, name: "City of Ekurhuleni" },
    { id: 1, name: "City of Johannesburg" },
    { id: 2, name: "City of Tshwane" },
  ];

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget as HTMLFormElement);

    const { isSignedIn } = await signIn({
      username: String(form.get("email")),
      password: String(form.get("password")),
    });

    // const { username, userId, signInDetails } = await getCurrentUser();
    // const user_details = await fetchUserAttributes();
    // console.log(`Province: ${province}, Municipality: ${municipality}, Verification Code: ${verificationCode}`);
  };

  return (
    <div className="px-12">
      <form
        data-testid="municipality-login-form"
        onSubmit={handleSubmit}
        className="flex flex-col gap-y-8 pt-8"
      >
        <Input
          variant={"bordered"}
          fullWidth
          label={
            <span className="font-semibold text-medium block mb-[0.20em]">
              Municipality Email <span className="text-blue-500">*</span>
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
              Municipality Password <span className="text-blue-500">*</span>
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
          onChange={(event) => setPassword(event.target.value)}
        />

        <Link
          href={"/forgot-password"}
          className="text-blue-500 underline text-right mt-[-1em]"
        >
          Forgot password?
        </Link>

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
