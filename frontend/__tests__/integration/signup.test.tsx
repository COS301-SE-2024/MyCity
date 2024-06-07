import Signup from "@/app/auth/signup/page";
import { fireEvent, render, screen } from "@testing-library/react";

describe("Signup Page", () => {

    it("renders CitizenSignup form by default", () => {
        render(<Signup />);
        const citizenForm = screen.queryByTestId("citizen-signup-form");
        const municipalityForm = screen.queryByTestId("municipality-signup-form");
        const serviceProviderForm = screen.queryByTestId("service-provider-signup-form");

        expect(citizenForm).toBeInTheDocument();
        expect(municipalityForm).not.toBeInTheDocument();
        expect(serviceProviderForm).not.toBeInTheDocument();
    });


    it("renders Municipality form when Municipality tab is clicked", () => {
        render(<Signup />);
        const tabButton = screen.getByTestId("municipality-tab");
        fireEvent.click(tabButton);
        fireEvent.select(tabButton);

        const citizenForm = screen.queryByTestId("citizen-signup-form");
        const municipalityForm = screen.queryByTestId("municipality-signup-form");
        const serviceProviderForm = screen.queryByTestId("service-provider-signup-form");

        expect(citizenForm).not.toBeInTheDocument();
        expect(municipalityForm).toBeInTheDocument();
        expect(serviceProviderForm).not.toBeInTheDocument();
    });

    it("renders Service Provider form when Service Provider tab is clicked", () => {
        render(<Signup />);
        const tabButton = screen.getByTestId("service-provider-tab");
        fireEvent.click(tabButton);
        fireEvent.select(tabButton);

        const citizenForm = screen.queryByTestId("citizen-signup-form");
        const municipalityForm = screen.queryByTestId("municipality-signup-form");
        const serviceProviderForm = screen.queryByTestId("service-provider-signup-form");

        expect(municipalityForm).not.toBeInTheDocument();
        expect(citizenForm).not.toBeInTheDocument();
        expect(serviceProviderForm).toBeInTheDocument();
    });


})