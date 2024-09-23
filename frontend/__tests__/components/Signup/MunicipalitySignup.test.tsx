import MunicipalitySignup from "@/components/Signup/MunicipalitySignup";
import { fireEvent, render, screen } from "@testing-library/react";

describe("Municipality Signup", () => {

    /* Test 1: Renders email input correctly */
    it("renders an email input", () => {
        render(<MunicipalitySignup />);
        // Use getByPlaceholderText if the placeholder is unique
        const emailInput = screen.getByTestId("email-input", { exact: true });
    
        expect(emailInput).toBeInTheDocument();
        expect(emailInput).toHaveAttribute("type", "email");
    });

    // it("renders a select input to choose municipality", () => {
    //     render(<MunicipalitySignup />);

    //     const muniAutocomplete = screen.getByRole("textbox", {name:/municipality/i});

    //     expect(muniAutocomplete).toBeInTheDocument();
    //     expect(muniAutocomplete).toHaveAttribute("type", "text");
    // });


    /* Test : Submit button displays and works*/
    it("renders a submit button", () => {
        render(<MunicipalitySignup />);
        const submitButtons = screen.getAllByText("Submit");
        const submitButton = submitButtons[0];

        expect(submitButton).toBeInTheDocument();
    });

    test("handler function is called after clicking submit button", () => {
        render(<MunicipalitySignup />);
        const mockFunction = jest.fn();
        const loginForm = screen.getByTestId("municipality-signup-form");
        loginForm.addEventListener("submit", mockFunction);

        fireEvent.submit(loginForm)
        expect(mockFunction).toHaveBeenCalledTimes(1);
    });

})