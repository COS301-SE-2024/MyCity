import React, { FormEvent, useEffect, useState, useRef } from "react";
import {
  AutocompleteItem,
  Textarea,
  Button,
  Autocomplete,
} from "@nextui-org/react";
import { cn } from "@/lib/utils";
import { MapboxContextProps } from "@/context/MapboxContext";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import the CSS for the toast notifications
import { useProfile } from "@/hooks/useProfile";
import { FaultType } from "@/types/custom.types";
import { getFaultTypes, CreatTicket } from "@/services/tickets.service";

interface Props extends React.HTMLAttributes<HTMLElement> {
  useMapboxProp: () => MapboxContextProps;
}

export default function CreateTicketForm({ className, useMapboxProp }: Props) {
  const { selectedAddress } = useMapboxProp();
  const { getUserProfile } = useProfile();
  const formRef = useRef<HTMLFormElement>(null);
  const [faultTypes, setFaultTypes] = useState<FaultType[]>([]);
  const [selectedFault, setSelectedFault] = useState<string | null>(null);
  const [faultDescription, setFaultDescription] = useState<string>("");
  const [isFormValid, setIsFormValid] = useState<boolean>(false);

  useEffect(() => {
    async function fetchFaultTypes() {
      try {
        const data = await getFaultTypes();
        if (data && data.length > 0) {
          setFaultTypes(data);
        } else {
          setFaultTypes([]);
        }
      } catch (error) {
        console.error("Error fetching fault types:", error);
        setFaultTypes([]);
      }
    }

    fetchFaultTypes();
  }, []);

  useEffect(() => {
    if (selectedFault && faultDescription && selectedAddress) {
      setIsFormValid(true);
    } else {
      setIsFormValid(false);
    }
  }, [selectedFault, faultDescription, selectedAddress]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    const user_data = await getUserProfile();
    const formElement = formRef.current;
    
    if (!formElement || !(formElement instanceof HTMLFormElement)) {
      console.error("Form is not recognized as HTMLFormElement");
      return;
    }
  
    const formData = new FormData(formElement);  // Create FormData object
  
    // Adding additional fields manually if they are not in the form
    const latitude = selectedAddress?.lat || "";
    const longitude = selectedAddress?.lng || "";
    const fullAddress = `${selectedAddress?.street?.name || ''}, ${selectedAddress?.county || ''}, ${selectedAddress?.city || ''}, ${selectedAddress?.administrative || ''}`;
    
    formData.append("latitude", String(latitude));
    formData.append("longitude", String(longitude));
    formData.append("address", fullAddress);
    formData.append("username", user_data.current?.email || "");
    formData.append("state", "OPEN");
  
    try {
      const sessiont = user_data.current?.session_token || "";
      const isCreated = await CreatTicket(sessiont, formData);
      
      if (isCreated) {
        toast.success("Ticket created successfully!");
      } else {
        throw new Error("Ticket creation failed");
      }
    } catch (error: any) {
      console.error("Error:", error);
      toast.error(`Error: ${error.message}`);
    }
  };
  

  return (
    <div className={cn("", className)}>
      <ToastContainer />

      <div className="py-8 flex flex-col items-center justify-center">
        <span className="text-[2.2rem] font-bold">Create a Fault Ticket</span>
        <div className="px-10 w-full">
          <form
            ref={formRef}
            onSubmit={handleSubmit}
            className="flex flex-col gap-y-8 pt-8"
          >
            {faultTypes.length > 0 ? (
              <Autocomplete
                label={
                  <span className="font-semibold text-sm">
                    Fault type <sup className="text-blue-500">*</sup>
                  </span>
                }
                labelPlacement="outside"
                name="fault-type"
                placeholder="Fault Type"
                fullWidth
                defaultItems={faultTypes}
                disableSelectorIconRotation
                isClearable={false}
                menuTrigger={"input"}
                size={"lg"}
                type="text"
                autoComplete="new-fault"
                onSelectionChange={(key) => setSelectedFault(key as string)}
              >
                {(faultType) => (
                  <AutocompleteItem
                    key={faultType.asset_id}
                    textValue={faultType.asset_id}
                  >
                    <div className="flex gap-2 items-center">
                      <img
                        src={faultType.assetIcon}
                        alt={faultType.asset_id}
                        width={6}
                        height={6}
                        className="flex-shrink-0 w-6 h-6"
                      />
                      <span className="text-small">{faultType.asset_id}</span>
                    </div>
                  </AutocompleteItem>
                )}
              </Autocomplete>
            ) : (
              <p>Loading fault types...</p>
            )}
            <Textarea
              label={<span className="font-semibold text-sm">Description</span>}
              labelPlacement="outside"
              name="fault-description"
              placeholder="Add Description..."
              onChange={(e) => setFaultDescription(e.target.value)}
            />
            <div>
              <span className="font-semibold text-sm">Selected Address:</span>
              <div className="flex flex-col gap-y-0.5 text-xs ps-2">
                <span>{selectedAddress?.street?.name}</span>
                <span>{selectedAddress?.county}</span>
                <span>{selectedAddress?.city}</span>
                <span>{selectedAddress?.administrative}</span>
              </div>
            </div>
            <Button
              type="submit"
              disabled={!isFormValid}
              className={`m-auto w-24 px-4 py-2 font-bold rounded-3xl transition duration-300 ${isFormValid
                  ? "bg-blue-500 text-white hover:bg-blue-600"
                  : "bg-blue-200 text-white cursor-not-allowed"
                }`}
            >
              Submit
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
