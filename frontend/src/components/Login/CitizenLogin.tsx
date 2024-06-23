import React, { FormEvent } from 'react';
import { Input, Button } from '@nextui-org/react';
import Link from 'next/link';
import { FcGoogle } from 'react-icons/fc';
import { handleSignIn } from '@/lib/cognitoActions';
import { UserRole } from '@/types/user.types';
import { useRouter } from 'next/navigation';


export default function CitizenLogin() {
  const router = useRouter();


  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget as HTMLFormElement);

    try {
      const { isSignedIn } = await handleSignIn(form, UserRole.CITIZEN);

      if (isSignedIn) {
        router.push("/dashboard");
      }
      else {
        throw "Something happened and we could not sign you in.";
      }

    }
    catch (error) {
      console.log("Error: " + error);
    }

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
          required />

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
          required />

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