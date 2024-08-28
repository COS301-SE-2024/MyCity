import { UserRole } from '@/types/custom.types';
import { setUserPathSuffix, removeUserPathSuffix } from '@/utils/authActions';
import { SignUpInput, SignUpOutput, UpdatePasswordInput, autoSignIn, fetchAuthSession, signIn, signInWithRedirect, signOut, signUp, updatePassword } from 'aws-amplify/auth';


export async function handleSignIn(form: FormData, userRole: UserRole) {
    await setUserPathSuffix(userRole);
    let username = String(form.get("email"));
    const { isSignedIn } = await signIn({
        username: username.toLowerCase(),
        password: String(form.get("password")),
    });

    console.log("username: " + String(form.get("email")) + " password : " + String(form.get("password")))
    console.log("did it log in: " + String(isSignedIn))


    return { isSignedIn };
}

export async function handleGoogleSignIn() {
    await signInWithRedirect({
        provider: "Google"
    });
}


export async function handleSignOut() {
    removeUserPathSuffix();
    await signOut();
}

export async function handleUpdatePassword(form: FormData) {
    const _oldPassword = String(form.get("oldPassword"));
    const _newPassword = String(form.get("newPassword"));

    const passwordInput: UpdatePasswordInput = {
        newPassword: _newPassword,
        oldPassword: _oldPassword
    };

    try {
        await updatePassword(passwordInput);
    } catch (error) {
        throw error;
    }
}


export async function handleSignUp(form: FormData, userRole: UserRole) {
    const signupOptions: SignUpInput = {
        username: String(form.get("email")),
        password: String(form.get("password")),
        options: {
            userAttributes: {
                email: String(form.get("email")),
                given_name: String(form.get("firstname")),
                family_name: String(form.get("surname")),
                "custom:user_role": userRole,

            },
            autoSignIn: true,
        },
    };


    if (userRole == UserRole.MUNICIPALITY) {
        signupOptions.options!.userAttributes["custom:auth_code"] = String(form.get("municode"));

    }
    else if (userRole == UserRole.PRIVATE_COMPANY) {
        signupOptions.options!.userAttributes["custom:auth_code"] = String(form.get("authcode"));
    }


    const { nextStep } = await signUp(signupOptions);

    return handleSignUpStep(nextStep, userRole);
}



const handleSignUpStep = async (step: SignUpOutput["nextStep"], userRole: UserRole) => {
    console.log(String("Signup step:" + step.signUpStep))
    switch (step.signUpStep) {
        case "CONFIRM_SIGN_UP":
        // Redirect end-user to confirm-sign up screen.

        case "COMPLETE_AUTO_SIGN_IN":
            const { isSignedIn } = await autoSignIn();
            return { isSignedIn };
    }

    const isSignedIn = false;
    return { isSignedIn };
};


export const authenticateClient = async () => {
    try {
        const session = await fetchAuthSession();
        return (
            session.tokens?.accessToken !== undefined &&
            session.tokens?.idToken !== undefined
        );

    } catch (error) {
        console.log(error);
        return false;
    }
};