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
}

export const USER_PATH_SUFFIX_COOKIE_NAME = "mycity.net.za.userpathsuffix";