'use client'

import { UserData, UserRole } from '@/types/user.types';
import { fetchUserAttributes, getCurrentUser } from 'aws-amplify/auth';
import { MutableRefObject, ReactNode, createContext, useContext, useRef } from 'react';


export interface UserProfileContextProps {
    getUserProfile: () => Promise<MutableRefObject<UserData | null>>;
    updateUserProfile: (data:UserData) => void;
}


const UserProfileContext = createContext<UserProfileContextProps | undefined>(undefined);


export const UserProfileProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
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


        return userProfile;
    };


    const updateUserProfile = async (data:UserData) => {
      if(data){
        userProfile.current = data;
      }
    };



    return (
        <UserProfileContext.Provider value={{ getUserProfile, updateUserProfile }}>
            {children}
        </UserProfileContext.Provider>
    );
}

export const useProfile = (): UserProfileContextProps => {
    const context = useContext(UserProfileContext);
    if (!context) {
        throw new Error("useProfile must be used within a UserProfileProvider");
    }
    return context;
};