import React, { FormEvent, useState } from 'react';
import { Input, Button, Autocomplete, AutocompleteItem } from '@nextui-org/react';
import { Building2 } from 'lucide-react';
import { signUp,signIn,signOut } from 'aws-amplify/auth';
import { getCurrentUser } from 'aws-amplify/auth';
import { fetchUserAttributes } from 'aws-amplify/auth';
import { useRouter } from 'next/navigation';

export default function MunicipalitySignup() {
  const router = useRouter();
  const [province, setProvince] = useState('Gauteng');
  const [municipality, setMunicipality] = useState('');
  const [email, setEmail] = useState('');
  // const [verificationCode, setVerificationCode] = useState('123456');
  // const [showCode, setShowCode] = useState(false);

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
    await signOut()
    console.log(form.get('firstname') + " Surname :" + form.get('surname'))
    try {
      const { isSignUpComplete, nextStep } = await signUp({
        username: String(form.get('email')),
        password: String(form.get('password')),
        options: {
          userAttributes: {
            email: String(form.get('email')),
            'given_name': String(form.get('firstname')),
            'family_name': String(form.get('surname')),
            'custom:municipality': String(form.get('municipality')),
            'custom:user_role': "MUNICIPALITY",
          },
        },
      });

      console.log(nextStep);
      try{

        if (isSignUpComplete) {
          const response = await signIn({
            'username' : String(form.get('email')),
            'password' : String(form.get('password')),
          })
          // const { username, userId, signInDetails } = await getCurrentUser();
          router.push("/dashboard/municipality");
        }
      }
      catch (error)
      {
        console.log("Fetch: " + error)
      }
    } catch (error) {
      console.log("Error: " + error);
    }
    // console.log(`Province: ${province}, Municipality: ${municipality}, Verification Code: ${verificationCode}`);
  };

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
