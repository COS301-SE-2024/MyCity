import Home from "@/app/home/page";
import { render, screen } from "@testing-library/react";

describe("Home", () => {
    //integration test for the home page

    //very simple example to check if home page renders an <h1> html element
    it("renders a heading", () => {
        render(<Home />)

        const heading = screen.getByRole("heading", { level: 1 })

        expect(heading).toBeInTheDocument()
    })
})