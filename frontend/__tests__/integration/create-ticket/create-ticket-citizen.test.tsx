import { render, screen, fireEvent } from "@testing-library/react";
import CreateTicket from "@/app/create-ticket/citizen/page";
import '@testing-library/jest-dom';

/*
Mocked components
*/
jest.mock("../../../src/components/CreateTicket/CreateTicketComp", () => () => (
  <div data-testid="create-ticket-comp">Create Ticket Component</div>
));
jest.mock("../../../src/components/Navbar/NavbarUser", () => ({ unreadNotifications }: { unreadNotifications: number }) => (
  <div data-testid="navbar-user">Navbar User (Unread: {unreadNotifications})</div>
));
jest.mock("../../../src/components/Navbar/NavbarMobile", () => () => (
  <div data-testid="navbar-mobile">Navbar Mobile</div>
));

describe("CreateTicket Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  /*
  Test that the CreateTicket component renders without errors
  */
  test("renders the CreateTicket component correctly", () => {
    // Render the CreateTicket component
    render(<CreateTicket />);
    
    // Check that NavbarUser is rendered
    expect(screen.getByTestId("navbar-user")).toBeInTheDocument();
    
    // Check that CreateTicketComp is rendered
    expect(screen.getByTestId("create-ticket-comp")).toBeInTheDocument();
  });

  /*
  Test that the help menu button toggles the help menu visibility
  */
  test("toggles the help menu when the help button is clicked", () => {
    render(<CreateTicket />);

    // Simulate clicking the help button
    fireEvent.click(screen.getByTestId("open-help-menu"));
    
    // Expect help menu to be visible
    expect(screen.getByTestId("help")).toBeInTheDocument();

    // Simulate clicking the close button in the help menu
    fireEvent.click(screen.getByTestId("close-help-menu"));
    
    // Expect help menu to be closed
    expect(screen.queryByTestId("help")).not.toBeInTheDocument();
  });

  /*
  Test that NavbarUser displays unread notifications
  */
  test("displays unread notifications count in NavbarUser", () => {
    render(<CreateTicket />);
    
    // Check that the unread notifications text is present
    expect(screen.getByTestId("navbar-user")).toHaveTextContent(/Unread: [1-9][0-9]*/);
  });

  /*
  Test that the component has the correct background image style
  */
  test("renders the correct background image", () => {
    render(<CreateTicket />);

    // Check the background element and its style
    const backgroundDiv = document.querySelector(".absolute.inset-0");
    expect(backgroundDiv).toHaveStyle(
      `background-image: linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url("https://mycity-storage-bucket.s3.eu-west-1.amazonaws.com/resources/Johannesburg-Skyline.webp")`
    );
  });
});
