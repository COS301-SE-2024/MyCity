import React, {
  useState,
  useRef,
  useEffect,
  useMemo,
  useCallback,
  FormEvent,
} from "react";
import { useProfile } from "@/hooks/useProfile";
import { FaultType } from "@/types/custom.types";
import { getFaultTypes, CreatTicket } from "@/services/tickets.service";
import { PlaceKit, PlaceKitOptions } from "@placekit/autocomplete-react";
import { PKResult } from "@placekit/client-js";
import { useMapbox } from "@/hooks/useMapbox";
import { cn } from "@/lib/utils";
import { FiMap, FiArrowRight, FiX } from "react-icons/fi";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  AutocompleteItem,
  Textarea,
  Button,
  Autocomplete,
  ButtonGroup,
} from "@nextui-org/react";
import { FiMapPin } from "react-icons/fi";

const CreateTicketCompMobile: React.FC = () => {
  const [faultTypes, setFaultTypes] = useState<FaultType[]>([]);
  const [selectedFault, setSelectedFault] = useState<string | null>(null);
  const [faultDescription, setFaultDescription] = useState<string>("");
  const [isFormValid, setIsFormValid] = useState<boolean>(false);
  const [isMapOpen, setIsMapOpen] = useState(false);

  // Directly using the useMapbox hook
  const { selectedAddress, initialiseMap, dropPin, panMapTo } = useMapbox();
  const { getUserProfile } = useProfile();
  const formRef = useRef<HTMLFormElement>(null);
  const mapContainer = useRef<HTMLDivElement>(null);

  const memoizedApiKey = useMemo(
    () => String(process.env.PLACEKIT_API_KEY),
    []
  );

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

  const handleSuggestionPick = useCallback(
    (value: string, item: PKResult, index: number) => {
      dropPin(true, item);
      panMapTo(item.lng, item.lat);
    },
    [dropPin, panMapTo]
  );

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

    if (!user_data.current) {
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
        String(user_data.current.email)
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

  useEffect(() => {
    if (isMapOpen && mapContainer.current) {
      initialiseMap(mapContainer);
    }
  }, [isMapOpen, initialiseMap]);

  return (
    <div className="flex flex-col justify-center items-center h-full w-full px-4 rounded-3xl overflow-hidden">
      <ToastContainer />

      <div className="w-full max-w-screen-md p-6 bg-white flex flex-col rounded-3xl justify-center overflow-y-auto">
        {/* Heading */}
        <h2 className="text-2xl text-center font-bold mt-2 mb-6">
          Report a Fault
        </h2>{" "}
        <form
          ref={formRef}
          onSubmit={handleSubmit}
          className="flex flex-col gap-y-4"
        >
          {/* Fault Type */}
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

          {/* Description */}
          <Textarea
            label={<span className="font-semibold text-sm">Description</span>}
            labelPlacement="outside"
            name="fault-description"
            placeholder="Add Description..."
            onChange={(e) => setFaultDescription(e.target.value)}
          />

          {/* Address */}
          <div className="w-full">
            <span className="font-semibold text-sm">Address:</span>
            <PlaceKit
              apiKey={memoizedApiKey}
              options={pkaOptions}
              className="w-full"
              onPick={handleSuggestionPick}
              placeholder="Search for an address..."
            />

            <div>
              <div className="flex flex-col gap-y-0.5 text-xs ps-2">
                <span>{selectedAddress?.street?.name}</span>
                <span>{selectedAddress?.county}</span>
                <span>{selectedAddress?.city}</span>
                <span>{selectedAddress?.administrative}</span>
              </div>
            </div>
          </div>

          {/* Map Toggle */}
          <div
            className="flex items-center justify-center mt-4 cursor-pointer"
            onClick={() => setIsMapOpen(true)}
          >
            <FiMap size={24} className="text-blue-500" />
            <FiArrowRight size={24} className="text-blue-500 ml-2" />
          </div>

          {/* Fault Severity */}
          <div>
            <span className="font-semibold text-sm">Fault Severity</span>
            <div className="flex h-[2.5rem] justify-center">
              <ButtonGroup aria-label="Basic example" className="flex h-full">
                <Button
                  variant="bordered"
                  className={`h-full ${
                    selectedFault === "Minor" ? "border-blue-500 border-2" : ""
                  }`}
                  onClick={() => setSelectedFault("Minor")}
                >
                  <div className="flex flex-col min-w-24 px-1 font-sm rounded-2xl justify-center items-center h-full">
                    <img
                      width="20"
                      height="auto"
                      src="https://mycity-storage-bucket.s3.eu-west-1.amazonaws.com/resources/fault_icon_minor.webp"
                      alt="Minor"
                    />
                    Minor
                  </div>
                </Button>
                <Button
                  variant="bordered"
                  className={`h-full ${
                    selectedFault === "Major" ? "border-blue-500 border-2" : ""
                  }`}
                  onClick={() => setSelectedFault("Major")}
                >
                  <div className="flex flex-col min-w-24 px-1 font-sm rounded-2xl justify-center items-center h-full">
                    <img
                      width="20"
                      height="auto"
                      src="https://mycity-storage-bucket.s3.eu-west-1.amazonaws.com/resources/fault_icon_major.webp"
                      alt="Major"
                    />
                    Major
                  </div>
                </Button>
                <Button
                  variant="bordered"
                  className={`h-full ${
                    selectedFault === "Critical"
                      ? "border-blue-500 border-2"
                      : ""
                  }`}
                  onClick={() => setSelectedFault("Critical")}
                >
                  <div className="flex flex-col min-w-24 px-1 font-sm rounded-2xl justify-center items-center h-full">
                    <img
                      width="20"
                      height="auto"
                      src="https://mycity-storage-bucket.s3.eu-west-1.amazonaws.com/resources/fault_icon_critical.webp"
                      alt="Critical"
                    />
                    Critical
                  </div>
                </Button>
              </ButtonGroup>
            </div>
          </div>

          {/* Submit Button */}
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

      {/* Map Modal */}
{/* Map Modal */}
{isMapOpen && (
  <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex flex-col items-center justify-center">
    <div className="w-full h-full relative bg-white">
      {/* Button to close the map and return to the form view */}
      <div
        className="absolute top-4 left-4 z-50 text-black cursor-pointer bg-white p-2 rounded-full shadow-lg flex items-center"
        onClick={() => setIsMapOpen(false)}
      >
        <FiArrowRight size={24} className="text-blue-500 rotate-180 mr-2" /> Back to Form
      </div>

      {/* Button to pin current location */}
      <div
        className="absolute bottom-10 left-4 z-50 text-black cursor-pointer bg-white p-2 rounded-full shadow-lg"
        onClick={() => {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const { latitude, longitude } = position.coords;

              // Create a partial PKResult object with necessary fields
              const location: Partial<PKResult> = {
                lng: longitude,
                lat: latitude,
                name: "Current Location", // Use a placeholder or actual name if available
                city: "",
                county: "",
                administrative: "",
              };

              panMapTo(longitude, latitude);
              dropPin(true, location as PKResult); // Cast to PKResult to satisfy TypeScript
            },
            (error) => {
              console.error("Error fetching location:", error);
              toast.error("Could not get current location.");
            }
          );
        }}
      >
        <FiMapPin size={24} className="text-black" /> {/* Updated to FiMapPin icon and set to black */}
      </div>

      {/* Info Box */}
      <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 z-50 p-4 bg-white bg-opacity-90 border rounded-lg shadow-lg text-black text-center max-w-sm">
        <p>
          Click on the map to place a pin, or use the button on the left to pin your current location.
        </p>
      </div>

      {/* Map Container */}
      <div className="w-full h-full relative z-40" ref={mapContainer}></div>
    </div>
  </div>
)}


    </div>
  );
};

export default CreateTicketCompMobile;
