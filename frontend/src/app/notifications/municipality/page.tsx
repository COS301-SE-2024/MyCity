"use client";

import React, { useState, useEffect } from "react";
import NavbarMunicipality from "@/components/Navbar/NavbarMunicipality";
import NavbarMobile from "@/components/Navbar/NavbarMobile";
import { ThreeDots } from "react-loader-spinner"; 
import TicketNoti from "@/components/NotificationsMuniNew/TicketNoti";
import Alert from "@/components/NotificationsMuniNew/Alert";
import TenderNoti from "@/components/NotificationsMuniNew/TenderNoti";

export default function Notifications() {
  // State for loading and visible notifications
  const [isLoading, setIsLoading] = useState(true);
  const [visibleNotifications, setVisibleNotifications] = useState<any[]>([]);

  const notifications = [
    {
      ticketNumber: "12345",
      image: "",
      action: "upvoted",
      isNew: true,
    },
    {
      ticketNumber: "12346",
      image: "",
      action: "commented on",
      isNew: false,
    },
    {
      ticketNumber: "12347",
      image: "",
      action: "watchlisted",
      isNew: true,
    },
    {
      ticketNumber: "12348",
      image: "",
      action: "updated status to:",
      isNew: false,
    },
  ];
  
  const alerts = [
    {
      message: "this ticket has 25 upvotes.",
      ticketId: "TCKT-001",
      isNew: true,
      ticketNumber: "328",
    },
  ];

  const unreadNotifications = 99;

  // Simulate loading delay (e.g., fetching notifications from an API)
  useEffect(() => {
    setTimeout(() => {
      setVisibleNotifications(notifications);
      setIsLoading(false);
    }, 1500); // Simulate a 1.5s delay before loading the notifications
  }, []);

  return (
    <div>
      {/* Desktop View */}
      <div className="hidden sm:block">
        <div
          style={{
            position: "relative",
            height: "100vh",
            overflow: "hidden",
          }}
        >
          <NavbarMunicipality unreadNotifications={unreadNotifications} />

          {/* Background image */}
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundImage:
                'linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url("https://mycity-storage-bucket.s3.eu-west-1.amazonaws.com/resources/Johannesburg-Skyline.webp")',
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              zIndex: -1,
            }}
          />

          {/* Content */}
          <div className="fixed inset-0 overflow-y-auto">
            <main>
              <div className="relative pt-8">
                <h1 className="text-4xl font-bold text-white text-opacity-80 absolute top-13 transform translate-x-1/4">
                  Notifications
                </h1>
              </div>
              <div className="pt-20 px-6 rounded-3xl">
                {isLoading ? (
                  <div className="flex justify-center items-center h-64">
                    <ThreeDots
                      height="80"
                      width="80"
                      radius="9"
                      color="#ADD8E6"
                      ariaLabel="three-dots-loading"
                      visible={true}
                    />
                  </div>
                ) : (
                  <>
                    {visibleNotifications.map((notification, index) => (
                      <TicketNoti
                        key={index}
                        ticketNumber={notification.ticketNumber}
                        image={notification.image}
                        action={notification.action}
                        isNew={notification.isNew}
                      />
                    ))}

                    <TenderNoti
                      tenderId="TND-001"
                      image=""
                      action="bid received"
                      isNew={true}
                    />
                    <TenderNoti
                      tenderId="TND-002"
                      image=""
                      action="completion report received"
                      isNew={true}
                    />
                    <Alert alerts={alerts} />
                  </>
                )}
              </div>
            </main>
          </div>
        </div>
      </div>

      {/* Mobile View */}
      <div className="block sm:hidden">
        <NavbarMunicipality unreadNotifications={unreadNotifications} />
        <div
          style={{
            position: "relative",
            height: "100vh",
            overflow: "hidden",
          }}
        >
          {/* Mobile Navbar */}
          <NavbarMobile />

          {/* Background image */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundImage:
                'linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url("https://mycity-storage-bucket.s3.eu-west-1.amazonaws.com/resources/Johannesburg-Skyline.webp")',
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              zIndex: -1,
            }}
          />

          {/* Content */}
          <div className="fixed inset-0 overflow-y-auto pt-4 pb-20">
            <h1 className="text-3xl font-bold text-white text-opacity-80 text-center mt-2">
              Notifications
            </h1>
            <main>
              {isLoading ? (
                <div className="flex justify-center items-center h-64">
                  <ThreeDots
                    height="80"
                    width="80"
                    radius="9"
                    color="#ADD8E6"
                    ariaLabel="three-dots-loading"
                    visible={true}
                  />
                </div>
              ) : (
                <div className="px-2 mt-2">
                  {visibleNotifications.map((notification, index) => (
                    <TicketNoti
                      key={index}
                      ticketNumber={notification.ticketNumber}
                      image={notification.image}
                      action={notification.action}
                      isNew={notification.isNew}
                    />
                  ))}
                  <TenderNoti
                    tenderId="TND-001"
                    image=""
                    action="bid received"
                    isNew={true}
                  />
                  <TenderNoti
                    tenderId="TND-002"
                    image=""
                    action="completion report received"
                    isNew={true}
                  />
                  <Alert alerts={alerts} />
                </div>
              )}
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}
