import React, { FormEvent } from "react";
import Link from "next/link";
import { Input, Button } from "@nextui-org/react";
import { useRouter } from 'next/navigation';
import { UserRole } from "@/types/custom.types";
import { handleGoogleSignIn, handleSignIn } from "@/services/auth.service";
import { FcGoogle } from 'react-icons/fc';

export default function CitizenLogin() {
  const router = useRouter();

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget as HTMLFormElement);

    try {
      const { isSignedIn } = await handleSignIn(form, UserRole.CITIZEN);

      if (isSignedIn) {
        router.push("/dashboard");
      } else {
        throw "Something happened and we could not sign you in.";
      }
    } catch (error) {
      console.log("Error: " + error);
    }
  };

  const googleButtonOnClick = async () => {
    await handleGoogleSignIn();
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
        />

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
          required
        />

        <Link href={"/forgot-password"} className="text-blue-500 underline text-right mt-[-1em]">
          Forgot password?
        </Link>

        <Button
          name="submit"
          data-testid="submit-btn"
          className="w-56 h-11 rounded-3xl m-auto bg-blue-500 text-white font-semibold"
          type="submit"
        >
          Login
        </Button>

        <div className="w-full flex flex-row items-center">
          <hr className="flex-grow border-t border-gray-300" />
          <span className="mx-4 text-sm">OR</span>
          <hr className="flex-grow border-t border-gray-300" />
        </div>

        <Button
          onClick={googleButtonOnClick}
          name="google-submit"
          data-testid="google-login-btn"
          className="text-gray-800 rounded-3xl px-4 py-2 hover:bg-gray-300 transition duration-300 text-center font-semibold w-56 m-auto"
          type="button"
        >
          <FcGoogle size={20} />
          <span className="ml-2">Continue with Google</span>
        </Button>
      </form>
    </div>
  );
}
