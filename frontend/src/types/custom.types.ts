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
    session_token : string | undefined;
}

export const USER_PATH_SUFFIX_COOKIE_NAME = "mycity.net.za.userpathsuffix";


export interface BasicMunicipality {
    municipality_id: string;
}

export interface FaultType {
    asset_id: string;
    assetIcon: string;
    multiplier: number;
}

export interface Municipality {
    municipality_id: string;
    name: string;
    province: string;
    email: string;
    contactNumber: string;
}


export interface ServiceProvider {
    companyLogo?: string;
    name: string;
    contactNumber: string;
    email: string;
    qualityRating?: number;
}

export interface Ticket {
    //not the only components of a ticket (merely the one we are using)
    ticket_id: string;
    asset_id: string;
    dateOpened: string;
    municipality_id: string;
    state: string;
    upvotes: number;
    viewCount: number;
}