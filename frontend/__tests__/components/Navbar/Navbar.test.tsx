import NavbarUser from "@/components/Navbar/NavbarUser";
import { fireEvent, render, screen } from "@testing-library/react";
import { act } from "react";


describe("Authenticated user Navbar", () => {

    it("renders a dashboard link", () => {
        
        act(() => {
            render(<NavbarUser />);
        });
        
        const dashboardLink = screen.getByRole("link", {name:/Dashboard/});
    
        expect(dashboardLink).toBeInTheDocument();
        expect(dashboardLink).toHaveAttribute("href", "/dashboard/citizen");
    });



    test("logout button triggers logout event", () => {

        act(() => {
            render(<NavbarUser />);
        });
        
        const profileAvatar = screen.getByTestId("profile-dropdown-trigger");
        
        act(() => {
            fireEvent.click(profileAvatar);
            
        });
        
        const logoutButton = screen.getByText(/Log out/);
        

        const mockFunction = jest.fn();
        logoutButton.addEventListener("click", mockFunction);

        expect(logoutButton).toBeInTheDocument();
        act(() => {
            logoutButton.click();
        });

        expect(mockFunction).toHaveBeenCalledTimes(1);
    });



});

// describe("Unauthenticated user Navbar", () => {

//     it("renders an email input", () => {
//         render(<CitizenLogin />);
//         // Use getByPlaceholderText if the placeholder is unique
//         const emailInput = screen.getByPlaceholderText("example@mail.com");
    
//         expect(emailInput).toBeInTheDocument();
//         expect(emailInput).toHaveAttribute("type", "email");
//     });

//     it("renders a password input", () => {
//         render(<CitizenLogin />);
//         const passwordInput = screen.getByLabelText(/Password/);

//         expect(passwordInput).toBeInTheDocument();
//         expect(passwordInput).toHaveAttribute("type", "password");
//     });
// });