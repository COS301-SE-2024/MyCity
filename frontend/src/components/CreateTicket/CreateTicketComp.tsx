import React, {
  FormEvent,
  useEffect,
  useState,
  useMemo,
  useCallback,
  useRef,
} from "react";
import {
  AutocompleteItem,
  Textarea,
  Button,
  Autocomplete,
  ButtonGroup,
} from "@nextui-org/react";
import { useDropzone } from "react-dropzone";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useProfile } from "@/hooks/useProfile";
import { FaultType } from "@/types/custom.types";
import { getFaultTypes, CreatTicket } from "@/services/tickets.service";
import { MapboxContextProps } from "@/context/MapboxContext";
import { cn } from "@/lib/utils";
import { Locate, Pin, PinOff, Info } from "lucide-react";
import { FiMapPin, FiArrowRight, FiMap } from "react-icons/fi";
import { PlaceKit, PlaceKitOptions } from "@placekit/autocomplete-react";
import CustomMarker from "../../../public/customMarker.svg";
import { PKResult } from "@placekit/client-js";
import "@placekit/autocomplete-js/dist/placekit-autocomplete.css";
import CameraPrompt from "@/components/Camera/CameraPrompt";

interface Props extends React.HTMLAttributes<HTMLElement> {
  useMapboxProp: () => MapboxContextProps;
}

