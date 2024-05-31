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
      <form onSubmit={handleSubmit} className="flex flex-col gap-y-6 pt-8">
        <div>
          <span className="font-semibold block mb-1">Email/Phone number</span>
          <Input
            variant={"bordered"}
            fullWidth
            classNames={{
              inputWrapper: "h-[3em]"
            }}
            type="email" placeholder="example@mail.com" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>

        <div>
          <span className="font-semibold block mb-1">Create Password</span>

          <Input
            variant={"bordered"}
            fullWidth
            classNames={{
              inputWrapper: "h-[3em]"
            }}
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)} />
        </div>

        <Button className="w-28 h-11 rounded-lg m-auto bg-orange-500 text-white font-semibold" type="submit">
          Submit
        </Button>
        {/* Social Media Sign Up Options */}
        {/* Render different options based on userType */}
      </form>
    </div>
  );
}
