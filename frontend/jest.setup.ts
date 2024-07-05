import "@testing-library/jest-dom";

jest.mock('next/navigation', () => ({
    usePathname: jest.fn(),
    useRouter: jest.fn(() => { return { push: (url: string) => { return true; } } })
}));


jest.mock('./src/services/auth.service', () => ({
    handleSignIn: jest.fn(() => { const isSignedIn = false; return { isSignedIn }; }),
    handleSignUp: jest.fn(() => { const isSignedIn = false; return { isSignedIn }; }),
    authenticateClient: jest.fn(() => { return false; }),
    handleSignOut: jest.fn(),
    // signIn: jest.fn(() => { const isSignedIn = true; return isSignedIn; }),
    // fetchAuthSession: jest.fn(),
    // autoSignIn: jest.fn()
}));

jest.mock('./src/utils/authActions');
jest.mock('./src/hooks/useProfile', () => ({
    useProfile: () => { return { getUserProfile: jest.fn(() => { return { current: {} }; }) } },
}));

// jest.mock('aws-amplify/auth', () => ({
//     signIn: jest.fn(() => { const isSignedIn = false; return { isSignedIn }; }),
//     signUp: jest.fn(() => { const isSignedIn = false; return { isSignedIn }; }),
//     signOut: jest.fn(),
//     fetchAuthSession: jest.fn(() => { return { session: { tokens: {} } } }),
//     // autoSignIn: jest.fn()
// }));
