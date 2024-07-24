import React, { FormEvent } from 'react';
import { Input, Button } from '@nextui-org/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { UserRole } from '@/types/custom.types';
import { handleSignIn } from '@/services/auth.service';


export default function ServiceProviderLogin() {
  const router = useRouter();

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget as HTMLFormElement);

    try {
      const { isSignedIn } = await handleSignIn(form, UserRole.PRIVATE_COMPANY);

      if (isSignedIn) {
        router.push("/tenders");  ///changed this for tender process
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
      <form data-testid="service-provider-login-form" onSubmit={handleSubmit} className="flex flex-col gap-y-8 pt-8">

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
              Service Provider Password <span className="text-blue-500">*</span>
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

        <Link href={"/forgot-password"} className="text-blue-500 underline text-right mt-[-1em]">Forgot password?</Link>

        <Button name="submit" data-testid="submit-btn" className="w-28 h-11 rounded-lg m-auto bg-blue-500 text-white font-semibold" type="submit">
          Submit
        </Button>
        {/* Social Media Sign Up Options */}
        {/* Render different options based on userType */}
      </form>
    </div>
  );
}
