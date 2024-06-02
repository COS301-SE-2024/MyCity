import CitizenLogin from "@/components/Login/CitizenLogin";
import { render, screen } from "@testing-library/react";

describe("CitizenLogin", () => {



    it("renders an email input", () => {
        render(<CitizenLogin />);
        const emailInput = screen.getByLabelText("Email");
        expect(emailInput).toHaveAttribute("type", "email");
    });

    it("renders a password input", () => {
        render(<CitizenLogin />);
        const passwordInput = screen.getByLabelText("Password");
        expect(passwordInput).toHaveAttribute("type", "password");
    });


    it("renders a forgot password link", () => {
        render(<CitizenLogin />);
        const forgotPasswordLink = screen.getByText("Forgot password?");
        expect(forgotPasswordLink).toBeInTheDocument();
    });


    // it("renders a heading", () => {
    //     const forgotPasswordLink = screen.getByText("Forgot pasword?");
    //     expect(forgotPasswordLink).toBeInTheDocument();
    // });

})