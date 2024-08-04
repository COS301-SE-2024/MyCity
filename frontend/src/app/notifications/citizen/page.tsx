import React from "react";
import Navbar from "@/components/Navbar/Navbar";
import NotificationComment from "@/components/NotificationsCitizen/NotificationComment";
import NotificationUpdate from "@/components/NotificationsCitizen/NotificationUpdate";
import NotificationUpvote from "@/components/NotificationsCitizen/NotificationUpvote";
import NotificationWatchlist from "@/components/NotificationsCitizen/NotificationWatchlist";
import NotificationPromt from "@/components/Notifications/NotificationPromt";
import { notificationStates } from "@/components/NotificationsCitizen/states";

const ScrollablePanel: React.FC<ScrollablePanelProps> = ({
  title,
  children,
}) => (
  <div className="flex bg-white flex-col rounded-lg border-t-0 border shadow-lg shadow-blue-800/15 w-[32em] h-[80vh] m-4 overflow-auto">
    <div className="flex justify-center border p-4">
      <h1 className="text-2xl font-bold">{title}</h1>
    </div>
    <div className="overflow-y-auto h-full overflow-auto">{children}</div>
  </div>
);

export default function Notifications() {
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
          <Navbar />

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
            <main className="h-full flex items-center justify-center pb-16 overflow-auto">
              {/* Your Ticket Interactions */}
              <ScrollablePanel title="Your Ticket Interactions">
                <NotificationComment />
                <NotificationUpvote />
                <NotificationComment />
                <NotificationComment />          
                <NotificationUpvote />
                <NotificationComment />
                <NotificationUpvote />
                <NotificationComment />
              </ScrollablePanel>
              {/* Your Ticket Updates */}
              <ScrollablePanel title="Your Ticket Updates">
                <NotificationUpdate state="AssigningContract" />
                <NotificationUpdate state="Closed" />
                <NotificationUpdate state="InProgress" />
                <NotificationUpdate state="Closed" />
                <NotificationUpdate state="AssigningContract" />
                <NotificationUpdate state="Opened" />
                <NotificationUpdate state="TakingTenders" />
              </ScrollablePanel>
              {/* Your Watchlist */}
              <ScrollablePanel title="Your Watchlist">
                <NotificationUpdate state="InProgress" />
                <NotificationUpvote />
                <NotificationComment />
                <NotificationUpdate state="AssigningContract" />
                <NotificationComment />
                <NotificationUpdate state="InProgress" />
                <NotificationUpdate state="Closed" />
                <NotificationComment />
                <NotificationUpdate state="Opened" />
              </ScrollablePanel>
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
