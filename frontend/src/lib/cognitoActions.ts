import { UserRole } from "@/types/user.types";
import { SignUpInput, SignUpOutput, autoSignIn, signIn, signOut, signUp } from "aws-amplify/auth";


export async function handleSignIn(form: FormData, userRole: UserRole) {

    const { isSignedIn } = await signIn({
        username: String(form.get("email")),
        password: String(form.get("password")),
    });

    return { isSignedIn };
}


export async function handleSignOut(form: FormData, userRole: UserRole) {
    await signOut();
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
                "custom:user_role": userRole
            },
            autoSignIn: true,
        },
    };


    if (userRole == UserRole.MUNICIPALITY) {
        signupOptions.options!.userAttributes["custom:municipality"] = String(form.get("municipality"));
        signupOptions.options!.userAttributes["custom:auth_code"] = String(form.get("municode"));

    }
    else if (userRole == UserRole.PRIVATE_COMPANY) {
        signupOptions.options!.userAttributes["custom:auth_code"] = String(form.get("auth_code"));
    }


    const { nextStep } = await signUp(signupOptions);

    return handleSignUpStep(nextStep, userRole);
}



const handleSignUpStep = async (step: SignUpOutput["nextStep"], userRole: UserRole) => {
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
