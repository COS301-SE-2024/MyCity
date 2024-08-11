import React, { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { Input, Button } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { UserRole } from "@/types/custom.types";
import { handleSignIn } from "@/services/auth.service";
import { FaEye, FaEyeSlash, FaSpinner } from "react-icons/fa";

export default function MunicipalityLogin() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [isFormValid, setIsFormValid] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  useEffect(() => {
    const { email, password } = formData;
    const formValid = email && password && isEmailValid;
    setIsFormValid(!!formValid);
  }, [formData, isEmailValid]);

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
    setError(null); // Clear any previous error

    try {
      const { isSignedIn } = await handleSignIn(new FormData(event.currentTarget as HTMLFormElement), UserRole.MUNICIPALITY);

      if (isSignedIn) {
        router.push("/dashboard/municipality");
      } else {
        throw new Error("Login failed. Please try again.");
      }
    } catch (error) {
      setError("An error occurred during login. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="px-12">
      <form
        data-testid="municipality-login-form"
        onSubmit={handleSubmit}
        className="flex flex-col gap-y-8 pt-8"
      >
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
            inputWrapper: `h-[3em] ${!isEmailValid ? "border-red-500" : ""}`,
          }}
          type="email"
          name="email"
          autoComplete="new-email"
          placeholder="example@mail.com"
          required
          value={formData.email}
          onChange={handleInputChange}
        />

        <div className="relative w-full">
          <Input
            variant={"bordered"}
            fullWidth
            label={
              <span className="font-semibold text-medium block mb-[0.20em]">
                Municipality Password <span className="text-blue-500">*</span>
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
            className="absolute top-1/2 right-3 transform translate-y-1 text-black"
            onClick={togglePasswordVisibility}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>

        <Button
          name="submit"
          data-testid="submit-btn"
          className={`w-28 h-11 rounded-3xl m-auto font-semibold ${
            isFormValid && !isLoading
              ? "bg-blue-500 text-white"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
          type="submit"
          disabled={!isFormValid || isLoading}
        >
          {isLoading ? <FaSpinner className="animate-spin" /> : "Login"}
        </Button>
      </form>

      {error && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center text-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <p className="text-black">{error}</p>
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
  );
}
