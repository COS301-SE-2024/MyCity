'use client'

import { UserData, UserRole } from '@/types/custom.types';
import { fetchUserAttributes, updateUserAttributes } from 'aws-amplify/auth';
import { MutableRefObject, ReactNode, createContext, useRef } from 'react';


export interface UserProfileContextProps {
    getUserProfile: () => Promise<MutableRefObject<UserData | null>>;
    updateUserProfile: (data: UserData) => void;
}


const UserProfileContext = createContext<UserProfileContextProps | undefined>(undefined);


export function UserProfileProvider({ children }: { children: ReactNode }) {
    const userProfile = useRef<UserData | null>(null);

    const getUserProfile = async () => {
        //if user profile data already cached, return it
        if (userProfile.current) {
            return userProfile;
        }

        //otherwise get current user profile details
        const userDetails = await fetchUserAttributes();

        userProfile.current = {
            sub: userDetails.sub,
            email: userDetails.email,
            given_name: userDetails.given_name,
            family_name: userDetails.family_name,
            picture: userDetails.picture,
            user_role: userDetails["custom:user_role"] as UserRole,
            municipality: userDetails["custom:municipality"]
        };

        //for the picture, prefer what is in local storage (just for demo 2)
        const pic = localStorage.getItem("profileImage");

        if (pic) {
            userProfile.current.picture = pic;
        }


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
            },
        });
    };



    return (
        <UserProfileContext.Provider value={{ getUserProfile, updateUserProfile }}>
            {children}
        </UserProfileContext.Provider>
    );
}

export default UserProfileContext;