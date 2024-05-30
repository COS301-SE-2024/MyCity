import React, { useState } from 'react';
import { Input, Button } from '@nextui-org/react';


export default function OrganizationSignup () {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // Handle the submit action here
    console.log(`User Type: Organization, Email: ${email}, Password: ${password}`);
  };

  return (
    <React.Fragment>
      <h3>Organization Signup Form</h3>

      <form onSubmit={handleSubmit}>
        <Input
          className="mt-10"
          type="email"
          fullWidth
          color="primary"
          size="lg"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          className="mt-10"
          type="password"
          fullWidth
          color="primary"
          size="lg"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button className="mt-10" type="submit">
          Continue
        </Button>
        {/* Social Media Sign Up Options */}
        {/* Render different options based on userType */}
      </form>

    </React.Fragment>
  );
}