import React, { useState } from 'react';
import { Input, Button, Autocomplete, AutocompleteItem } from '@nextui-org/react';
import { Building2, CircleHelp } from 'lucide-react';

export default function MunicipalityLogin() {
  const [municipality, setMunicipality] = useState('');
  const [password, setPassword] = useState('');


  type Municipality = {
    id: number | string;
    name: string;
  };


  const municipalities: Municipality[] = [
    { id: 0, name: "City of Ekurhuleni" },
    { id: 1, name: "City of Johannesburg" },
    { id: 2, name: "City of Tshwane" },
  ];

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // console.log(`Province: ${province}, Municipality: ${municipality}, Verification Code: ${verificationCode}`);
  };

  return (
    <div className="px-12">
      <form onSubmit={handleSubmit} className="flex flex-col gap-y-8 pt-8">

        <Autocomplete
          label={<span className="font-semibold text-medium">Select Your Municipality</span>}
          labelPlacement="outside"
          placeholder="Municipality"
          fullWidth
          defaultItems={municipalities}
          disableSelectorIconRotation
          isClearable={false}
          type="text"
          autoComplete="new-municipality"
          menuTrigger={"input"}
          size={"lg"}
          onChange={(event) => setMunicipality(event.target.value)}
        >
          {(municipality) =>
            <AutocompleteItem key={municipality.id} textValue={municipality.name}>
              <div className="flex gap-2 items-center">
                <Building2 className="flex-shrink-0 text-orange-700" size={18} />
                <span className="text-small">{municipality.name}</span>
              </div>
            </AutocompleteItem>}
        </Autocomplete>

        <Input
          variant={"bordered"}
          fullWidth
          label={<span className="font-semibold text-medium mb-[0.20em] flex items-center align-middle">MuniCode<sup>TM</sup> <CircleHelp className="ml-2.5 text-orange-500" size={20} /></span>}
          labelPlacement={"outside"}
          classNames={{
            inputWrapper: "h-[3em]",
          }}
          type="password"
          autoComplete="new-password"
          placeholder="Password"
          value={password}
          onChange={(event) => setPassword(event.target.value)} />

        <Button className="w-28 h-11 rounded-lg m-auto bg-orange-500 text-white font-semibold" type="submit">
          Submit
        </Button>

      </form>
    </div>
  );
}
