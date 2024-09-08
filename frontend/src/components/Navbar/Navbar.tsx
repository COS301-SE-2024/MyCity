'use client';

import React, { useEffect, useState } from "react";
import NavbarUser from "./NavbarUser";
import NavbarGuest from "./NavbarGuest";
import { authenticateClient } from "@/services/auth.service";

export default function Navbar({showLogin = false}) {
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
            {isAuthenticated && <NavbarUser />}
            {!isAuthenticated && <NavbarGuest showLogin={showLogin} />}
        </React.Fragment>
    );
}
