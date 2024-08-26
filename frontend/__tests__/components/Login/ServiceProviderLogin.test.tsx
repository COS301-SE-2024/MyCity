import ServiceProviderLogin from "@/components/Login/ServiceProviderLogin";
import { colorVariants } from "@nextui-org/react";
import { fireEvent, render, screen } from "@testing-library/react";

describe("ServiceProviderLogin", () => {

    it("renders an email input", () => {
        render(<ServiceProviderLogin />);
        // Use getByPlaceholderText if the placeholder is unique
        const emailInputs = screen.getAllByPlaceholderText("example@mail.com");
        const emailInput = emailInputs[0];
        expect(emailInput).toBeInTheDocument();
        expect(emailInput).toHaveAttribute("type", "email");
    });

    it("renders a password input", () => {
        render(<ServiceProviderLogin />);
        const passwordInputs = screen.getAllByLabelText(/Service Provider Password/);
        const passwordInput = passwordInputs[0];
        expect(passwordInput).toBeInTheDocument();
        expect(passwordInput).toHaveAttribute("type", "password");
    });


    it("renders a submit button", () => {
        render(<ServiceProviderLogin />);

        const submitButtons = screen.getAllByTestId("submit-btn")
        const submitButton = submitButtons[0];
        expect(submitButton).toBeInTheDocument();

        expect(submitButton).toHaveTextContent("Login");
    });


    test("handler function is called after clicking submit button", () => {
        render(<ServiceProviderLogin />);
        const mockFunction = jest.fn();
        const loginForms = screen.getAllByTestId("service-provider-login-form");
        const loginForm = loginForms[0];
        loginForm.addEventListener("submit", mockFunction);

        fireEvent.submit(loginForm);
        expect(mockFunction).toHaveBeenCalledTimes(1);
    });

});