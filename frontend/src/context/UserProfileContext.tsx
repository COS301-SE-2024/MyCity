"use client"

import { MunicipalityLngLat, UserData, UserRole } from '@/types/custom.types';
import { fetchUserAttributes, updateUserAttributes, fetchAuthSession } from 'aws-amplify/auth';
import { MutableRefObject, ReactNode, createContext, useRef } from 'react';

export interface UserProfileContextProps {
    getUserProfile: () => Promise<MutableRefObject<UserData | null>>;
    updateUserProfile: (data: UserData) => void;
    getMuniLngLat: () => MunicipalityLngLat | null;
}

const UserProfileContext = createContext<UserProfileContextProps | undefined>(undefined);

export const UserProfileProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const userProfile = useRef<UserData | null>(null);

    const getUserProfile = async () => {
        //if user profile data already cached, return it
        if (userProfile.current) {
            return userProfile;
        }

        const session = await fetchAuthSession();
        //otherwise get current user profile details
        const userDetails = await fetchUserAttributes();

        userProfile.current = {
            sub: userDetails.sub,
            email: userDetails.email,
            given_name: userDetails.given_name,
            family_name: userDetails.family_name,
            picture: userDetails.picture,
            user_role: userDetails["custom:user_role"] as UserRole,
            municipality: userDetails["custom:municipality"],
            company_name: userDetails["custom:company_name"],
            municipality_lnglat: userDetails["custom:municipality_lnglat"],
            session_token: session.tokens?.idToken?.toString(),
        };

        return userProfile;
    };

    const updateUserProfile = async (data: UserData) => {
        if (data) {
            userProfile.current = data;
        }

        await updateUserAttributes({
            userAttributes: {
                given_name: data.given_name,
                family_name: data.family_name,
                picture: data.picture,
            },
        });
    };

    const getMuniLngLat = () => {
        if (userProfile.current?.municipality_lnglat) {
            const lngLat = userProfile.current.municipality_lnglat.split(", ").map((coord) => Number(coord)) as MunicipalityLngLat;
            return lngLat;
        }
        return null;
    };

    return (
        <UserProfileContext.Provider value={{ getUserProfile, updateUserProfile, getMuniLngLat }}>
            {children}
        </UserProfileContext.Provider>
    );
}

export default UserProfileContext;