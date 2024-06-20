import MunicipalitySignup from "@/components/Signup/MunicipalitySignup";
import { fireEvent, render, screen } from "@testing-library/react";

describe("Municipality Signup", () => {

    /*it("renders an email input", () => {
        render(<MunicipalitySignup />);
        const emailInput = screen.getByLabelText("Email");

        expect(emailInput).toBeInTheDocument();
        expect(emailInput).toHaveAttribute("type", "email");
    });*/

    it("renders an email input", () => {
        render(<MunicipalitySignup />);
        // Use getByPlaceholderText if the placeholder is unique
        const emailInput = screen.getByPlaceholderText("example@mail.com");
    
        expect(emailInput).toBeInTheDocument();
        expect(emailInput).toHaveAttribute("type", "email");
    });

    // it("renders a select input to choose municipality", () => {
    //     render(<MunicipalitySignup />);

    //     const muniAutocomplete = screen.getByRole("textbox", {name:/municipality/i});

    //     expect(muniAutocomplete).toBeInTheDocument();
    //     expect(muniAutocomplete).toHaveAttribute("type", "text");
    // });


    // it("renders a submit button", () => {
    //     render(<MunicipalitySignup />);
    //     const submitButton = screen.getByRole("button", {name:/submit/i});

    //     expect(submitButton).toBeInTheDocument();
    //     expect(submitButton).toHaveTextContent("Submit");
    // });


    // test("handler function is called after clicking submit button", () => {
    //     render(<MunicipalitySignup />);
    //     const mockFunction = jest.fn();
    //     const loginForm = screen.getByTestId("municipality-signup-form");
    //     loginForm.addEventListener("submit", mockFunction);

    //     fireEvent.submit(loginForm)
    //     expect(mockFunction).toHaveBeenCalledTimes(1);
    // });

})