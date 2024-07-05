import UserProfileContext, { UserProfileContextProps } from '@/context/UserProfileContext';
import { useContext } from 'react';

export const useProfile = (): UserProfileContextProps => {
    const context = useContext(UserProfileContext);
    if (!context) {
        throw new Error("useProfile must be used within a UserProfileProvider");
    }
    
    return context;
};