"use client";

//import Navbar from "@/components/Navbar/Navbar"; implemented later
import NavbarMunicipality from "@/components/Navbar/NavbarMunicipality";
import TicketNoti from "@/components/NotificationsMuniNew/TicketNoti";
import Alert from "@/components/NotificationsMuniNew/Alert";
import TenderNoti from "@/components/NotificationsMuniNew/TenderNoti";
export default function Notifications() {
  const notifications = [
    {
      ticketNumber: "12345",
      image: "https://via.placeholder.com/150",
      action: "upvoted",
      isNew: true,
    },
    {
      ticketNumber: "12346",
      image: "https://via.placeholder.com/150",
      action: "commented on",
      isNew: false,
    },
    {
      ticketNumber: "12347",
      image: "https://via.placeholder.com/150",
      action: "watchlisted",
      isNew: true,
    },
    {
      ticketNumber: "12348",
      image: "https://via.placeholder.com/150",
      action: "updated status to:",
      isNew: false,
    },
  ];
  const alerts = [
    { message: "this ticket has 25 upvotes.", ticketId: "TCKT-001", isNew: true, ticketNumber: "328" },
  ];
  return (
    <div>
      {/* Desktop View */}
      <div className="hidden sm:block">
        <div>
          <NavbarMunicipality />
          <div
            style={{
              position: "fixed", // Change position to 'fixed'
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundImage:
                'linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url("https://www.andbeyond.com/wp-content/uploads/sites/5/Johannesburg-Skyline.jpg")',
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              backgroundAttachment: "fixed", // Ensures the background is fixed regardless of scrolling
              zIndex: -1, // Ensures the background is behind other content
            }}
          ></div>
          <main>
            <h1 className="text-4xl font-bold mb-2 mt-2 ml-2 text-white text-opacity-80">
              Notifications
            </h1>
            {notifications.map((notification, index) => (
              <TicketNoti
                key={index}
                ticketNumber={notification.ticketNumber}
                image={notification.image}
                action={notification.action}
                isNew={notification.isNew}
              />
            ))}
            {/* Example 1: Bid Accepted */}
            <TenderNoti
              tenderId="TND-001"
              image="https://via.placeholder.com/150"
              action="bid accepted"
              isNew={true}
            />

            {/* Example 2: Bid Rejected */}
            <TenderNoti
              tenderId="TND-002"
              image={null} // No image provided
              action="bid rejected"
              isNew={false}
            />

            {/* Example 3: Contract Terminated */}
            <TenderNoti
              tenderId="TND-003"
              image="https://via.placeholder.com/150"
              action="contract terminated"
              isNew={true}
            />

            {/* Example 4: Contract Completed */}
            <TenderNoti
              tenderId="TND-004"
              image="https://via.placeholder.com/150"
              action="contract completed"
              isNew={false}
            />
            <Alert alerts={alerts} />
          </main>
        </div>
      </div>

      {/* Mobile View */}
      <div className="block sm:hidden">
        <div
          style={{
            position: "relative",
            height: "100vh",
            overflow: "hidden", // Prevents content overflow
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
              zIndex: -1, // Ensures the background is behind other content
            }}
          ></div>

          {/* Content */}
          <div className="h-[5vh] flex items-center justify-center"></div>
          <div className="container mx-auto relative z-10">
            {" "}
            {/* Ensure content is above the background */}
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
