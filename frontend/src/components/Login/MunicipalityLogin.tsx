import React, { FormEvent, useState } from "react";
import Link from "next/link";
import { Input, Button } from "@nextui-org/react";
import { useRouter } from 'next/navigation';
import { UserRole } from "@/types/custom.types";
import { handleSignIn } from "@/services/auth.service";
import { FaEye, FaEyeSlash } from 'react-icons/fa';

export default function MunicipalityLogin() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget as HTMLFormElement);

    try {
      const { isSignedIn } = await handleSignIn(form, UserRole.MUNICIPALITY);

      if (isSignedIn) {
        router.push("/dashboard/municipality");
      } else {
        throw "Something happened and we could not sign you in.";
      }
    } catch (error) {
      console.log("Error: " + error);
    }
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

        <div className="relative w-full">
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
            type={showPassword ? "text" : "password"}
            name="password"
            autoComplete="new-password"
            placeholder="Password"
            required
          />
          <button
            type="button"
            className="absolute top-1/2 right-3 transform translate-y-1 text-black"
            onClick={togglePasswordVisibility}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>
{/*}
        <Link
          href={"/forgot-password"}
          className="text-blue-500 underline text-right mt-[-1em]"
        >
          Forgot password?
        </Link>*/}

        <Button
          name="submit"
          data-testid="submit-btn"
          className="w-28 h-11 rounded-3xl m-auto bg-blue-500 text-white font-semibold"
          type="submit"
        >
          Submit
        </Button>
      </form>
    </div>
  );
}
