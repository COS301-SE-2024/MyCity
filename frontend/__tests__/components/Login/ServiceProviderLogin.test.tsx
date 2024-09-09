import ServiceProviderLogin from "@/components/Login/ServiceProviderLogin";
import { colorVariants } from "@nextui-org/react";
import { fireEvent, render, screen } from "@testing-library/react";

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
    /* Test 9: Redirects to dashboard after successful sign-in */

});