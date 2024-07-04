import React, { FormEvent, useEffect, useState } from "react";
import { Input, Button, Autocomplete, AutocompleteItem  } from "@nextui-org/react";
import axios from "axios";
import { UserRole } from "@/types/user.types";
import { handleSignUp } from "@/services/auth.service";


interface Municipality {
  municipality_id: string;
}


export default function CitizenSignup() {

  const [municipalities, setMunicipalities] = useState<Municipality[]>([]);
  const [selectedMunicipality, setSelectedMunicipality] = useState<string>("");


  useEffect(() => {
    // Fetch the municipalities when the component mounts
    const fetchMunicipalities = async () => {
      try {
        const response = await axios.get(
          "https://f1ihjeakmg.execute-api.af-south-1.amazonaws.com/api/municipality/municipalities-list",
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        setMunicipalities(response.data);
      } catch (error) {
        console.log("Error fetching municipalities: ", error);
      }
    };

    fetchMunicipalities();
  }, []);


  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget as HTMLFormElement);
    form.set("municipality", selectedMunicipality); // Append selected municipality to the form data

    try {
      handleSignUp(form, UserRole.CITIZEN);
    }
    catch (error) {
      console.log("Error: " + error);
    }

  };


  return (
    <div className="px-12">
      <form
        data-testid="citizen-signup-form"
        onSubmit={handleSubmit}
        className="flex flex-col gap-y-8 pt-8"
      >
        <Input
          variant={"bordered"}
          fullWidth
          label={
            <span className="font-semibold text-medium block mb-[0.20em]">
              First Name <span className="text-blue-500">*</span>
            </span>
          }
          labelPlacement={"outside"}
          classNames={{
            inputWrapper: "h-[3em]",
          }}
          type="text"
          name="firstname"
          autoComplete="new-firstname"
          placeholder="Jane"
          required
        />

        <Input
          variant={"bordered"}
          fullWidth
          label={
            <span className="font-semibold text-medium block mb-[0.20em]">
              Last Name <span className="text-blue-500">*</span>
            </span>
          }
          labelPlacement={"outside"}
          classNames={{
            inputWrapper: "h-[3em]",
          }}
          type="text"
          name="surname"
          autoComplete="new-surname"
          placeholder="Doe"
          required
        />

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

        <Autocomplete
          label={
            <span className="font-semibold text-medium block mb-[0.20em]">
              Municipality <span className="text-blue-500">*</span>
            </span>
          }
          labelPlacement="outside"
          name="municipality"
          placeholder="Select a municipality"
          fullWidth
          defaultItems={municipalities}
          disableSelectorIconRotation
          isClearable={false}
          menuTrigger={"input"}
          size={"lg"}
          onSelectionChange={(value) => setSelectedMunicipality(value as string)}
        >
          {(municipality) => (
            <AutocompleteItem key={municipality.municipality_id} textValue={municipality.municipality_id}>
              <span className="text-small">{municipality.municipality_id}</span>
            </AutocompleteItem>
          )}
        </Autocomplete>

        <Input
          variant={"bordered"}
          fullWidth
          label={
            <span className="font-semibold text-medium block mb-[0.20em]">
              Create Password <span className="text-blue-500">*</span>
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
          required
        />

        <Input
          variant={"bordered"}
          fullWidth
          label={
            <span className="font-semibold text-medium block mb-[0.20em]">
              Confirm Password <span className="text-blue-500">*</span>
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
          required
        />
        <Button
          name="submit"
          className="w-28 h-11 rounded-lg m-auto bg-blue-500 text-white font-semibold"
          type="submit"
        >
          Submit
        </Button>
      </form>
    </div>
  );
}
