import React, { useState } from 'react';
import { Input, Button } from '@nextui-org/react';

export default function MunicipalitySignup() {
  const [province, setProvince] = useState('Gauteng');
  const [municipality, setMunicipality] = useState('');
  const [verificationCode, setVerificationCode] = useState('123456');
  const [showCode, setShowCode] = useState(false);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    console.log(`Province: ${province}, Municipality: ${municipality}, Verification Code: ${verificationCode}`);
  };

  return (
    <React.Fragment>
      <h3>Municipality Signup Form</h3>

      <form onSubmit={handleSubmit}>
        <h4>Province</h4>
        <select value={province} onChange={(e) => setProvince(e.target.value)}>
          <option value="Gauteng">Gauteng</option>
          <option value="KwaZulu-Natal">KwaZulu-Natal</option>
          <option value="Western Cape">Western Cape</option>
          <option value="Eastern Cape">Eastern Cape</option>
          <option value="Limpopo">Limpopo</option>
          <option value="Mpumalanga">Mpumalanga</option>
          <option value="Northern Cape">Northern Cape</option>
          <option value="North West">North West</option>
          <option value="Free State">Free State</option>
        </select>

        <h4>Select your municipality</h4>
        <select value={municipality} onChange={(e) => setMunicipality(e.target.value)}>
          <option value="" disabled>Municipality</option>
          <option value="City of Ekurhuleni">Johannesburg</option>
          <option value="City of Johannesburg">Pretoria</option>
          <option value="City of Tshwane">Durban</option>
        </select>

        <h4>MyCity Verification Code</h4>
        <Input
          className="mt-10"
          type={showCode ? 'text' : 'password'}
          fullWidth
          color="primary"
          size="lg"
          placeholder="Verification Code"
          value={verificationCode}
          onChange={(e) => setVerificationCode(e.target.value)}
        />
        <Button className="mt-10" type="submit" rounded>
          Submit
        </Button>
      </form>
    </React.Fragment>
  );
}
