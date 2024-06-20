import React, { FormEvent, useState } from 'react';
import { Input, Button, Autocomplete, AutocompleteItem } from '@nextui-org/react';
import Link from 'next/link';
import { CircleHelp } from 'lucide-react';
import { signIn,signOut } from 'aws-amplify/auth';
import { getCurrentUser } from 'aws-amplify/auth';
import { fetchUserAttributes } from 'aws-amplify/auth';


export default function ServiceProviderLogin() {
  // const [email, setEmail] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [company, setCompany] = useState('');

  type Company = {
    id: number | string;
    name: string;
  };


  const companies: Company[] = [
    { id: 0, name: "Bob's Electronics" },
    { id: 1, name: "West Coast Saviours" },
    { id: 2, name: "Aubrey's Angels" },
  ];


  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget as HTMLFormElement);

    const {isSignedIn} = await signIn({
      username : String(form.get('email')),
      password : String(form.get('password')),
    });

    // const { username, userId, signInDetails } = await getCurrentUser();
    // const user_details = await fetchUserAttributes();

    // Handle the submit action here
    // console.log(`User Type: Organization, Email: ${email}, Password: ${password}`);
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
          value={email} onChange={(event) => setEmail(event.target.value)} 
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
          value={password}
          required
          onChange={(event) => setPassword(event.target.value)} />

        <Link href={"/forgot-password"} className="text-blue-500 underline text-right mt-[-1em]">Forgot password?</Link>

        <Button name="submit" className="w-28 h-11 rounded-lg m-auto bg-blue-500 text-white font-semibold" type="submit">
          Submit
        </Button>
        {/* Social Media Sign Up Options */}
        {/* Render different options based on userType */}
      </form>
    </div>
  );
}
