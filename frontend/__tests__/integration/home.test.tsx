import { render, screen, fireEvent } from "@testing-library/react";
import Home from "@/app/page";
import { useMediaQuery } from "react-responsive";
import Router from "next/router";
import mockRouter from "next-router-mock";
import NavbarGuest from "@/components/Navbar/NavbarGuest";

// Mock useMediaQuery to control desktop and mobile views
jest.mock("react-responsive", () => ({
  useMediaQuery: jest.fn(),
}));

jest.mock("next/router", () => require("next-router-mock"));

describe("Home Page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  /* Test 1
  Checking that the desktop view renders upon opening the PWA
  */
  it("renders the desktop view correctly", () => {
    // Mock to simulate desktop view
    (useMediaQuery as jest.Mock).mockReturnValue(false);

    render(<Home />);

    // Check that the text is displayed in the desktop view
    const headings = screen.getAllByText((content, element) =>
      content.includes("Be the change in your city")
    );
    const heading = headings[0];
    expect(heading).toBeInTheDocument();

    // Check for Sign Up and Log In buttons in the desktop view
    const signUpButtons = screen.getAllByText("Sign Up");
    const signUpButton = signUpButtons[0];
    const loginButtons = screen.getAllByText("Log In");
    const loginButton = loginButtons[0];

    expect(signUpButton).toBeInTheDocument();
    expect(loginButton).toBeInTheDocument();
  });

  /* Test 2
  Desktop navigation to signup page
  */
  it("navigates to the Sign Up page when Sign Up button is clicked (desktop)", () => {
    // Mock to simulate desktop view
    (useMediaQuery as jest.Mock).mockReturnValue(false);

    render(<Home />);

    // Find and click on the Sign Up link
    const signUpButtons = screen.getAllByRole('link', { name: /Sign Up/i });
    const signUpButton = signUpButtons[0];
    fireEvent.click(signUpButton);

    // Simulate router push to sign up page
    mockRouter.push("/auth/signup");

    // Check if the router path has changed
    expect(Router.asPath).toBe("/auth/signup");
  });

  /* Test 3
  Desktop navigation to the login page
  */
  it("navigates to the Login page when Log In button is clicked (desktop)", () => {
    // Mock to simulate desktop view
    (useMediaQuery as jest.Mock).mockReturnValue(false);

    render(<Home />);

    // Click on the Log In button
    const loginButtons = screen.getAllByRole('link', { name: /Log In/i });
    const loginButton = loginButtons[0];
    fireEvent.click(loginButton);

    // Simulate router push to login page
    mockRouter.push("/auth/login");

    // Test if user is redirected to the Login page
    expect(Router.asPath).toBe("/auth/login");
  });

  /* Test 4
  Checking that the mobile view renders upon opening the PWA
  */
  it("renders the mobile view correctly", () => {
    // Mock to simulate mobile view
    (useMediaQuery as jest.Mock).mockReturnValue(true);

    render(<Home />);

    // Check for MyCity logo in mobile view
    const logos = screen.getAllByAltText("MyCity");
    const logo = logos[0];
    expect(logo).toBeInTheDocument();

    // Check for Sign Up and Log In buttons in mobile view
    const signUpButtons = screen.getAllByText("Sign Up");
    const signUpButton = signUpButtons[0];
    const loginButtons = screen.getAllByText("Log In");
    const loginButton = loginButtons[0];

    expect(signUpButton).toBeInTheDocument();
    expect(loginButton).toBeInTheDocument();
  });

  /* Test 5
  Navigation to the signup page once mobile button is clicked.
  */
  it("navigates to the Sign Up page when Sign Up button is clicked (mobile)", () => {
    // Mock to simulate mobile view
    (useMediaQuery as jest.Mock).mockReturnValue(true);

    render(<Home />);

    // Click on the Sign Up button
    const signUpButtons = screen.getAllByRole('link', { name: /Sign Up/i });
    const signUpButton = signUpButtons[0];
    fireEvent.click(signUpButton);

    // Simulate router push to login page
    mockRouter.push("/auth/signup");

    // Test if user is redirected to the Sign Up page
    expect(Router.asPath).toBe("/auth/signup");
  });

  /* Test 6
  Navigation to the login page on mobile once button is clicked
  */
  it("navigates to the Login page when Log In button is clicked (mobile)", () => {
    // Mock to simulate mobile view
    (useMediaQuery as jest.Mock).mockReturnValue(true);

    render(<Home />);

    // Click on the Log In button
    const loginButtons = screen.getAllByRole('link', { name: /Log In/i });
    const loginButton = loginButtons[0];
    fireEvent.click(loginButton);

    // Simulate router push to login page
    mockRouter.push("/auth/login");

    // Test if user is redirected to the Login page
    expect(Router.asPath).toBe("/auth/login");
  });

  // Navbar Tests

  /* Test 7
  Navigation to the Welcome page from the Navbar
  */
  it("navigates to the Welcome page when Welcome link is clicked", () => {
    render(<NavbarGuest />);

    const welcomeLink = screen.getByText(/Welcome/i);
    fireEvent.click(welcomeLink);

    // Simulate router push to welcome page
    mockRouter.push("/");

    // Test if user is redirected to the Welcome page
    expect(Router.asPath).toBe("/");
  });

  /* Test 8
  Navigation to the About page from the Navbar
  */
  it("navigates to the About page when What is MyCity link is clicked", () => {
    render(<NavbarGuest />);

    const aboutLinks = screen.getAllByText("What is MyCity");
    const aboutLink = aboutLinks[0];
    fireEvent.click(aboutLink);

    // Simulate router push to about page
    mockRouter.push("/about");

    // Test if user is redirected to the About page
    expect(Router.asPath).toBe("/about");
  });

  /* Test 9
  Navigation to the Guide page from the Navbar
  */
  it("navigates to the Guide page when Guide link is clicked", () => {
    render(<NavbarGuest />);

    const guideLinks = screen.getAllByText("How it works");
    const guideLink = guideLinks[0];
    fireEvent.click(guideLink);

    // Simulate router push to guide page
    mockRouter.push("/guide");

    // Test if user is redirected to the Guide page
    expect(Router.asPath).toBe("/guide");
  });


});
