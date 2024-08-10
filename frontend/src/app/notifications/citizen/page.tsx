"use client";

import NavbarUser from "@/components/Navbar/NavbarUser";

// import { notificationStates } from "@/components/NotificationsCitizen/states";
// import NotificationsStatusCardContainer from "@/components/NotificationsStatusCardContainer/NotificationsStatusCardContainer";
import React, { Key, useEffect, useRef, useState } from "react";
// import { Tabs, Tab } from "@nextui-org/react";
// import FaultTable from "@/components/FaultTable/FaultTable";
// import FaultMapView from "@/components/FaultMapView/FaultMapView";
// import { FaTimes } from "react-icons/fa";
// import { HelpCircle } from "lucide-react";
import TicketNoti from "@/components/NotificationsCitizenNew/TicketNoti";
import DashboardStatusCardContainer from "@/components/StatusCardContainer/DashboardStatusCardContainer";
import { useProfile } from "@/hooks/useProfile";

import {
  getTicket,
  getTicketsInMunicipality,
  getMostUpvote,
  getWatchlistTickets,
} from "@/services/tickets.service";

interface ScrollablePanelProps {
  title: string;
  children: React.ReactNode;
}

const ScrollablePanel: React.FC<ScrollablePanelProps> = ({
  title,
  children,
}) => (
  <div className="flex bg-white flex-col rounded-lg border-t-0 border shadow-lg shadow-blue-800/15 h-[80vh] m-4 overflow-auto">
    <div className="flex justify-center border p-4">
      <h1 className="text-2xl font-bold">{title}</h1>
    </div>
    <div className="overflow-y-auto h-full overflow-auto">{children}</div>
  </div>
);

export default function Notifications() {
  const user = useRef(null);
  const userProfile = useProfile();
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [dashMostUpvoteResults, setMostUpvoteResults] = useState<any[]>([]);
  const [dashMuniResults, setDashMuniResults] = useState<any[]>([]);
  const [dashWatchResults, setDashWatchResults] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      // try {
      const user_data = await userProfile.getUserProfile();
      const user_id = user_data.current?.email;
      const user_session = String(user_data.current?.session_token);
      // console.log(user_session);
      const rspmostupvotes = await getMostUpvote(user_session);
      const rspwatchlist = await getWatchlistTickets(
        String(user_id),
        user_session
      );
      const municipality = user_data.current?.municipality;
      const rspmunicipality = await getTicketsInMunicipality(
        municipality,
        user_session
      );
      // console.log(rspmostupvotes)
      // const flattenedWatchlist = rspwatchlist.flat();
      console.log(rspwatchlist);
      setMostUpvoteResults(rspmostupvotes);
      setDashMuniResults(Array.isArray(rspmunicipality) ? rspmunicipality : []);
      if (rspwatchlist.length > 0) {
        setDashWatchResults(rspwatchlist);
        console.log(dashWatchResults);
      } else setDashWatchResults([]);
      // console.log( dashMostUpvoteResults)
      // }
      // catch (error) {
      //   console.error("Error fetching data:", error);
      // }
    };

    fetchData();
  }, [userProfile]); // Add userProfile to the dependency array

  const hasStatusFieldMuni =
    Array.isArray(dashMuniResults) &&
    dashMuniResults.some((item) => item.Status !== undefined);
  const hasStatusFieldWatch =
    Array.isArray(dashWatchResults) &&
    dashWatchResults.some((item) => item.Status !== undefined);

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
          <NavbarUser />

          {/* Background image */}
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundImage:
                'linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url("https://www.andbeyond.com/wp-content/uploads/sites/5/Johannesburg-Skyline.jpg")',
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              zIndex: -1,
            }}
          />

          {/* Content */}
          <div className="fixed inset-0 overflow-hidden">
            <main>
              <h1 className="text-4xl font-bold mb-2 mt-2 ml-2 text-white text-opacity-80">
                Notifications
              </h1>

              <TicketNoti
                ticketNumber="328"
                image={null} // Or replace with an actual image URL
                action="upvoted"
                isNew={true}
              />
              <TicketNoti
                ticketNumber="329"
                image={null} // Or replace with an actual image URL
                action="commented on"
                isNew={false}
              />
              <TicketNoti
                ticketNumber="330"
                image={null} // Or replace with an actual image URL
                action="watchlisted"
                isNew={true}
              />
              <TicketNoti
                ticketNumber="331"
                image={null} // Or replace with an actual image URL
                action="updated"
                isNew={false}
              />
              {/* Your Ticket Interactions */}

              {/* Your Ticket Updates */}
              {/* <ScrollablePanel title="Your Ticket Updates"> */}
              {/* <NotificationUpdate state="AssigningContract" />
                <NotificationUpdate state="Closed" />
                <NotificationUpdate state="InProgress" />
                <NotificationUpdate state="Closed" />
                <NotificationUpdate state="AssigningContract" />
                <NotificationUpdate state="Opened" />
                <NotificationUpdate state="TakingTenders" /> */}
              {/* </ScrollablePanel> */}
              {/* Your Watchlist */}
              {/* <ScrollablePanel title="Your Watchlist"> */}
              {/* <NotificationUpdate state="InProgress" /> */}
              {/* <NotificationUpvote /> */}
              {/* <NotificationComment /> */}
              {/* <NotificationUpdate state="AssigningContract" /> */}
              {/* <NotificationComment /> */}
              {/* <NotificationUpdate state="InProgress" /> */}
              {/* <NotificationUpdate state="Closed" /> */}
              {/* <NotificationComment /> */}
              {/* <NotificationUpdate state="Opened" /> */}
              {/* </ScrollablePanel> */}
            </main>
          </div>
        </div>
      </div>

      {/* Mobile View */}
      <div className="block sm:hidden">
        <div
          style={{
            position: "relative",
            height: "100vh",
            overflow: "hidden",
          }}
        >
          <div className="text-white font-bold ms-2 transform hover:scale-105 mt-5 ml-5 transition-transform duration-200">
            <img
              src="https://i.imgur.com/WbMLivx.png"
              alt="MyCity"
              width={100}
              height={100}
              className="w-100 h-100"
            />
          </div>

          {/* Background image */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundImage:
                'linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url("https://www.andbeyond.com/wp-content/uploads/sites/5/Johannesburg-Skyline.jpg")',
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              zIndex: -1,
            }}
          />

          {/* Content */}
          <div className="h-[5vh] flex items-center justify-center"></div>
          <div className="container mx-auto relative z-10">
            <h1 className="text-4xl text-white font-bold mb-4 ml-4">
              <span className="text-blue-200">MyCity</span> <br />
              Under Construction
            </h1>
            <div className="text-white font-bold transform hover:scale-105 transition-transform duration-200 flex justify-center">
              <img
                src="https://i.imgur.com/eGeTTuo.png"
                alt="Under-Construction"
                width={300}
                height={300}
              />
            </div>
            <p className="text-lg text-gray-200 mb-4 ml-4">
              Our Mobile site is currently under construction.
              <br />
              Please use our Desktop site while we
              <br />
              work on it.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
