import ServiceProviderSignup from "@/components/Signup/ServiceProviderSignup";
import { fireEvent, render, screen } from "@testing-library/react";

describe("Service Provider Signup", () => {

    /* Test 1: Renders email input correctly */
    it("renders an email input", () => {
        render(<ServiceProviderSignup />);
        // Use getByPlaceholderText if the placeholder is unique
        const emailInput = screen.getByTestId("email-input", { exact: true });

        expect(emailInput).toBeInTheDocument();
        expect(emailInput).toHaveAttribute("type", "email");
    });

    // it("renders an input to fill in company name", () => {
    //     render(<ServiceProviderSignup />);

    //     const companyInput = screen.getByLabelText("Registered Company Name");

    //     expect(companyInput).toBeInTheDocument();
    //     expect(companyInput).toHaveAttribute("type", "text");
    // });

    // it("renders a select input to choose service area", () => {
    //     render(<ServiceProviderSignup />);

    //     const muniAutocomplete = screen.getByPlaceholderText("e.g Plumbing");

    //     expect(muniAutocomplete).toBeInTheDocument();
    //     expect(muniAutocomplete).toHaveAttribute("type", "text");
    // });


    // it("renders an email input", () => {
    //     render(<ServiceProviderSignup />);
    //     const emailInput = screen.getByLabelText("Email");

    //     expect(emailInput).toBeInTheDocument();
    //     expect(emailInput).toHaveAttribute("type", "email");
    // });


    /* Test : Submit button displays and works*/
    it("renders a submit button", () => {
        render(<ServiceProviderSignup />);
        const submitButtons = screen.getAllByText("Submit");
        const submitButton = submitButtons[0];

        expect(submitButton).toBeInTheDocument();
    });

    test("handler function is called after clicking submit button", () => {
        render(<ServiceProviderSignup />);
        const mockFunction = jest.fn();
        const loginForm = screen.getByTestId("service-provider-signup-form");
        loginForm.addEventListener("submit", mockFunction);

        fireEvent.submit(loginForm)
        expect(mockFunction).toHaveBeenCalledTimes(1);
    });

})