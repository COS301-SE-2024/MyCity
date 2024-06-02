import Login from "@/app/login/page";
import { fireEvent, render, screen } from "@testing-library/react";

describe("Login Page", () => {

    it("renders CitizenLogin form by default", () => {
        render(<Login />);
        const citizenForm = screen.getByTestId("citizen-login-form");
        const municipalityForm = screen.queryByTestId("municipality-login-form");
        const serviceProviderForm = screen.queryByTestId("service-provider-login-form");
        
        expect(citizenForm).toBeInTheDocument();
        expect(municipalityForm).not.toBeInTheDocument();
        expect(serviceProviderForm).not.toBeInTheDocument();
    });

})