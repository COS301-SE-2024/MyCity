import MunicipalityLogin from "@/components/Login/MunicipalityLogin";
import { fireEvent, render, screen } from "@testing-library/react";

describe("MunicipalityLogin", () => {

    /*it("renders an email input", () => {
        render(<MunicipalityLogin />);
        const emailInput = screen.getByLabelText("Email");

        expect(emailInput).toBeInTheDocument();
        expect(emailInput).toHaveAttribute("type", "email");
    });*/

    it("renders an email input", () => {
        render(<MunicipalityLogin />);
        // Use getByPlaceholderText if the placeholder is unique
        const emailInput = screen.getByPlaceholderText("example@mail.com");
    
        expect(emailInput).toBeInTheDocument();
        expect(emailInput).toHaveAttribute("type", "email");
    });

    // it("renders textbox to select municipality", () => {
    //     render(<MunicipalityLogin />);
    //     const muniAutocomplete = screen.getByRole("combobox");
    //     expect(muniAutocomplete).toHaveAttribute("type", "text");
    // });

    // it("renders a password input", () => {
    //     render(<MunicipalityLogin />);
    //     const passwordInput = screen.getByPlaceholderText("Password");
    //     expect(passwordInput).toHaveAttribute("type", "password");
    // });

    // it("renders a submit button", () => {
    //     render(<MunicipalityLogin />);

    //     const submitButton = screen.getByRole("button", { name: /submit/i });

    //     expect(submitButton).toBeInTheDocument();
    //     expect(submitButton).toHaveTextContent("Submit");
    // });


    // test("handler function is called after clicking submit button", () => {
    //     render(<MunicipalityLogin />);
    //     const mockFunction = jest.fn();
    //     const loginForm = screen.getByTestId("municipality-login-form");
    //     loginForm.addEventListener("submit", mockFunction);

    //     fireEvent.submit(loginForm)
    //     expect(mockFunction).toHaveBeenCalledTimes(1);
    // });

});