import MunicipalityLogin from "@/components/Login/MunicipalityLogin";
import { fireEvent, render, screen } from "@testing-library/react";

describe("MunicipalityLogin", () => {

    it("renders an email input", () => {
        render(<MunicipalityLogin />);
        // Use getByPlaceholderText if the placeholder is unique
        const emailInput = screen.getByPlaceholderText("example@mail.com");
    
        expect(emailInput).toBeInTheDocument();
        expect(emailInput).toHaveAttribute("type", "email");
    });

    it("renders a password input", () => {
        render(<MunicipalityLogin />);
        const passwordInput = screen.getByLabelText(/Municipality Password/);
        expect(passwordInput).toHaveAttribute("type", "password");
    });

    it("renders a submit button", () => {
        render(<MunicipalityLogin />);

        const submitButton = screen.getByTestId("submit-btn")

        expect(submitButton).toBeInTheDocument();

        expect(submitButton).toHaveTextContent("Login");
    });


    test("handler function is called after clicking submit button", () => {
        render(<MunicipalityLogin />);
        const mockFunction = jest.fn();
        const loginForm = screen.getByTestId("municipality-login-form");
        loginForm.addEventListener("submit", mockFunction);

        fireEvent.submit(loginForm)
        expect(mockFunction).toHaveBeenCalledTimes(1);
    });

});