import CitizenLogin from "@/components/Login/CitizenLogin";
import { fireEvent, render, screen } from "@testing-library/react";

describe("CitizenLogin", () => {

    it("renders an email input", () => {
        render(<CitizenLogin />);
        // Use getByPlaceholderText if the placeholder is unique
        const emailInputs = screen.getAllByPlaceholderText("example@mail.com");
        const emailInput = emailInputs[0];
        expect(emailInput).toBeInTheDocument();
        expect(emailInput).toHaveAttribute("type", "email");
    });

    it("renders a password input", () => {
        render(<CitizenLogin />);
        const passwordInputs = screen.getAllByLabelText(/Password/);
        const passwordInput = passwordInputs[0];

        expect(passwordInput).toBeInTheDocument();
        expect(passwordInput).toHaveAttribute("type", "password");
    });


    /*it("renders a forgot password link", () => {
        render(<CitizenLogin />);
        const forgotPasswordLink = screen.getByText("Forgot password?");

        expect(forgotPasswordLink).toBeInTheDocument();
    });*/

    it("renders a Login button", () => {
        render(<CitizenLogin />);
        const submitButtons = screen.getAllByTestId("submit-btn")
        const submitButton = submitButtons[0];
        expect(submitButton).toBeInTheDocument();
    });


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

});