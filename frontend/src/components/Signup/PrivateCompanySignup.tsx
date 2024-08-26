import React, { FormEvent, useEffect, useState } from "react";
import { Input, Button } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { handleSignUp } from "@/services/auth.service";
import { UserRole } from "@/types/custom.types";
import {
  FaEye,
  FaEyeSlash,
  FaSpinner,
  FaQuestionCircle,
  FaInfoCircle,
  FaCheck,
  FaTimes,
  FaAngleUp,
  FaAngleDown,
} from "react-icons/fa";

export default function ServiceProviderSignup() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    companyname: "",
    contactnumber: "",
    email: "",
    companylogo: "",
    authcode: "",
  });
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isFormValid, setIsFormValid] = useState(false);
  const [isHelpVisible, setIsHelpVisible] = useState(false);

  const toggleHelpVisibility = () => {
    setIsHelpVisible(!isHelpVisible);
  };

  useEffect(() => {
    const { companyname, contactnumber, email } = formData;
    const formValid = companyname && contactnumber && email;
    setIsFormValid(!!formValid);
  }, [formData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));

    if (name === "email") {
      validateEmail(value);
    }
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setIsEmailValid(emailRegex.test(email));
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setIsLoading(true);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setIsEmailValid(false);
      setIsLoading(false);
      return;
    } else {
      setIsEmailValid(true);
    }

    const form = new FormData(event.currentTarget as HTMLFormElement);

    try {
      const signedUp = await handleSignUp(form, UserRole.PRIVATE_COMPANY);
      if (signedUp.isSignedIn == true) {
        router.push("/dashboard/service-provider");
      }
    } catch (error: any) {
      setError(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div>
      {/* Desktop View */}
      <div className="hidden sm:block">
        <div className="px-12">
          <form
            data-testid="service-provider-signup-form"
            onSubmit={handleSubmit}
            className="flex flex-col gap-y-4 pt-8"
          >
            <div className="relative w-full">
              <Input
                variant={"bordered"}
                fullWidth
                label={
                  <span className="font-semibold text-medium block mb-[0.20em]">
                    Email <span className="text-blue-500">*</span>
                  </span>
                }
                labelPlacement={"outside"}
                classNames={{
                  inputWrapper: `h-[3em] ${
                    !isEmailValid ? "border-red-500" : ""
                  }`,
                }}
                type="email"
                name="email"
                autoComplete="new-email"
                placeholder="example@mail.com"
                required
                value={formData.email}
                onChange={handleInputChange}
              />
            </div>

            <Input
              variant={"bordered"}
              fullWidth
              label={
                <span className="font-semibold text-medium block mb-[0.20em]">
                  Company Name <span className="text-blue-500">*</span>
                </span>
              }
              labelPlacement={"outside"}
              classNames={{
                inputWrapper: "h-[3em]",
              }}
              type="text"
              name="companyname"
              autoComplete="new-companyname"
              placeholder="Tesla"
              required
              value={formData.companyname}
              onChange={handleInputChange}
            />

            <div>
              <label className="font-semibold text-medium block mb-[0.20em]">
                Company Logo
              </label>
              {logoPreview && (
                <div className="flex justify-center mb-4">
                  <div className="w-24 h-24 rounded-full overflow-hidden">
                    <img
                      src={logoPreview}
                      alt="Logo Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              )}
              <input
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                type="file"
                name="companylogo"
                accept="image/*"
                onChange={handleLogoChange}
              />
            </div>

            <Input
              variant={"bordered"}
              fullWidth
              label={
                <span className="font-semibold text-medium block mb-[0.20em]">
                  Contact Number <span className="text-blue-500">*</span>
                </span>
              }
              labelPlacement={"outside"}
              classNames={{
                inputWrapper: "h-[3em]",
              }}
              type="text"
              name="contactnumber"
              autoComplete="new-contactnumber"
              placeholder="0116543211"
              required
              value={formData.contactnumber}
              onChange={handleInputChange}
            />

            <div className="relative w-full mt-4">
              <Input
                variant={"bordered"}
                label={
                  <span className="font-semibold text-medium block mb-[0.20em]">
                    AuthCode <span className="text-blue-500">*</span>
                  </span>
                }
                labelPlacement={"outside"}
                classNames={{
                  inputWrapper: "h-[3em]",
                }}
                type="text"
                name="authcode"
                autoComplete="new-authcode"
                placeholder="AuthCode"
                required
                value={formData.authcode}
                onChange={handleInputChange}
              />
              <button
                type="button"
                className="absolute top-1/2 right-3 transform translate-y-1 text-blue-500"
                onClick={toggleHelpVisibility}
              >
                <FaQuestionCircle />
              </button>
              {isHelpVisible && (
                <div className="absolute top-[-3rem] right-0 bg-white border rounded-lg p-1 text-xs shadow-lg w-40">
                  AuthCode is a unique identifier to verify your association
                  with your company.
                </div>
              )}
            </div>

            <Button
              name="submit"
              className={`w-28 h-11 rounded-full m-auto font-semibold ${
                isFormValid && isEmailValid
                  ? "bg-blue-500 text-white"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
              type="submit"
              disabled={!isFormValid || isLoading}
            >
              {isLoading ? <FaSpinner className="animate-spin" /> : "Submit"}
            </Button>
          </form>

          {error && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center text-center items-center z-50">
              <div className="bg-white rounded-lg shadow-lg p-6">
                <p className="text-black">
                  {error.includes("UserLambdaValidationException")
                    ? "Sign up failed: Invalid authorization code provided. Please check your code and try again."
                    : "An error occurred during sign up. Please try again."}
                </p>
                <button
                  onClick={() => setError(null)}
                  className="mt-4 bg-blue-500 text-center text-white px-4 py-2 rounded"
                >
                  Retry
                </button>
              </div>
            </div>
          )}
        </div>
      </div>




      {/* Mobile View */}
      <div className="block sm:hidden">
        <div className="px-2">
          <form
            data-testid="mobile-service-provider-signup-form"
            onSubmit={handleSubmit}
            className="flex flex-col gap-y-4 pt-2"
          >
            <div className="relative w-full">
              <Input
                variant={"bordered"}
                fullWidth
                label={
                  <span className="font-semibold text-medium block mb-[0.20em]">
                    Email <span className="text-blue-500">*</span>
                  </span>
                }
                labelPlacement={"outside"}
                classNames={{
                  inputWrapper: `h-[3em] ${
                    !isEmailValid ? "border-red-500" : ""
                  }`,
                }}
                type="email"
                name="email"
                autoComplete="new-email"
                placeholder="example@mail.com"
                required
                value={formData.email}
                onChange={handleInputChange}
              />
            </div>

            <Input
              variant={"bordered"}
              fullWidth
              label={
                <span className="font-semibold text-medium block mb-[0.20em]">
                  Company Name <span className="text-blue-500">*</span>
                </span>
              }
              labelPlacement={"outside"}
              classNames={{
                inputWrapper: "h-[3em]",
              }}
              type="text"
              name="companyname"
              autoComplete="new-companyname"
              placeholder="Tesla"
              required
              value={formData.companyname}
              onChange={handleInputChange}
            />

            <div>
              <label className="font-semibold text-medium block mb-[0.20em]">
                Company Logo
              </label>
              {logoPreview && (
                <div className="flex justify-center mb-4">
                  <div className="w-24 h-24 rounded-full overflow-hidden">
                    <img
                      src={logoPreview}
                      alt="Logo Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              )}
              <input
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                type="file"
                name="companylogo"
                accept="image/*"
                onChange={handleLogoChange}
              />
            </div>

            <Input
              variant={"bordered"}
              fullWidth
              label={
                <span className="font-semibold text-medium block mb-[0.20em]">
                  Contact Number <span className="text-blue-500">*</span>
                </span>
              }
              labelPlacement={"outside"}
              classNames={{
                inputWrapper: "h-[3em]",
              }}
              type="text"
              name="contactnumber"
              autoComplete="new-contactnumber"
              placeholder="0116543211"
              required
              value={formData.contactnumber}
              onChange={handleInputChange}
            />

            <div className="relative w-full mt-4">
              <Input
                variant={"bordered"}
                label={
                  <span className="font-semibold text-medium block mb-[0.20em]">
                    AuthCode <span className="text-blue-500">*</span>
                  </span>
                }
                labelPlacement={"outside"}
                classNames={{
                  inputWrapper: "h-[3em]",
                }}
                type="text"
                name="authcode"
                autoComplete="new-authcode"
                placeholder="AuthCode"
                required
                value={formData.authcode}
                onChange={handleInputChange}
              />
              <button
                type="button"
                className="absolute top-1/2 right-3 transform translate-y-1 text-blue-500"
                onClick={toggleHelpVisibility}
              >
                <FaQuestionCircle />
              </button>
              {isHelpVisible && (
                <div className="absolute top-[-3rem] right-0 bg-white border rounded-lg p-1 text-xs shadow-lg w-40">
                  AuthCode is a unique identifier to verify your association
                  with your company.
                </div>
              )}
            </div>

            <Button
              name="submit"
              className={`w-28 h-11 rounded-full m-auto font-semibold ${
                isFormValid && isEmailValid
                  ? "bg-blue-500 text-white"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
              type="submit"
              disabled={!isFormValid || isLoading}
            >
              {isLoading ? <FaSpinner className="animate-spin" /> : "Submit"}
            </Button>
          </form>

          {error && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center text-center items-center z-50">
              <div className="bg-white rounded-lg shadow-lg p-6">
                <p className="text-black">
                  {error.includes("UserLambdaValidationException")
                    ? "Sign up failed: Invalid authorization code provided. Please check your code and try again."
                    : "An error occurred during sign up. Please try again."}
                </p>
                <button
                  onClick={() => setError(null)}
                  className="mt-4 bg-blue-500 text-center text-white px-4 py-2 rounded"
                >
                  Retry
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
