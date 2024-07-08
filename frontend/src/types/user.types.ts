import { AuthTokens, JWT } from "aws-amplify/auth";
import { CognitoAuthSignInDetails } from "node_modules/@aws-amplify/auth/dist/esm/providers/cognito/types";

export enum UserRole {
    CITIZEN = "CITIZEN",
    MUNICIPALITY = "MUNICIPALITY",
    PRIVATE_COMPANY = "PRIVATE-COMPANY"
};

export interface UserData {
    sub: string | undefined;
    email: string | undefined;
    given_name: string | undefined;
    family_name: string | undefined;
    picture: string | undefined;
    user_role: UserRole | undefined;
    municipality: string | undefined;
    session_token : AuthTokens | undefined;
}