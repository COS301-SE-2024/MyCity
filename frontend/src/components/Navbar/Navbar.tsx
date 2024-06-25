'use client'

import { authenticateClient } from "@/lib/cognitoActions";
import React, { useEffect, useState } from "react";
import NavbarUser from "./NavbarUser";
import NavbarGuest from "./NavbarGuest";



export default function Navbar() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {

        const checkIfUserIsAuthenticated = async () => {
            const response = await authenticateClient();
            setIsAuthenticated(response);
        };

        checkIfUserIsAuthenticated();
    }, []);

    return (
        <React.Fragment>
            {isAuthenticated && (
                <NavbarUser />
            )}

            {!isAuthenticated && (
                <NavbarGuest />
            )}
        </React.Fragment>
    );
    
}