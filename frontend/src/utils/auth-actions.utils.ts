"use server"

import { USER_PATH_SUFFIX_COOKIE_NAME, UserRole } from "@/types/custom.types";
import { cookies } from "next/headers";

export const setUserPathSuffix = async (userRole: UserRole) => {
    let suffix = "";

    if (userRole == UserRole.CITIZEN) {
        suffix = "citizen";
    }
    else if (userRole == UserRole.MUNICIPALITY) {
        suffix = "municipality";
    }
    else if (userRole == UserRole.PRIVATE_COMPANY) {
        suffix = "service-provider";
    }
    else {
        return;
    }

    cookies().set(USER_PATH_SUFFIX_COOKIE_NAME, suffix, { maxAge: 2592000, secure: true, sameSite: "lax" }); //30 days

    //wait for cookie to be set before continuing
    const cookieWaitMaxTries = 30; // which is ~ 3seconds
    let count = 0;
    return new Promise((resolve) => {
        const interval = setInterval(() => {
            if (count < cookieWaitMaxTries) {
                if (cookies().get(USER_PATH_SUFFIX_COOKIE_NAME)) {
                    clearInterval(interval);
                    resolve(undefined);
                }
                count++;
            }
        }, 100); // check every 100ms for the cookie
    });
};

export const removeUserPathSuffix = async () => {
    cookies().delete(USER_PATH_SUFFIX_COOKIE_NAME);
};