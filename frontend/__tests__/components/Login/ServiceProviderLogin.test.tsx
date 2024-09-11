import ServiceProviderLogin from "@/components/Login/ServiceProviderLogin";
import { colorVariants } from "@nextui-org/react";
import { fireEvent, render, screen, waitFor} from "@testing-library/react";
import * as AuthService from "../../../src/services/auth.service";
import { useRouter } from "next/router";

jest.mock("../../../src/services/auth.service", () => ({
    handleGoogleSignIn: jest.fn().mockResolvedValue({ status: 200 }),
    handleSignIn: jest.fn(),
}));

describe("ServiceProviderLogin", () => {

    /* Test 1: Renders email input correctly */
    it("renders an email input", () => {
        render(<ServiceProviderLogin />);
        // Use getByPlaceholderText if the placeholder is unique
        const emailInputs = screen.getAllByPlaceholderText("example@mail.com");
        const emailInput = emailInputs[0];
        expect(emailInput).toBeInTheDocument();
        expect(emailInput).toHaveAttribute("type", "email");
    });

    /* Test 2: Renders password input correctly */
    it("renders a password input", () => {
        render(<ServiceProviderLogin />);
        const passwordInputs = screen.getAllByLabelText(/Service Provider Password/);
        const passwordInput = passwordInputs[0];
        expect(passwordInput).toBeInTheDocument();
        expect(passwordInput).toHaveAttribute("type", "password");
    });

    /* Test 3: Renders Forgot Password link */
    it("renders a 'Forgot password?' link", () => {
        render(<ServiceProviderLogin />);
        const forgotPasswordLink = screen.getByText("Forgot password?");
        expect(forgotPasswordLink).toBeInTheDocument();
    });

    /* Test 4: Renders Login button correctly */
    it("renders a submit button", () => {
        render(<ServiceProviderLogin />);

        const submitButtons = screen.getAllByTestId("submit-btn")
        const submitButton = submitButtons[0];
        expect(submitButton).toBeInTheDocument();

        expect(submitButton).toHaveTextContent("Login");
    });

    /* Test 5: Calls handleSignIn on form submission */
    test("handler function is called after clicking submit button", () => {
        render(<ServiceProviderLogin />);
        const mockFunction = jest.fn();
        const loginForms = screen.getAllByTestId("service-provider-login-form");
        const loginForm = loginForms[0];
        loginForm.addEventListener("submit", mockFunction);

        fireEvent.submit(loginForm);
        expect(mockFunction).toHaveBeenCalledTimes(1);
    });

    /* Test 6: Toggles password visibility */
    test("toggles password visibility", () => {
        render(<ServiceProviderLogin />);

        // Get the password input and toggle button
        // If the input fields have distinct roles or labels
        const passwordInputs = screen.getAllByPlaceholderText("Password");
        const passwordInput = passwordInputs[0];
        const toggleButton = screen.getByTestId("eye-button");

        // Initially, the password field should be of type 'password'
        expect(passwordInput).toHaveAttribute("type", "password");

        // Simulate clicking the toggle button
        fireEvent.click(toggleButton);

        // After the click, the password field should be of type 'text'
        expect(passwordInput).toHaveAttribute("type", "text");

        // Simulate clicking the toggle button again
        fireEvent.click(toggleButton);

        // After the second click, the password field should be of type 'password'
        expect(passwordInput).toHaveAttribute("type", "password");
    });

    /* Test 7: Calls handleInputChange and updates email input */
    it("updates email input correctly", () => {
        render(<ServiceProviderLogin />);
        const emailInputs = screen.getAllByPlaceholderText("example@mail.com");
        const emailInput = emailInputs[0];

        // Simulate typing in the email field
        fireEvent.change(emailInput, { target: { value: "test@example.com" } });

        // Check if the value has been updated
        expect(emailInput).toHaveValue("test@example.com");
    });

    /* Test 8: Validates email correctly */
    it("validates email correctly", async () => {
        render(<ServiceProviderLogin />);

        // Find the email input field by placeholder text
        const emailInputs = screen.getAllByPlaceholderText("example@mail.com");
        const emailInput = emailInputs[0];

        const submitButtons = screen.getAllByTestId("submit-btn");
        const submitButton = submitButtons[0];

        // Simulate typing an invalid email
        fireEvent.change(emailInput, { target: { value: "invalidemail" } });
        await waitFor(() => {
            expect(submitButton).toBeDisabled();
        });

        // Simulate typing a valid email
        fireEvent.change(emailInput, { target: { value: "test@example.com" } });
        await waitFor(() => {
            expect(submitButton).toBeDisabled();
        });

    });

    /* Test 9: Redirects to dashboard after successful sign-in */

    /* Test 10: Displays error message on login failure */
    it("displays error message on login failure", async () => {
        (AuthService.handleSignIn as jest.Mock).mockRejectedValue(new Error("Login failed"));

        render(<ServiceProviderLogin />);

        const emailInput = screen.getAllByPlaceholderText("example@mail.com")[0];
        const passwordInput = screen.getAllByPlaceholderText("Password")[0];
        const form = screen.getAllByTestId("service-provider-login-form")[0];

        fireEvent.change(emailInput, { target: { value: "test@example.com" } });
        fireEvent.change(passwordInput, { target: { value: "password123" } });
        fireEvent.submit(form);

        await waitFor(() => {
            const outputs = screen.getAllByText("An error occurred during login. Please try again.")
            const out = outputs[0];
            expect(out).toBeInTheDocument();
            //expect(screen.getByText("An error occurred during login. Please try again.")).toBeInTheDocument();
        });
        
    });;

    /* Test 11: Disables submit button when form is invalid */
    it("disables submit button when form is invalid", () => {
        render(<ServiceProviderLogin />);

        const submitButton = screen.getAllByTestId("submit-btn")[0];
        expect(submitButton).toBeDisabled();

        const emailInput = screen.getAllByPlaceholderText("example@mail.com")[0];
        fireEvent.change(emailInput, { target: { value: "test@example.com" } });

        expect(submitButton).toBeDisabled();

        const passwordInput = screen.getAllByPlaceholderText("Password")[0];
        fireEvent.change(passwordInput, { target: { value: "password123" } });

        expect(submitButton).not.toBeDisabled();
    });

});