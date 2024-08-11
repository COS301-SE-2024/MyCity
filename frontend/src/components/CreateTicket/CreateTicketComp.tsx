import React, { FormEvent, useEffect, useState, useMemo, useCallback, useRef } from "react";
import { AutocompleteItem, Textarea, Button, Autocomplete } from "@nextui-org/react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useProfile } from "@/hooks/useProfile";
import { FaultType } from "@/types/custom.types";
import { getFaultTypes, CreatTicket } from "@/services/tickets.service";
import { MapboxContextProps } from "@/context/MapboxContext";
import { cn } from "@/lib/utils";
import { Locate, Pin, PinOff, Info } from "lucide-react";
import { PlaceKit, PlaceKitOptions } from "@placekit/autocomplete-react";
import CustomMarker from "../../../public/customMarker.svg";
import { PKResult } from "@placekit/client-js";
import "@placekit/autocomplete-js/dist/placekit-autocomplete.css";

interface Props extends React.HTMLAttributes<HTMLElement> {
  useMapboxProp: () => MapboxContextProps;
}

const CreateTicketComp: React.FC<Props> = ({ className, useMapboxProp }) => {
  const { selectedAddress, map, initialiseMap, dropPin, panMapTo, panToCurrentLocation } = useMapboxProp();
  const { getUserProfile } = useProfile();
  const formRef = useRef<HTMLFormElement>(null);
  const mapContainer = useRef<HTMLDivElement>(null);

  const [faultTypes, setFaultTypes] = useState<FaultType[]>([]);
  const [selectedFault, setSelectedFault] = useState<string | null>(null);
  const [faultDescription, setFaultDescription] = useState<string>("");
  const [isFormValid, setIsFormValid] = useState<boolean>(false);
  const [isPinDropped, setIsPinDropped] = useState(false);
  const [tooltipVisible, setTooltipVisible] = useState(true);

  const memoizedApiKey = useMemo(() => String(process.env.PLACEKIT_API_KEY), []);

  const pkaOptions: PlaceKitOptions = {
    countries: ["za"],
    countryAutoFill: false,
    countrySelect: false,
    timeout: 5000,
    maxResults: 5,
    types: ["street"],
    language: "en",
  };

  useEffect(() => {
    async function fetchFaultTypes() {
      try {
        const data = await getFaultTypes();
        setFaultTypes(data || []);
      } catch (error) {
        console.error("Error fetching fault types:", error);
        setFaultTypes([]);
      }
    }

    fetchFaultTypes();
  }, []);

  useEffect(() => {
    setIsFormValid(!!(selectedFault && faultDescription && selectedAddress));
  }, [selectedFault, faultDescription, selectedAddress]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const user_data = await getUserProfile();
    const formcovert = formRef.current;

    if (!formcovert || !(formcovert instanceof HTMLFormElement)) {
      console.error("Form is not recognized as HTMLFormElement");
      return;
    }

    const form = new FormData(formcovert);
    const latitude = selectedAddress?.lat;
    const longitude = selectedAddress?.lng;
    const fullAddress = `${selectedAddress?.street?.name}, ${selectedAddress?.county}, ${selectedAddress?.city}, ${selectedAddress?.administrative}`;
    const selectedFault = form.get("fault-type");
    const faultDescription = form.get("fault-description");

    if (!selectedFault) {
      toast.error("Fault type is required!");
      return;
    }

    const userData = await getUserProfile();
    if (!userData.current) {
      toast.error("Please log in if you wish to create a ticket.");
      return;
    }

    try {
      const sessiont = user_data.current?.session_token || " ";
      const isCreated = await CreatTicket(
        sessiont,
        String(selectedFault),
        String(faultDescription),
        String(latitude),
        String(longitude),
        String(fullAddress),
        String(userData.current.email)
      );
      if (isCreated === true) {
        toast.success("Ticket created successfully!");
      } else {
        throw new Error("Ticket creation failed");
      }
    } catch (error: any) {
      console.error("Error:", error);
      toast.error(`Error: ${error.message}`);
    }
  };

  const handleSuggestionPick = useCallback(
    (value: string, item: PKResult, index: number) => {
      setIsPinDropped(true);
      dropPin(true, item);
      panMapTo(item.lng, item.lat);
    },
    [dropPin, panMapTo]
  );

  const onPinClick = () => {
    setIsPinDropped(!isPinDropped);
    dropPin(!isPinDropped);
  };

  useEffect(() => {
    if (mapContainer.current) {
      initialiseMap(mapContainer);
    }
  }, [initialiseMap]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setTooltipVisible(false);
    }, 10000);

    return () => clearTimeout(timer);
  }, []);

  const handleTooltipToggle = () => {
    setTooltipVisible(true);
    const timer = setTimeout(() => {
      setTooltipVisible(false);
    }, 10000);
    return () => clearTimeout(timer);
  };

  return (
    <div className="flex justify-center items-center h-full w-full px-4">
      <ToastContainer />
  
      <div className="flex w-full max-w-screen-xl h-[40rem] rounded-lg overflow-hidden">
        
        {/* Form Section */}
        <div className="w-1/2 p-6 bg-white flex flex-col justify-center">
          <h2 className="text-2xl text-center font-bold mb-6">Create a Fault Ticket</h2> {/* Added Heading */}
          <form
            ref={formRef}
            onSubmit={handleSubmit}
            className="flex flex-col gap-y-8"
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
              className={cn(
                "m-auto w-24 px-4 py-2 font-bold rounded-3xl transition duration-300",
                isFormValid
                  ? "bg-blue-500 text-white hover:bg-blue-600"
                  : "bg-blue-200 text-white cursor-not-allowed"
              )}
            >
              Submit
            </Button>
          </form>
        </div>
  
        {/* Map Section */}
        <div className="w-1/2 relative bg-gray-200">
          <div className="absolute flex flex-col gap-y-5 bottom-10 right-5 z-30">
            <Button
              className="min-w-fit h-fit p-2 bg-white"
              onClick={panToCurrentLocation}
            >
              <Locate size={21} />
            </Button>
            <Button className="min-w-fit h-fit p-2 bg-white" onClick={onPinClick}>
              {!isPinDropped ? <Pin size={21} /> : <PinOff size={21} />}
            </Button>
          </div>
  
          <div className="absolute top-5 left-5 z-30 w-72">
            <PlaceKit
              apiKey={memoizedApiKey}
              options={pkaOptions}
              className="w-full"
              onPick={handleSuggestionPick}
              placeholder="Search for an address..."
            />
          </div>
  
          {!isPinDropped && (
            <div className="absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] z-40">
              <CustomMarker fill="#BE0505" />
            </div>
          )}
  
          <div className="absolute text-sm bottom-5 left-1/2 transform -translate-x-1/2 z-40 p-4 bg-white bg-opacity-90 border rounded-lg shadow-lg text-black text-center max-w-sm">
            <div className="flex justify-center cursor-pointer" onClick={handleTooltipToggle}>
              <Info size={24} className="text-blue-500" />
            </div>
            {tooltipVisible && (
              <p>Click on the pin in the bottom right corner to select this location as the fault address.</p>
            )}
          </div>
  
          <div className="w-full h-full relative" ref={mapContainer}></div>
        </div>
      </div>
    </div>
  );
  
  


};

export default CreateTicketComp;
