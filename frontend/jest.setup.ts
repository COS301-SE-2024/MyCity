import "@testing-library/jest-dom";
// jest.mock('next/navigation', () => jest.requireActual('next-router-mock'));
jest.mock('next/navigation', () => ({
    usePathname: jest.fn(),
    useRouter: jest.fn()
}));