const CreateTicketComp: React.FC<Props> = ({ className, useMapboxProp }) => {
  const [dataURL, setDataURL] = useState<string | null>(null);
  const [uploadedURL, setUploadedURL] = useState<File[]>([]);
  const [file, setFile] = useState<File>();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    acceptedFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        const fileAsDataURL = reader.result;
        setDataURL(fileAsDataURL as string);
      };
      reader.onerror = () => {
        toast.error(`Error reading file: ${file.name}`);
      };
      reader.readAsDataURL(file);
    });
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const [coordinates, setCoordinates] = useState<{
    latitude: number | null;
    longitude: number | null;
  }>({
    latitude: null,
    longitude: null,
  });
  const [error, setError] = useState<string | null>(null);

  const {
    selectedAddress,
    map,
    initialiseMap,
    dropPin,
    panMapTo,
    panToCurrentLocation,
  } = useMapboxProp();
  const { getUserProfile } = useProfile();
  const formRef = useRef<HTMLFormElement>(null);
  const formRefmobile = useRef<HTMLFormElement>(null);
  const mapContainer = useRef<HTMLDivElement>(null);

  const [faultTypes, setFaultTypes] = useState<FaultType[]>([]);
  const [selectedFault, setSelectedFault] = useState<string | null>(null);
  const [faultDescription, setFaultDescription] = useState<string>("");
  const [isFormValid, setIsFormValid] = useState<boolean>(false);
  const [isPinDropped, setIsPinDropped] = useState(false);
  const [tooltipVisible, setTooltipVisible] = useState(true);
  const [isClient, setIsClient] = useState(false);
  const [isMapOpen, setIsMapOpen] = useState(false); // For mobile map modal
  const [selectedImage, setSelectedImage] = useState<string | ArrayBuffer | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

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
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCoordinates({ latitude, longitude });
        },
        (error) => {
          setError(error.message);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    } else {
      setError("Geolocation is not supported by this browser.");
    }
  }, []);

  useEffect(() => {
    setIsClient(true);

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
    const form_sending = new FormData();

    if (!formcovert || !(formcovert instanceof HTMLFormElement)) {
      console.error("Form is not recognized as HTMLFormElement");
      return;
    }

    if(!file)
    {
      toast.error("Please upload a image");
      return;
    }

    const form = new FormData(formcovert);
    const latitude = selectedAddress?.lat;
    const longitude = selectedAddress?.lng;
    const fullAddress = `${selectedAddress?.street?.name}, ${selectedAddress?.county}, ${selectedAddress?.city}, ${selectedAddress?.administrative}`;
    const selectedFault = form.get("fault-type");
    const faultDescription = form.get("fault-description");
    const user_email = String(user_data.current?.email);

    if (!selectedFault) {
      toast.error("Fault type is required!");
      return;
    }

    if (!user_data.current) {
      toast.error("Please log in if you wish to create a ticket.");
      return;
    }

    form_sending.append("latitude", String(latitude))
    form_sending.append("longitude", String(longitude))
    form_sending.append("address", String(fullAddress))
    form_sending.append("asset", String(selectedFault))
    form_sending.append("description", String(faultDescription))
    form_sending.append("state", "Opened")
    form_sending.append("username", user_email.toLowerCase())
    form_sending.append("file",file);

    try {
      const sessiont = user_data.current?.session_token || " ";
      const isCreated = await CreatTicket(
        sessiont,
        form_sending
      );
      console.log(isCreated)
      if (isCreated === true) {
        toast.success("Ticket created successfully!");
        window.location.href = "/dashboard/citizen";
      } else {
        throw new Error("Ticket creation failed");
      }
    } catch (error: any) {
      console.error("Error:", error);
      toast.error(`Error: ${error.message}`);
    }
  };
////////handle div
  const handleDivClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  //////handling image
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      console.log("Selected file:", e.target.files[0]);
      setFile(e.target.files[0]);
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  }

  ////////////Handle submit for mobile
  const handleSubmitMobile = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const user_data = await getUserProfile();
    const formcovert = formRefmobile.current;
    const form_sending = new FormData();

    if (!formcovert || !(formcovert instanceof HTMLFormElement)) {
      console.error("Form is not recognized as HTMLFormElement");
      return;
    }

    if(!file)
    {
      toast.error("Please upload a image");
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

    form_sending.append("latitude", String(latitude))
    form_sending.append("longitude", String(longitude))
    form_sending.append("address", String(fullAddress))
    form_sending.append("asset", String(selectedFault))
    form_sending.append("description", String(faultDescription))
    form_sending.append("state", "Opened")
    form_sending.append("username", String(user_data.current?.email))
    form_sending.append("file",file);

    try {
      const sessiont = user_data.current?.session_token || " ";
      const isCreated = await CreatTicket(
        sessiont,
        form_sending
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

  const [selectedSeverity, setSelectedSeverity] = useState("Minor");

  const handleSelect = (severity: string) => {
    setSelectedSeverity(severity);
  };
  const getButtonStyle = (severity: string) => {
    return selectedSeverity === severity ? "border-blue-500 border-3" : "";
  };

  return (
    <div className="flex justify-center items-center h-full w-full px-4 overflow-hidden">
      <ToastContainer />

      {/* Desktop View */}
<div className="hidden sm:flex w-full max-w-screen-xl h-[40rem] rounded-lg overflow-hidden z-10">
  {/* Form Section */}
  <div className="w-1/2 p-6 bg-white flex flex-col overflow-hidden">
    <h2 className="text-2xl text-center font-bold mt-2 mb-6">
      Report a Fault
    </h2>
    <div className="flex-1 overflow-y-auto">
      <form
        ref={formRef}
        onSubmit={handleSubmit}
        className="flex flex-col gap-y-8"
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

        {/* Fault Severity */}
        <div>
          <span className="font-semibold text-sm">Fault Severity</span>
          <div className="flex h-[3.5rem] justify-center">
            <ButtonGroup aria-label="Basic example" className="flex h-full">
              <Button
                variant="bordered"
                className={`h-full ${getButtonStyle("Minor")}`}
                onClick={() => handleSelect("Minor")}
              >
                <div className="flex flex-col min-w-32 px-2 font-sm rounded-3xl justify-center items-center h-full">
                  <img
                    width="25"
                    height="auto"
                    src="https://mycity-storage-bucket.s3.eu-west-1.amazonaws.com/resources/fault_icon_minor.webp"
                    alt="Minor"
                  />
                  Minor
                </div>
              </Button>
              <Button
                variant="bordered"
                className={`h-full ${getButtonStyle("Major")}`}
                onClick={() => handleSelect("Major")}
              >
                <div className="flex flex-col min-w-32 px-2 font-sm rounded-3xl justify-center items-center h-full">
                  <img
                    width="25"
                    height="auto"
                    src="https://mycity-storage-bucket.s3.eu-west-1.amazonaws.com/resources/fault_icon_major.webp"
                    alt="Major"
                  />
                  Major
                </div>
              </Button>
              <Button
                variant="bordered"
                className={`h-full ${getButtonStyle("Critical")}`}
                onClick={() => handleSelect("Critical")}
              >
                <div className="flex flex-col min-w-32 px-2 font-sm rounded-3xl justify-center items-center h-full">
                  <img
                    width="25"
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

        {/* Image Upload */}
        <div className="flex flex-col">
          <span className="font-semibold text-sm mb-2">Attach Image</span>
          <div className="flex border rounded-lg overflow-hidden">
            {/* Camera upload */}
            <div className="flex justify-center p-2 w-1/5 bg-gray-100">
              <img
                src="https://mycity-storage-bucket.s3.eu-west-1.amazonaws.com/resources/camera_icon.webp"
                alt="Camera Icon"
                className="h-10 w-10"
              />
            </div>

            {/* Drag and drop */}
            <div className="flex border-l w-4/5 p-3 bg-white">
              <div
                className="w-full flex justify-center items-center"
                {...getRootProps()}
              >
                <input {...getInputProps()} />
                {isDragActive ? (
                  <div>
                    <svg
                      xmlns="https://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      height="40"
                      width="40"
                    >
                      <path
                        d="M1 14.5C1 12.1716 2.22429 10.1291 4.34315 8.65685C6.46201 7.18458 9.03799 6.5 12 6.5C14.962 6.5 17.538 7.18458 19.6569 8.65685C21.7757 10.1291 23 12.1716 23 14.5V15.5C23 17.8284 21.7757 19.8709 19.6569 21.3431C17.538 22.8154 14.962 23.5 12 23.5C9.03799 23.5 6.46201 22.8154 4.34315 21.3431C2.22429 19.8709 1 17.8284 1 15.5V14.5Z"
                        stroke="#333"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                ) : (
                  <div className="text-sm text-gray-600" onClick={handleDivClick}  >
                    Drag & drop files here, or click to browse
                    <input
                    type="file"
                    ref={fileInputRef}
                    style={{ display: "none" }}
                    accept="image/*"
                    name="picture"
                    onClick={(e) => e.stopPropagation()} 
                    onChange={handleImageChange}
                  />
                  {selectedImage && (
                    <div>
                      <h2>Image Preview:</h2>
                      <img src={String(selectedImage)} alt="Uploaded" style={{ maxWidth: "50%", height: "auto" }} />
                    </div>
                  )}
                  </div>
                )}
              </div>
            </div>
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
  </div>

  {/* Graphical Section */}
  <div className="w-1/2 relative bg-gray-200">
    {/* Map Section */}
    <div>
      <div className="absolute flex flex-col gap-y-5 bottom-10 right-5 z-30">
        <Button
          className="min-w-fit h-fit p-2 bg-white"
          onClick={panToCurrentLocation}
        >
          <Locate size={21} />
        </Button>
        <Button
          className="min-w-fit h-fit p-2 bg-white"
          onClick={onPinClick}
        >
          {!isPinDropped ? <Pin size={21} /> : <PinOff size={21} />}
        </Button>
      </div>

      {!isPinDropped && (
        <div className="absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] z-40">
          <CustomMarker fill="#BE0505" />
        </div>
      )}

      <div className="absolute text-sm bottom-5 left-1/2 transform -translate-x-1/2 z-40 p-4 bg-white bg-opacity-90 border rounded-lg shadow-lg text-black text-center max-w-sm">
        <div
          className="flex justify-center cursor-pointer"
          onClick={handleTooltipToggle}
        >
          <Info size={24} className="text-blue-500" />
        </div>
        {tooltipVisible && (
          <p>
            Click on the pin in the bottom right corner to select this
            location as the fault address.
          </p>
        )}
      </div>

      <div className="w-full h-full relative" ref={mapContainer}></div>
    </div>
  </div>
</div>


      {/* Mobile View */}
      <div className="block sm:hidden flex flex-col justify-center items-center h-full w-full px-2 rounded-3xl overflow-hidden">
        <ToastContainer />

        <div className="w-full max-w-screen-md p-6 bg-white flex flex-col rounded-3xl justify-center overflow-y-auto">
          {/* Heading */}
          <h2 className="text-2xl text-center font-bold mt-2 mb-6">
            Report a Fault
          </h2>
          <form
            ref={formRefmobile}
            onSubmit={handleSubmitMobile}
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
  <div className="flex h-[2.5rem] justify-center space-x-2">
    <ButtonGroup aria-label="Basic example" className="flex h-full w-full">
      <Button
        variant="bordered"
        className={`flex-1 h-full ${
          selectedFault === "Minor" ? "border-blue-500 border-2" : ""
        }`}
        onClick={() => setSelectedFault("Minor")}
      >
        <div className="flex flex-col px-1 font-sm rounded-2xl justify-center items-center h-full">
          <img
            width="20"
            height="auto"
            src="https://mycity-storage-bucket.s3.eu-west-1.amazonaws.com/resources/fault_icon_minor.webp"
            alt="Minor"
          />
        </div>
      </Button>
      <Button
        variant="bordered"
        className={`flex-1 h-full ${
          selectedFault === "Major" ? "border-blue-500 border-2" : ""
        }`}
        onClick={() => setSelectedFault("Major")}
      >
        <div className="flex flex-col px-1 font-sm rounded-2xl justify-center items-center h-full">
          <img
            width="20"
            height="auto"
            src="https://mycity-storage-bucket.s3.eu-west-1.amazonaws.com/resources/fault_icon_major.webp"
            alt="Major"
          />
        </div>
      </Button>
      <Button
        variant="bordered"
        className={`flex-1 h-full ${
          selectedFault === "Critical" ? "border-blue-500 border-2" : ""
        }`}
        onClick={() => setSelectedFault("Critical")}
      >
        <div className="flex flex-col px-1 font-sm rounded-2xl justify-center items-center h-full">
          <img
            width="20"
            height="auto"
            src="https://mycity-storage-bucket.s3.eu-west-1.amazonaws.com/resources/fault_icon_critical.webp"
            alt="Critical"
          />
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
                "m-auto w-24 px-4 py-2 font-bold rounded-3xl transition duration-300 z-0",
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
        {isMapOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex flex-col items-center justify-center">
            <div className="w-full h-full relative bg-white">
              {/* Button to close the map and return to the form view */}
              <div
                className="absolute top-4 left-4 z-50 text-black cursor-pointer bg-white p-2 rounded-full shadow-lg flex items-center"
                onClick={() => setIsMapOpen(false)}
              >
                <FiArrowRight
                  size={24}
                  className="text-blue-500 rotate-180 mr-2"
                />{" "}
                Back to Form
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
                <FiMapPin size={24} className="text-black" />
              </div>

              {/* Info Box */}
              <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 z-50 p-4 bg-white bg-opacity-90 border rounded-lg shadow-lg text-black text-center max-w-sm">
                <p>
                  Click on the map to place a pin, or use the button on the left
                  to pin your current location.
                </p>
              </div>

              {/* Map Container */}
              <div
                className="w-full h-full relative z-40"
                ref={mapContainer}
              ></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateTicketComp;
