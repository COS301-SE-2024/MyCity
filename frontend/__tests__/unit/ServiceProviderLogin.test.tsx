import ServiceProviderLogin from "@/components/Login/ServiceProviderLogin";
import { fireEvent, render, screen } from "@testing-library/react";

describe("ServiceProviderLogin", () => {


    it("renders a company name input", () => {
        render(<ServiceProviderLogin />);
        const companyInput = screen.getByPlaceholderText("e.g Plumbing");
        expect(companyInput).toBeInTheDocument();
    });

    it("renders a password input", () => {
        render(<ServiceProviderLogin />);
        const passwordInput = screen.getByPlaceholderText("Company Password");
        expect(passwordInput).toHaveAttribute("type", "password");
    });


    it("renders a forgot password link", () => {
        render(<ServiceProviderLogin />);

        const forgotPasswordLink = screen.getByRole("link");

        expect(forgotPasswordLink).toBeInTheDocument();
        expect(forgotPasswordLink).toHaveTextContent("Forgot password?");
    });

    it("renders a submit button", () => {
        render(<ServiceProviderLogin />);

        const submitButton = screen.getByRole("button", { name: /submit/i });

        expect(submitButton).toBeInTheDocument();
        expect(submitButton).toHaveTextContent("Submit");
    });


    test("onSubmit function is called after clicking submit button", () => {
        render(<ServiceProviderLogin />);
        const mockFunction = jest.fn();
        const loginForm = screen.getByTestId("service-provider-login-form");
        loginForm.addEventListener("submit", mockFunction);

        fireEvent.submit(loginForm)
        expect(mockFunction).toHaveBeenCalledTimes(1);
    });

})