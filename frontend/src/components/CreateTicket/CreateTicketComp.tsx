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
import { Locate, Pin, PinOff, Info } from "lucide-react";
import Image from "next/image";

const MapboxMap = dynamic(() => import("../MapboxMap/MapboxMap"), {
  ssr: false,
});

const CreateTicketComp: React.FC = () => {
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
    const file = acceptedFiles[0];
    setFile(file);
    const reader = new FileReader();
    reader.onload = () => setDataURL(reader.result as string);
    reader.onerror = () => toast.error(`Error reading file: ${file.name}`);
    reader.readAsDataURL(file);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleDrop,
  });

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoordinates({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        toast.error("Error fetching location: " + error.message);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );

    async function fetchFaultTypes() {
      try {
        const data = await getFaultTypes();
        setFaultTypes(data || []);
      } catch (error: any) {
        toast.error("Error fetching fault types: " + error.message);
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
    setLoading(true); // Set loading to true on submit

    const user_data = await getUserProfile();
    const form = formRef.current;
    const formData = new FormData(form!);

    if (!file) {
      toast.error("Please upload an image");
      setLoading(false); // Set loading back to false if there's an error
      return;
    }

    const latitude = selectedAddress?.lat;
    const longitude = selectedAddress?.lng;
    const fullAddress = `${selectedAddress?.street?.name}, ${selectedAddress?.county}, ${selectedAddress?.city}, ${selectedAddress?.administrative}`;
    const selectedFault = formData.get("fault-type");
    const faultDescription = formData.get("fault-description");
    const user_email = String(user_data.current?.email);

    if (!selectedFault || !user_data.current) {
      toast.error("Fault type and login are required!");
      setLoading(false); // Set loading back to false if there's an error
      return;
    }

    const form_sending = new FormData();
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
      setLoading(false); // Always set loading to false after processing
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
      reader.onerror = () => toast.error(`Error reading file: ${file.name}`);
      reader.readAsDataURL(file);
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

  const onPinClick = () => {
    if (isMarkerDropped) {
      setIsMarkerDropped(false);
      liftMarker();
    } else {
      setIsMarkerDropped(true);
      dropMarker();
    }
  };

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
    <div className="flex justify-center items-center h-full w-full px-4 overflow-hidden">
      <ToastContainer />
      <div className="hidden sm:flex w-full max-w-screen-xl h-[40rem] rounded-lg overflow-hidden z-10">
        <div className="w-1/2 p-6 bg-white flex flex-col overflow-hidden">
          <h2 className="text-2xl text-center font-bold mt-2 mb-6">
            Report a Fault
          </h2>
          {/* Make form content scrollable */}
          <div className="flex-1 overflow-y-auto">
            <form
              ref={formRef}
              onSubmit={handleSubmit}
              className="flex flex-col gap-y-8"
            >
              {faultTypes.length > 0 ? (
                <Autocomplete
                  label="Fault type"
                  name="fault-type"
                  placeholder="Fault Type"
                  fullWidth
                  onSelectionChange={(key) => setSelectedFault(key as string)}
                >
                  {faultTypes.map((faultType) => (
                    <AutocompleteItem
                      key={faultType.asset_id}
                      textValue={faultType.asset_id}
                    >
                      <div className="flex gap-2 items-center">
                        <Image
                          src={faultType.assetIcon}
                          alt={faultType.asset_id}
                          className="w-6 h-6"
                        />
                        <span>{faultType.asset_id}</span>
                      </div>
                    </AutocompleteItem>
                  ))}
                </Autocomplete>
              ) : (
                <p>Loading fault types...</p>
              )}
              <Textarea
                label="Description"
                name="fault-description"
                placeholder="Add Description..."
                onChange={(e) => setFaultDescription(e.target.value)}
              />
              <PlaceKit
                apiKey={memoizedApiKey}
                options={pkaOptions}
                onPick={handleSuggestionPick}
                placeholder="Search for an address..."
              />
              {/* Display selected address details */}
              <div>
                <div className="flex flex-col gap-y-0.5 text-xs ps-2">
                  <span>{selectedAddress?.street?.name}</span>
                  <span>{selectedAddress?.county}</span>
                  <span>{selectedAddress?.city}</span>
                  <span>{selectedAddress?.administrative}</span>
                </div>
              </div>

              {/* Image Upload Section */}
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
                      onClick={() => fileInputRef.current?.click()}
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

              {/* Restyled Submit Button */}
              <Button
                type="submit"
                disabled={!isFormValid || loading} // Disable button when loading or form is invalid
                className={`m-auto w-24 px-4 py-2 font-bold rounded-3xl transition duration-300 z-0 ${
                  isFormValid && !loading
                    ? "bg-blue-500 text-white hover:bg-blue-600"
                    : "bg-blue-200 text-white cursor-not-allowed"
                }`}
              >
                {loading ? "Loading..." : "Submit"}{" "}
                {/* Show "Loading..." when loading */}
              </Button>
            </form>
          </div>
        </div>

        {/* Graphical Section */}
        <div className="w-1/2 relative bg-gray-200">
          {/* Map Section */}
          <div className="relative w-full h-full">
            {/* Location and Pin Control Buttons */}
            <div className="absolute flex flex-col gap-y-5 bottom-10 right-5 z-30">
              <Button
                className="min-w-fit h-fit p-2 bg-white"
                onClick={flyToCurrentLocation}
              >
                <Locate size={21} />
              </Button>
              <Button
                className="min-w-fit h-fit p-2 bg-white"
                onClick={onPinClick}
              >
                {!isMarkerDropped ? <Pin size={21} /> : <PinOff size={21} />}
              </Button>
            </div>

            {/* Marker */}
            {!isMarkerDropped && (
              <div className="absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-90%] z-40">
                <CustomMarker fill="#BE0505" />
              </div>
            )}

            {/* Tooltip for Marker */}
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

            {/* Map Container */}
            <MapboxMap />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateTicketComp;
