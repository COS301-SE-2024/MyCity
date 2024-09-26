import { render, screen, fireEvent } from "@testing-library/react";
import CreateTicket from "@/app/create-ticket/municipality/page";
import '@testing-library/jest-dom';

// Mock components used in CreateTicket
jest.mock("../../../src/components/CreateTicket/CreateTicketComp", () => () => (
  <div data-testid="create-ticket-comp">Create Ticket Component</div>
));
jest.mock("../../../src/components/Navbar/NavbarMunicipality", () => ({ unreadNotifications }: { unreadNotifications: number }) => (
  <div data-testid="navbar-municipality">Navbar Municipality (Unread: {unreadNotifications})</div>
));
jest.mock("../../../src/components/Navbar/NavbarMobile", () => () => (
  <div data-testid="navbar-mobile">Navbar Mobile</div>
));

describe("CreateTicket Municipality Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders the CreateTicket component correctly on desktop view", () => {
    // Render the component in desktop view
    render(<CreateTicket />);
    
    // Check for NavbarMunicipality component
    expect(screen.getByTestId("navbar-municipality")).toBeInTheDocument();
    
    // Check for the CreateTicketComp component
    const ticketcomponents = screen.getAllByTestId("create-ticket-comp");
    const ticketcomp = ticketcomponents[0];
    expect(ticketcomp).toBeInTheDocument();
    
    // Check that the 'Report an Issue' heading is rendered
    const headings = screen.getAllByText(/Report an Issue/i);
    const heading = headings[0];
    expect(heading).toBeInTheDocument();
    
    // Check if the help menu button is present
    const helpButton = screen.getByTestId("open-help-menu");
    expect(helpButton).toBeInTheDocument();
  });

  test("renders the CreateTicket component correctly on mobile view", () => {
    // Mock the window size for mobile view
    global.innerWidth = 375; // iPhone screen size
    global.dispatchEvent(new Event("resize"));

    render(<CreateTicket />);

    // Check for NavbarMobile component
    expect(screen.getByTestId("navbar-mobile")).toBeInTheDocument();

    // Check that the CreateTicketComp component is rendered
    const ticketcomponents = screen.getAllByTestId("create-ticket-comp");
    const ticketcomp = ticketcomponents[1];
    expect(ticketcomp).toBeInTheDocument();

    // Check if the 'Report an Issue' heading is centered
    const headings = screen.getAllByText(/Report an Issue/i);
    const heading = headings[1];
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveClass("text-center");
  });

  test("opens and closes the help menu when the help button is clicked", () => {
    render(<CreateTicket />);

    // Initially, help menu should not be visible
    expect(screen.queryByTestId("help")).not.toBeInTheDocument();

    // Click on help button
    const helpButton = screen.getByTestId("open-help-menu");
    fireEvent.click(helpButton);

    // Help menu should be visible
    expect(screen.getByTestId("help")).toBeInTheDocument();

    // Close help menu
    const closeHelpButton = screen.getByTestId("close-help-menu");
    fireEvent.click(closeHelpButton);

    // Help menu should not be visible anymore
    expect(screen.queryByTestId("help")).not.toBeInTheDocument();
  });

  test("displays unread notifications in the NavbarMunicipality", () => {
    render(<CreateTicket />);

    // Check that unread notifications are displayed in the NavbarMunicipality
    const navbarMunicipality = screen.getByTestId("navbar-municipality");
    expect(navbarMunicipality).toHaveTextContent(/Unread: [1-9][0-9]*/);
  });

  test("renders the background image", () => {
    render(<CreateTicket />);
    
    // Check for the inline styles with the background image
    const backgroundDiv = document.querySelector(".absolute.inset-0");
    expect(backgroundDiv).toHaveStyle(
      `background-image: linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url("https://mycity-storage-bucket.s3.eu-west-1.amazonaws.com/resources/Johannesburg-Skyline.webp")`
    );
  });
});
