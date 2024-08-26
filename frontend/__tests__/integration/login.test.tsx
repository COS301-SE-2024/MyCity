import Login from "@/app/auth/login/page";
import { fireEvent, render, screen } from "@testing-library/react";

describe("Login Page", () => {

    it("renders CitizenLogin form by default", () => {
        render(<Login />);
        const citizenForms = screen.getAllByTestId("citizen-login-form");
        const citizenForm = citizenForms[0];
        const municipalityForms = screen.getAllByTestId("municipality-login-form");
        const municipalityForm = municipalityForms[0];
        const serviceProviderForms = screen.getAllByTestId("service-provider-login-form");
        const serviceProviderForm = serviceProviderForms[0];
        expect(citizenForm).toBeInTheDocument();
        expect(municipalityForm).not.toBeInTheDocument();
        expect(serviceProviderForm).not.toBeInTheDocument();
    });


    // it("renders Municipality form when Municipality tab is clicked", () => {
    //     render(<Login />);
    //     const tabButton = screen.getByTestId("municipality-tab");
    //     fireEvent.click(tabButton);
    //     fireEvent.select(tabButton);

    //     const citizenForm = screen.queryByTestId("citizen-login-form");
    //     const municipalityForm = screen.queryByTestId("municipality-login-form");
    //     const serviceProviderForm = screen.queryByTestId("service-provider-login-form");

    //     expect(citizenForm).not.toBeInTheDocument();
    //     expect(municipalityForm).toBeInTheDocument();
    //     expect(serviceProviderForm).not.toBeInTheDocument();
    // });

    it("renders Service Provider form when Service Provider tab is clicked", () => {
        render(<Login />);
        const tabButtons = screen.getAllByTestId("service-provider-tab");
        const tabButton = tabButtons[0];
        fireEvent.click(tabButton);
        fireEvent.select(tabButton);

        const citizenForms = screen.getAllByTestId("citizen-login-form");
        const citizenForm = citizenForms[0];
        const municipalityForms = screen.getAllByTestId("municipality-login-form");
        const municipalityForm = municipalityForms[0];
        const serviceProviderForms = screen.getAllByTestId("service-provider-login-form");
        const serviceProviderForm = serviceProviderForms[0];
        expect(municipalityForm).not.toBeInTheDocument();
        expect(citizenForm).not.toBeInTheDocument();
        expect(serviceProviderForm).toBeInTheDocument();
    });


})