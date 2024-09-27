import { render, screen } from "@testing-library/react";
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

/* 
Skipping the entire test suite 
*/
describe.skip("CreateTicket Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  /*
  Skipped test to check if the page rendered
  */
  test("renders the CreateTicket page without crashing", () => {
    // Render the CreateTicket component
    render(<CreateTicket />);

    // Check for the presence of a main component element
    expect(screen.getByTestId("create-ticket-comp")).toBeInTheDocument();
  });
});

/*
import { render, screen, fireEvent } from "@testing-library/react";
import CreateTicket from "@/app/create-ticket/citizen/page";
import '@testing-library/jest-dom';

// Uncomment and expand these tests as needed for further testing

// Desktop view testing that the page loads
test("renders the CreateTicket component correctly on desktop view", () => {
  render(<CreateTicket />);
  
  // Check for NavbarUser component
  expect(screen.getByTestId("navbar-user")).toBeInTheDocument();
  
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

// Help button visibility
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

// Notifications
test("displays unread notifications in the NavbarUser", () => {
  render(<CreateTicket />);

  // Check that unread notifications are displayed in the NavbarUser
  const navbarUser = screen.getByTestId("navbar-user");
  expect(navbarUser).toHaveTextContent(/Unread: [1-9][0-9]*///);
// });

// // Background loads
// test("renders the background image", () => {
//   render(<CreateTicket />);
  
//   // Check for the inline styles with the background image
//   const backgroundDiv = document.querySelector(".absolute.inset-0");
//   expect(backgroundDiv).toHaveStyle(
//     `background-image: linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url("https://mycity-storage-bucket.s3.eu-west-1.amazonaws.com/resources/Johannesburg-Skyline.webp")`
//   );
// });
// */
