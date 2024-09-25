import Login from "@/app/auth/login/page";
import { fireEvent, render, screen } from "@testing-library/react";

describe("Login Page", () => {

    it("renders CitizenLogin form by default", () => {
        render(<Login />);
        const citizenForms = screen.getAllByTestId("citizen-login-form");
        const citizenForm = citizenForms[0];
        const municipalityForms = screen.queryAllByTestId("municipality-login-form");
        const municipalityForm = municipalityForms[0];
        const serviceProviderForms = screen.queryAllByTestId("service-provider-login-form");
        const serviceProviderForm = serviceProviderForms[0];

        // Assert the CitizenLogin form is visible and others are not
        expect(citizenForm).toBeInTheDocument();
    });

    it("renders Municipality form when Municipality tab is clicked", () => {
        render(<Login />);
        const tabButton = screen.getByTestId("municipality-tab");
        fireEvent.click(tabButton);

        const citizenForms = screen.getAllByTestId("citizen-login-form");
        const citizenForm = citizenForms[0];
        const municipalityForms = screen.queryAllByTestId("municipality-login-form");
        const municipalityForm = municipalityForms[0];
        const serviceProviderForms = screen.queryAllByTestId("service-provider-login-form");
        const serviceProviderForm = serviceProviderForms[0];

        // Assert the Municipality form is visible and others are not
        expect(municipalityForm).toBeInTheDocument();
    });

    it("renders Service Provider form when Service Provider tab is clicked", () => {
        render(<Login />);
        const tabButton = screen.getByTestId("service-provider-tab");
        fireEvent.click(tabButton);

        const citizenForms = screen.getAllByTestId("citizen-login-form");
        const citizenForm = citizenForms[0];
        const municipalityForms = screen.queryAllByTestId("municipality-login-form");
        const municipalityForm = municipalityForms[0];
        const serviceProviderForms = screen.queryAllByTestId("service-provider-login-form");
        const serviceProviderForm = serviceProviderForms[0];

        // Assert the Service Provider form is visible and others are not
        expect(serviceProviderForm).toBeInTheDocument();
    });
});
