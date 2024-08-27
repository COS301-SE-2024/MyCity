import Signup from "@/app/auth/signup/page";
import { fireEvent, render, screen } from "@testing-library/react";

describe("Signup Page", () => {

    it("renders CitizenSignup form by default", () => {
        render(<Signup />);
        const citizenForms = screen.getAllByTestId("citizen-signup-form", { exact: true });
        const citizenForm = citizenForms[0]; // Assuming you want to select the first element

        expect(citizenForm).toBeInTheDocument();
    });


    it("renders Municipality form when Municipality tab is clicked", () => {
        render(<Signup />);
        const tabButton = screen.getByTestId("municipality-tab", { exact: true });
        fireEvent.click(tabButton);
        fireEvent.select(tabButton);

        const municipalityForms = screen.getAllByTestId("municipality-signup-form", { exact: true });
        const municipalityForm = municipalityForms[0]; // Assuming you want to select the first element

        expect(municipalityForm).toBeInTheDocument();
    });

    it("renders Service Provider form when Service Provider tab is clicked", () => {
        render(<Signup />);
        const tabButton = screen.getByTestId("service-provider-tab", { exact: true });
        fireEvent.click(tabButton);
        fireEvent.select(tabButton);

        const serviceProviderForms = screen.getAllByTestId("service-provider-signup-form", { exact: true });
        const serviceProviderForm = serviceProviderForms[0]; // Assuming you want to select the first element

        expect(serviceProviderForm).toBeInTheDocument();
    });


})