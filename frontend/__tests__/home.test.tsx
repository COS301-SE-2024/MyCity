import Home from "@/app/home/page";
import { render, screen } from "@testing-library/react";

describe("Home", () => {
    it("renders a heading", () => {
        render(<Home />)

        const heading = screen.getByRole("heading", { level: 1 })

        expect(heading).toBeInTheDocument()
    })
})