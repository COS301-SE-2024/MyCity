import MunicipalityLogin from "@/components/Login/MunicipalityLogin";
import { fireEvent, render, screen } from "@testing-library/react";

describe("MunicipalityLogin", () => {

    it("renders an email input", () => {
        render(<MunicipalityLogin />);
        // Use getByPlaceholderText if the placeholder is unique
        const emailInputs = screen.getAllByPlaceholderText("example@mail.com");
        const emailInput = emailInputs[0];
        expect(emailInput).toBeInTheDocument();
        expect(emailInput).toHaveAttribute("type", "email");
    });

    it("renders a password input", () => {
        render(<MunicipalityLogin />);
        const passwordInputs = screen.getAllByLabelText(/Municipality Password/);
        const passwordInput = passwordInputs[0];
        expect(passwordInput).toHaveAttribute("type", "password");
    });

    it("renders a submit button", () => {
        render(<MunicipalityLogin />);

        const submitButtons = screen.getAllByTestId("submit-btn")
        const submitButton = submitButtons[0];
        expect(submitButton).toBeInTheDocument();

        expect(submitButton).toHaveTextContent("Login");
    });


    test("handler function is called after clicking submit button", () => {
        render(<MunicipalityLogin />);
        const mockFunction = jest.fn();
        const loginForms = screen.getAllByTestId("municipality-login-form");
        const loginForm = loginForms[0];
        loginForm.addEventListener("submit", mockFunction);

        fireEvent.submit(loginForm)
        expect(mockFunction).toHaveBeenCalledTimes(1);
    });

});