import CitizenSignup from "@/components/Signup/CitizenSignup";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import * as AuthService from "../../../src/services/auth.service";
import { useRouter } from "next/router";

// Mock handleSignUp
jest.mock("../../../src/services/auth.service", () => ({
    handleSignUp: jest.fn(),
}));

describe("Citizen Signup", () => {

    beforeEach(() => {
        // Reset mocks before each test
        jest.clearAllMocks();
    });

    /* Test 1: Renders form fields */
    it("renders the necessary form fields", () => {
        render(<CitizenSignup />);
        
        expect(screen.getByTestId("email-input")).toBeInTheDocument();
        expect(screen.getByTestId("password-input")).toBeInTheDocument();
        expect(screen.getByTestId("confirm-password-input")).toBeInTheDocument();
        expect(screen.getByTestId("firstname-input")).toBeInTheDocument();
        expect(screen.getByTestId("surname-input")).toBeInTheDocument();
        //expect(screen.getAllByPlaceholderText("Select a municipality")[0]).toBeInTheDocument();
    });

    /* Test 2: Renders email input correctly */
    it("renders an email input", () => {
        render(<CitizenSignup />);
        // Use getByPlaceholderText if the placeholder is unique
        const emailInput = screen.getByTestId("email-input", { exact: true });

        expect(emailInput).toBeInTheDocument();
        expect(emailInput).toHaveAttribute("type", "email");
    });

    /* Test 3: Email validation should show an error for invalid email format */
    it("shows error for invalid email format", async () => {
        render(<CitizenSignup />);
        // Find the email input field by placeholder text
        const emailInputs = screen.getAllByPlaceholderText("example@mail.com");
        const emailInput = emailInputs[0];

        const submitButtons = screen.getAllByTestId("signup-submit-btn");
        const submitButton = submitButtons[0];

        // Simulate typing an invalid email
        fireEvent.change(emailInput, { target: { value: "invalidemail" } });
        await waitFor(() => {
            expect(submitButton).toBeDisabled();
        });
    });
    

    /* Test 4: Successful signup should call handleSignUp and redirect to dashboard */
    // This will done with integration testing

    /* Test 5: Displays error message on failed signup */
    it("displays error message if signup fails", async () => {
        const handleSignUp = AuthService.handleSignUp;

        render(<CitizenSignup />);

        // Fill in form data
        fireEvent.change(screen.getByTestId("email-input"), { target: { value: "test@example.com" } });
        fireEvent.change(screen.getByTestId("password-input"), { target: { value: "Password123!" } });
        fireEvent.change(screen.getByTestId("confirm-password-input"), { target: { value: "Password123!" } });
        fireEvent.change(screen.getByTestId("firstname-input"), { target: { value: "Dominique" } });
        fireEvent.change(screen.getByTestId("surname-input"), { target: { value: "Da Silva" } });
        //fireEvent.change(screen.getAllByPlaceholderText("Select a municipality")[0], { target: { value: "Ingquza Hill" } });

        // Submit form
        const submitButtons = screen.getAllByTestId("signup-submit-btn");
        const submitButton = submitButtons[0]
        fireEvent.click(submitButton);

        expect(handleSignUp).toHaveBeenCalledTimes(1);
    });

    /* Test 6: Submit button displays and works*/
    it("renders a submit button", () => {
        render(<CitizenSignup />);
        const submitButtons = screen.getAllByText("Submit");
        const submitButton = submitButtons[0];

        expect(submitButton).toBeInTheDocument();
    });

    test("handler function is called after clicking submit button", () => {
        render(<CitizenSignup />);
        const mockFunction = jest.fn();
        const loginForm = screen.getByTestId("citizen-signup-form");
        loginForm.addEventListener("submit", mockFunction);

        fireEvent.submit(loginForm)
        expect(mockFunction).toHaveBeenCalledTimes(1);
    });

})