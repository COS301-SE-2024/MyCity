import ServiceProviderLogin from "@/components/Login/ServiceProviderLogin";
import { fireEvent, render, screen } from "@testing-library/react";

describe("ServiceProviderLogin", () => {

    it("renders an email input", () => {
        render(<ServiceProviderLogin />);
        const emailInput = screen.getByLabelText("Email");

        expect(emailInput).toBeInTheDocument();
        expect(emailInput).toHaveAttribute("type", "email");
    });

    // it("renders a password input", () => {
    //     render(<ServiceProviderLogin />);
    //     const passwordInput = screen.getByLabelText("Password");

    //     expect(passwordInput).toBeInTheDocument();
    //     expect(passwordInput).toHaveAttribute("type", "password");
    // });


    // it("renders a forgot password link", () => {
    //     render(<ServiceProviderLogin />);

    //     const forgotPasswordLink = screen.getByRole("link");

    //     expect(forgotPasswordLink).toBeInTheDocument();
    //     expect(forgotPasswordLink).toHaveTextContent("Forgot password?");
    // });

    // it("renders a submit button", () => {
    //     render(<ServiceProviderLogin />);

    //     const submitButton = screen.getByRole("button", { name: /submit/i });

    //     expect(submitButton).toBeInTheDocument();
    //     expect(submitButton).toHaveTextContent("Submit");
    // });


    // test("handler function is called after clicking submit button", () => {
    //     render(<ServiceProviderLogin />);
    //     const mockFunction = jest.fn();
    //     const loginForm = screen.getByTestId("service-provider-login-form");
    //     loginForm.addEventListener("submit", mockFunction);

    //     fireEvent.submit(loginForm);
    //     expect(mockFunction).toHaveBeenCalledTimes(1);
    // });

});