import CitizenSignup from "@/components/Signup/CitizenSignup";
import { fireEvent, render, screen } from "@testing-library/react";

describe("Citizen Signup", () => {

    it("renders an email input", () => {
        render(<CitizenSignup />);
        const emailInput = screen.getByLabelText("Email");

        expect(emailInput).toBeInTheDocument();
        expect(emailInput).toHaveAttribute("type", "email");
    });

    it("renders a password input", () => {
        render(<CitizenSignup />);
        const passwordInput = screen.getByLabelText("Create Password");

        expect(passwordInput).toBeInTheDocument();
        expect(passwordInput).toHaveAttribute("type", "password");
    });



    it("renders a submit button", () => {
        render(<CitizenSignup />);
        const submitButton = screen.getByText("Submit");

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