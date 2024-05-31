import React, { useState } from 'react';
import { Input, Button } from '@nextui-org/react';


export default function CitizenSignup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // Handle the submit action here
    console.log(`User Type: Citizen, Email: ${email}, Password: ${password}`);
  };

  return (
    <div className="px-12">
      <form onSubmit={handleSubmit} className="flex flex-col gap-y-8 pt-8">

        <Input
          variant={"bordered"}
          fullWidth
          label={<span className="font-semibold text-medium block mb-[0.20em]">Email</span>}
          labelPlacement={"outside"}
          classNames={{
            inputWrapper: "h-[3em]",
          }}
          type="email" placeholder="example@mail.com" value={email} onChange={(e) => setEmail(e.target.value)} />

        <Input
          variant={"bordered"}
          fullWidth
          label={<span className="font-semibold text-medium block mb-[0.20em]">Create Password</span>}
          labelPlacement={"outside"}
          classNames={{
            inputWrapper: "h-[3em]",
          }}
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)} />

        <Button className="w-28 h-11 rounded-lg m-auto bg-orange-500 text-white font-semibold" type="submit">
          Submit
        </Button>
        {/* Social Media Sign Up Options */}
        {/* Render different options based on userType */}
      </form>
    </div>
  );
}
