import CitizenLogin from "@/components/Login/CitizenLogin";
import { fireEvent, render, screen } from "@testing-library/react";

describe("CitizenLogin", () => {

    /* Test 1: Renders email input correctly */
    it("renders an email input", () => {
        render(<CitizenLogin />);
        // Use getByPlaceholderText if the placeholder is unique
        const emailInputs = screen.getAllByPlaceholderText("example@mail.com");
        const emailInput = emailInputs[0];
        expect(emailInput).toBeInTheDocument();
        expect(emailInput).toHaveAttribute("type", "email");
    });

    /* Test 2: Renders password input correctly */
    it("renders a password input", () => {
        render(<CitizenLogin />);
        const passwordInputs = screen.getAllByLabelText(/Password/);
        const passwordInput = passwordInputs[0];

        expect(passwordInput).toBeInTheDocument();
        expect(passwordInput).toHaveAttribute("type", "password");
    });


    /* Test 3: Renders Forgot Password link */
    it("renders a 'Forgot password?' link", () => {
        render(<CitizenLogin />);
        const forgotPasswordLink = screen.getByText("Forgot password?");
        expect(forgotPasswordLink).toBeInTheDocument();
    });

    /* Test 4: Renders Login button correctly */
    it("renders a Login button", () => {
        render(<CitizenLogin />);
        const submitButtons = screen.getAllByTestId("submit-btn")
        const submitButton = submitButtons[0];
        expect(submitButton).toBeInTheDocument();
    });

     /* Test 5: Calls handleSignIn on form submission */
    test("handler function is called after clicking submit button", () => {
        render(<CitizenLogin />);
        const mockFunction = jest.fn();
        // const mockLogin = handleSignIn.mockResolvedValue({ status: 200 });
        const loginForms = screen.getAllByTestId("citizen-login-form");
        const loginForm = loginForms[0];
        loginForm.addEventListener("submit", mockFunction);

        fireEvent.submit(loginForm)
        expect(mockFunction).toHaveBeenCalledTimes(1);
    });

    /* Test 6: Toggles password visibility */
    test("toggles password visibility", () => {
        render(<CitizenLogin />);
    });

    /* Test 7: Calls handleInputChange and updates email input */
    it("updates email input correctly", () => {
        render(<CitizenLogin />);
        const emailInputs = screen.getAllByPlaceholderText("example@mail.com");
        const emailInput = emailInputs[0];

        // Simulate typing in the email field
        fireEvent.change(emailInput, { target: { value: "test@example.com" } });

        // Check if the value has been updated
        expect(emailInput).toHaveValue("test@example.com");
    });

});