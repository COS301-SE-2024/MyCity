'use client'

import React from 'react';
import Navbar from '@/components/Navbar/Navbar';
import NotificationComment from '@/components/Notifications/NotificationComment';
import NotificationUpdate from '@/components/Notifications/NotificationUpdate';
import NotificationUpvote from '@/components/Notifications/NotificationUpvote';
import NotificationWatchlist from '@/components/Notifications/NotificationWatchlist';
export default function CreateTicket() {

    return (
        <div>
            <Navbar />
            <main>
                <h1 className="text-4xl font-bold mb-2 mt-2 ml-2">
                    Notifications
                </h1>
                <NotificationComment />
                <NotificationUpdate />
                <NotificationUpvote />
                <NotificationWatchlist />

            </main>

        </div>
    );
}