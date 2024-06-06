import CitizenLogin from "@/components/Login/CitizenLogin";
import { fireEvent, render, screen } from "@testing-library/react";

describe("CitizenLogin", () => {


    it("renders an email input", () => {
        render(<CitizenLogin />);
        const emailInput = screen.getByLabelText("Email");

        expect(emailInput).toBeInTheDocument();
        expect(emailInput).toHaveAttribute("type", "email");
    });

    it("renders a password input", () => {
        render(<CitizenLogin />);
        const passwordInput = screen.getByLabelText("Password");

        expect(passwordInput).toBeInTheDocument();
        expect(passwordInput).toHaveAttribute("type", "password");
    });


    it("renders a forgot password link", () => {
        render(<CitizenLogin />);
        const forgotPasswordLink = screen.getByText("Forgot password?");

        expect(forgotPasswordLink).toBeInTheDocument();
    });

    it("renders a Login button", () => {
        render(<CitizenLogin />);
        const submitButton = screen.getByTestId("submit-btn")

        expect(submitButton).toBeInTheDocument();
    });


    test("handler function is called after clicking submit button", () => {
        render(<CitizenLogin />);
        const mockFunction = jest.fn();
        const loginForm = screen.getByTestId("citizen-login-form");
        loginForm.addEventListener("submit", mockFunction);

        fireEvent.submit(loginForm)
        expect(mockFunction).toHaveBeenCalledTimes(1);
    });

})