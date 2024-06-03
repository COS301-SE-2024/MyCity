import React, { FormEvent, useState } from 'react';
import { Input, Button, Autocomplete, AutocompleteItem } from '@nextui-org/react';
import { Building2 } from 'lucide-react';

export default function MunicipalitySignup() {
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


  const provinces: Province[] = [
    { id: 0, name: "Gauteng" },
    { id: 1, name: "KwaZulu-Natal" },
    { id: 2, name: "Western Cape" },
    { id: 3, name: "Eastern Cape" },
    { id: 4, name: "Limpopo" },
    { id: 5, name: "Mpumalanga" },
    { id: 6, name: "Northen Cape" },
    { id: 7, name: "North West" },
    { id: 8, name: "Free State" }
  ];

  const municipalities: Municipality[] = [
    { id: 0, name: "City of Ekurhuleni" },
    { id: 1, name: "City of Johannesburg" },
    { id: 2, name: "City of Tshwane" },
  ];

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    // console.log(`Province: ${province}, Municipality: ${municipality}, Verification Code: ${verificationCode}`);
  };

  return (
    <div className="px-12">
      <form data-testid="municipality-signup-form" onSubmit={handleSubmit} className="flex flex-col gap-y-8 pt-8">


        <Autocomplete
          label={<span className="font-semibold text-medium">Province</span>}
          labelPlacement="outside"
          placeholder="Gauteng"
          defaultItems={provinces}
          fullWidth
          disableSelectorIconRotation
          isClearable={false}
          size={"lg"}
          type="text"
          name="province"
          autoComplete="new-province"
          menuTrigger={"input"}
          onChange={(event) => setProvince(event.target.value)}
        >
          {(province) => <AutocompleteItem key={province.id}>{province.name}</AutocompleteItem>}
        </Autocomplete>


        <Autocomplete
          label={<span className="font-semibold text-medium">Select Your Municipality</span>}
          labelPlacement="outside"
          placeholder="Municipality"
          fullWidth
          defaultItems={municipalities}
          disableSelectorIconRotation
          isClearable={false}
          menuTrigger={"input"}
          size={"lg"}
          type="text"
          name="municipality"
          autoComplete="new-municipality"
          onChange={(event) => setMunicipality(event.target.value)}
        >
          {(municipality) =>
            <AutocompleteItem key={municipality.id} textValue={municipality.name}>
              <div className="flex gap-2 items-center">
                <Building2 className="flex-shrink-0 text-blue-700" size={18} />
                <span className="text-small">{municipality.name}</span>
              </div>
            </AutocompleteItem>}
        </Autocomplete>

        <Input
          variant={"bordered"}
          fullWidth
          label="Email"
          labelPlacement={"outside"}
          classNames={{
            inputWrapper: "h-[3em]",
            label: "font-semibold text-medium mt-[-1px]"
          }}
          type="email"
          name="email"
          autoComplete="new-email"
          placeholder="example@gov.com"
          value={email} onChange={(e) => setEmail(e.target.value)}
        />


        <Button name="submit" className="w-28 h-11 rounded-lg m-auto bg-blue-500 text-white font-semibold" type="submit">
          Submit
        </Button>

      </form>
    </div>
  );
}
