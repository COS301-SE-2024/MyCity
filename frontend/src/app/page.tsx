"use client";


import Home from "./home/page";
import React from "react";
import { useEffect } from 'react';
 

export default function App() {
    useEffect(() => {
        if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('/service-worker.js')
                    .then((registration) => {
                        console.log('SW registered: ', registration);
                    })
                    .catch((registrationError) => {
                        console.log('SW registration failed: ', registrationError);
                    });
            });
        }
    }, []);
    return (
        <React.Fragment>
            <Home />
        </React.Fragment>
    );
}