import "@testing-library/jest-dom";

jest.mock('next/navigation', () => ({
    usePathname: jest.fn(),
    useRouter: jest.fn()
}));


// jest.mock('aws-amplify/auth', () => ({
//     signUp: jest.fn(),
//     signIn:jest.fn(),
//     signOut:jest.fn()
// }));
