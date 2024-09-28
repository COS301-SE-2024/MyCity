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
} from "@nextui-org/react";
import { useDropzone } from "react-dropzone";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useProfile } from "@/hooks/useProfile";
import { FaultType } from "@/types/custom.types";
import { getFaultTypes, CreatTicket } from "@/services/tickets.service";
import { useMapbox } from "@/hooks/useMapbox";
import dynamic from "next/dynamic";
import CustomMarker from "../../../public/customMarker.svg";
import { PlaceKit, PlaceKitOptions } from "@placekit/autocomplete-react";
import { PKResult } from "@placekit/client-js";
import "@placekit/autocomplete-js/dist/placekit-autocomplete.css";
import { FiMapPin, FiArrowRight } from "react-icons/fi";
import { cn } from "@/lib/utils";
import { Locate, Pin, PinOff, Info } from "lucide-react";
import Image from "next/image";

const MapboxMap = dynamic(() => import("../MapboxMap/MapboxMap"), {
  ssr: false,
});

const CreateTicketMobile: React.FC = () => {
  const [dataURL, setDataURL] = useState<string | null>(null);
  const [file, setFile] = useState<File>();
  const [selectedImage, setSelectedImage] = useState<
    string | ArrayBuffer | null
  >(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [coordinates, setCoordinates] = useState<{
    latitude: number | null;
    longitude: number | null;
  }>({ latitude: null, longitude: null });
  const [faultTypes, setFaultTypes] = useState<FaultType[]>([]);
  const [selectedFault, setSelectedFault] = useState<string | null>(null);
  const [faultDescription, setFaultDescription] = useState<string>("");
  const [isFormValid, setIsFormValid] = useState<boolean>(false);
  const [isMarkerDropped, setIsMarkerDropped] = useState(false);
  const [tooltipVisible, setTooltipVisible] = useState(true);
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    selectedAddress,
    dropMarker,
    liftMarker,
    flyTo,
    flyToCurrentLocation,
  } = useMapbox();
  const { getUserProfile } = useProfile();
  const formRef = useRef<HTMLFormElement>(null);

  const memoizedApiKey = useMemo(
    () => String(process.env.PLACEKIT_API_KEY),
    []
  );
  const pkaOptions: PlaceKitOptions = {
    countries: ["za"],
    timeout: 5000,
    maxResults: 5,
    types: ["street"],
    language: "en",
  };

  const handleDrop = useCallback((acceptedFiles: File[]) => {
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

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleDrop,
  });

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCoordinates({ latitude, longitude });
        },
        (error) => {
          toast.error("Error fetching location: " + error.message);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    } else {
      toast.error("Geolocation is not supported by this browser.");
    }

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
    setLoading(true); // Set loading to true when submission starts

    const user_data = await getUserProfile();
    const formcovert = formRef.current;
    const form_sending = new FormData();

    if (!formcovert || !(formcovert instanceof HTMLFormElement)) {
      console.error("Form is not recognized as HTMLFormElement");
      setLoading(false); // Reset loading on error
      return;
    }

    if (!file) {
      toast.error("Please upload an image");
      setLoading(false); // Reset loading on error
      return;
    }

    const form = new FormData(formcovert);
    const latitude = selectedAddress?.lat;
    const longitude = selectedAddress?.lng;
    const fullAddress = `${selectedAddress?.street?.name}, ${selectedAddress?.county}, ${selectedAddress?.city}, ${selectedAddress?.administrative}`;
    const selectedFault = form.get("fault-type");
    const faultDescription = form.get("fault-description");
    const user_email = String(user_data.current?.email);

    if (!selectedFault || !user_data.current) {
      toast.error("Fault type and login are required!");
      setLoading(false); // Reset loading on error
      return;
    }

    form_sending.append("latitude", String(latitude));
    form_sending.append("longitude", String(longitude));
    form_sending.append("address", String(fullAddress));
    form_sending.append("asset", String(selectedFault));
    form_sending.append("description", String(faultDescription));
    form_sending.append("state", "Opened");
    form_sending.append("username", user_email.toLowerCase());
    form_sending.append("file", file);

    try {
      const sessionToken = user_data.current?.session_token || "";
      const isCreated = await CreatTicket(sessionToken, form_sending);
      if (isCreated) {
        toast.success("Ticket created successfully!");
        window.location.href = "/dashboard/citizen";
      } else {
        throw new Error("Ticket creation failed");
      }
    } catch (error: any) {
      toast.error(`Error: ${error.message}`);
    } finally {
      setLoading(false); // Always reset loading state after processing
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFile(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result);
      };
      reader.onerror = () => {
        toast.error(`Error reading file: ${file.name}`);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDivClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleSuggestionPick = useCallback(
    (value: string, item: PKResult) => {
      setIsMarkerDropped(true);
      dropMarker(item);
      flyTo(item.lng, item.lat);
    },
    [dropMarker, flyTo]
  );

  // Map Pin Logic
  const onPinClick = () => {
    if (isMarkerDropped) {
      setIsMarkerDropped(false);
      liftMarker();
    } else {
      setIsMarkerDropped(true);
      dropMarker();
    }
  };

  return (
    <div className="block sm:hidden flex flex-col justify-center items-center h-full w-full px-2 rounded-3xl overflow-hidden">
      <ToastContainer />

      {/* Mobile Form Section */}
      <div className="w-full max-w-screen-md p-6 mb-16 bg-white flex flex-col rounded-3xl justify-center overflow-y-auto">
        <h2 className="text-2xl text-center font-bold mt-2 mb-6">
          Report a Fault
        </h2>
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
                    <Image
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

          {/* Image Upload */}
          <div className="flex flex-col">
            <span className="font-semibold text-sm mb-2">Attach Image</span>
            <div className="flex border rounded-lg overflow-hidden">
              <div className="flex justify-center p-2 w-1/5 bg-gray-100">
                <Image
                  src="https://mycity-storage-bucket.s3.eu-west-1.amazonaws.com/resources/camera_icon.webp"
                  alt="Camera Icon"
                  className="h-10 w-10"
                />
              </div>
              <div className="flex border-l w-4/5 p-3 bg-white">
                <div
                  className="w-full flex justify-center items-center"
                  onClick={handleDivClick}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    style={{ display: "none" }}
                    accept="image/*"
                    name="picture"
                    onChange={handleImageChange}
                  />
                  <div className="text-sm text-gray-600">
                    Drag & drop files here, or click to browse
                    {selectedImage && (
                      <div>
                        <h2>Image Preview:</h2>
                        <Image
                          src={String(selectedImage)}
                          alt="Uploaded"
                          style={{ maxWidth: "50%", height: "auto" }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Button
            type="submit"
            disabled={!isFormValid || loading} // Disable when form is invalid or loading
            className={cn(
              "m-auto w-24 px-4 py-2 font-bold rounded-3xl transition duration-300 z-0",
              isFormValid && !loading
                ? "bg-blue-500 text-white hover:bg-blue-600"
                : "bg-blue-200 text-white cursor-not-allowed"
            )}
          >
            {loading ? "Loading..." : "Submit"}{" "}
            {/* Show loading text when loading */}
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

                    flyTo(longitude, latitude);
                    dropMarker(location as PKResult); // Cast to PKResult to satisfy TypeScript
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
            <MapboxMap />
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateTicketMobile;
