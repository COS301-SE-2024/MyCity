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
    firstname: "",
    surname: "",
    email: "",
    password: "",
    confirmPassword: "",
    authcode: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [passwordValid, setPasswordValid] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);
  const [isChecklistVisible, setIsChecklistVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isHelpVisible, setIsHelpVisible] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [isEmailValid, setIsEmailValid] = useState(true);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const toggleHelpVisibility = () => {
    setIsHelpVisible(!isHelpVisible);
  };

  useEffect(() => {
    const { firstname, surname, email, password, confirmPassword, authcode } =
      formData;
    const formValid =
      firstname &&
      surname &&
      email &&
      password &&
      confirmPassword &&
      passwordsMatch &&
      passwordValid &&
      authcode;
    setIsFormValid(!!formValid);
  }, [formData, passwordsMatch, passwordValid]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));

    if (name === "password") {
      validatePassword(value);
    }
    if (name === "confirmPassword") {
      setPasswordsMatch(value === formData.password);
    }
    if (name === "email") {
      validateEmail(value);
    }
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setIsEmailValid(emailRegex.test(email));
  };

  const validatePassword = (password: string) => {
    const errors = [];
    if (password.length < 8) {
      errors.push("Password must be at least 8 characters long.");
    }
    if (!/[A-Z]/.test(password)) {
      errors.push("Password must contain at least one uppercase letter.");
    }
    if (!/[a-z]/.test(password)) {
      errors.push("Password must contain at least one lowercase letter.");
    }
    if (!/[0-9]/.test(password)) {
      errors.push("Password must contain at least one number.");
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push("Password must contain at least one special character.");
    }
    setPasswordErrors(errors);
    setPasswordValid(errors.length === 0);
    setPasswordsMatch(formData.confirmPassword === password);
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
    } catch (error) {
      setError(`Error: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const passwordChecklist = [
    {
      text: "At least 8 characters long",
      test: (password: string) => password.length >= 8,
    },
    {
      text: "Contains an uppercase letter",
      test: (password: string) => /[A-Z]/.test(password),
    },
    {
      text: "Contains a lowercase letter",
      test: (password: string) => /[a-z]/.test(password),
    },
    {
      text: "Contains a number",
      test: (password: string) => /[0-9]/.test(password),
    },
    {
      text: "Contains a special character",
      test: (password: string) => /[!@#$%^&*(),.?":{}|<>]/.test(password),
    },
    {
      text: "Passwords match",
      test: () => passwordsMatch,
    },
  ];

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
            <div className="flex justify-between gap-4">
              <Input
                variant={"bordered"}
                className="w-1/2"
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
                value={formData.firstname}
                onChange={handleInputChange}
              />
              <Input
                variant={"bordered"}
                className="w-1/2"
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
                value={formData.surname}
                onChange={handleInputChange}
              />
            </div>

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
                  inputWrapper: `h-[3em] ${!isEmailValid ? "border-red-500" : ""
                    }`,
                }}
                type="email"
                name="email"
                autoComplete="new-email"
                data-testid="email-input"
                placeholder="example@mail.com"
                required
                value={formData.email}
                onChange={handleInputChange}
              />
            </div>

            <div className="flex justify-between gap-4">
              <div className="relative w-1/2">
                <Input
                  variant={"bordered"}
                  label={
                    <span className="font-semibold text-medium block mb-[0.20em]">
                      Create Password <span className="text-blue-500">*</span>
                    </span>
                  }
                  labelPlacement={"outside"}
                  classNames={{
                    inputWrapper: "h-[3em]",
                  }}
                  type={showPassword ? "text" : "password"}
                  name="password"
                  autoComplete="new-password"
                  placeholder="Password"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 top-0 bottom-0 right-3 flex items-center justify-center transform translate-y-3"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? (
                    <FaEyeSlash className="h-5 w-5" />
                  ) : (
                    <FaEye className="h-5 w-5" />
                  )}
                </button>
              </div>
              <div className="relative w-1/2">
                <Input
                  variant={"bordered"}
                  label={
                    <span className="font-semibold text-medium block mb-[0.20em]">
                      Confirm Password <span className=" text-blue-500">*</span>
                    </span>
                  }
                  labelPlacement={"outside"}
                  classNames={{
                    inputWrapper: "h-[3em]",
                  }}
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  autoComplete="new-password"
                  placeholder="Password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 top-0 bottom-0 right-3 flex items-center justify-center transform translate-y-3"
                  onClick={toggleConfirmPasswordVisibility}
                >
                  {showConfirmPassword ? (
                    <FaEyeSlash className="h-5 w-5" />
                  ) : (
                    <FaEye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            <div className="mt-2">
              <button
                className="flex items-center gap-2 text-sm text-blue-500 font-semibold"
                type="button"
                onClick={() => setIsChecklistVisible(!isChecklistVisible)}
              >
                Password Requirements
                <FaInfoCircle />
                {isChecklistVisible ? <FaAngleUp /> : <FaAngleDown />}
              </button>
              {isChecklistVisible && (
                <div className="flex flex-col gap-1 mt-2">
                  {passwordChecklist.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 text-black text-sm"
                    >
                      {item.test(formData.password) ? (
                        <FaCheck className="text-green-500" />
                      ) : (
                        <FaTimes className="text-red-500" />
                      )}
                      <span>{item.text}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

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
              className={`w-28 h-11 rounded-full m-auto font-semibold ${isFormValid && isEmailValid
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
            className="flex flex-col gap-y-4 pt-1"
          >
            <div className="flex justify-between gap-4">
              <Input
                variant={"bordered"}
                className="w-1/2"
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
                value={formData.firstname}
                onChange={handleInputChange}
              />
              <Input
                variant={"bordered"}
                className="w-1/2"
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
                value={formData.surname}
                onChange={handleInputChange}
              />
            </div>

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
                  inputWrapper: `h-[3em] ${!isEmailValid ? "border-red-500" : ""
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

            <div className="flex justify-between gap-2">
              <div className="relative w-1/2">
                <Input
                  variant={"bordered"}
                  label={
                    <span className="font-semibold text-medium block mb-[0.20em]">
                      Create Password <span className="text-blue-500">*</span>
                    </span>
                  }
                  labelPlacement={"outside"}
                  classNames={{
                    inputWrapper: "h-[3em]",
                  }}
                  type={showPassword ? "text" : "password"}
                  name="password"
                  autoComplete="new-password"
                  placeholder="Password"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 top-0 bottom-0 right-3 flex items-center justify-center transform translate-y-3"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? (
                    <FaEyeSlash className="h-5 w-5" />
                  ) : (
                    <FaEye className="h-5 w-5" />
                  )}
                </button>
              </div>
              <div className="relative w-1/2">
                <Input
                  variant={"bordered"}
                  label={
                    <span className="font-semibold text-medium block mb-[0.20em]">
                      Confirm Password<span className="text-blue-500">*</span>
                    </span>
                  }
                  labelPlacement={"outside"}
                  classNames={{
                    inputWrapper: "h-[3em]",
                  }}
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  autoComplete="new-password"
                  placeholder="Password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 top-0 bottom-0 right-3 flex items-center justify-center transform translate-y-3"
                  onClick={toggleConfirmPasswordVisibility}
                >
                  {showConfirmPassword ? (
                    <FaEyeSlash className="h-5 w-5" />
                  ) : (
                    <FaEye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            <div className="">
              <button
                className="flex items-center gap-2 text-sm text-blue-500 font-semibold"
                type="button"
                onClick={() => setIsChecklistVisible(!isChecklistVisible)}
              >
                Password Requirements
                <FaInfoCircle />
                {isChecklistVisible ? <FaAngleUp /> : <FaAngleDown />}
              </button>
              {isChecklistVisible && (
                <div className="flex flex-col gap-1 mt-2">
                  {passwordChecklist.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 text-black text-sm"
                    >
                      {item.test(formData.password) ? (
                        <FaCheck className="text-green-500" />
                      ) : (
                        <FaTimes className="text-red-500" />
                      )}
                      <span>{item.text}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="relative w-full">
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
              className={`w-28 h-11 rounded-full m-auto font-semibold ${isFormValid && isEmailValid
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
