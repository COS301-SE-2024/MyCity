"use client";

import Navbar from "@/components/Navbar/Navbar";
import React from "react";

interface HowItWorksItemProps {
  image1: string;
  image2: string;
  image3: string;
  title1: string;
  title2: string;
  title3: string;
  paragraph1a: string;
  paragraph2a: string;
  paragraph3a: string;
  paragraph1b: string;
  paragraph2b: string;
  paragraph3b: string;
  paragraph1c: string;
  paragraph2c: string;
  paragraph3c: string;
  reverse: boolean;
}

interface StepItemProps {
  stepNumber: string;
  title: string;
  description: string;
  reverse: boolean;
  image: string;
}

function HowItWorksItem({
  image1,
  image2,
  image3,
  title1,
  title2,
  title3,
  paragraph1a,
  paragraph2a,
  paragraph3a,
  paragraph1b,
  paragraph2b,
  paragraph3b,
  paragraph1c,
  paragraph2c,
  paragraph3c,
  reverse,
}: HowItWorksItemProps) {
  return (
    <div
      className={`flex p-4 my-4 bg-gray-700  text-white rounded-3xl items-center ${
        reverse ? "sm:flex-row-reverse" : "sm:flex-row"
      } flex-col sm:h-[33vh] md:h-[50vh] lg:h-[55vh] w-3/4 overflow-hidden gap-4`}
    >
      {/* Citizen */}
      <div className="flex flex-col items-center w-full mt-10 mb-4 h-full">
        {/* Image stays fixed */}
        <img src={image1} alt="How It Works" className="w-2/5 mb-4" />
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white text-opacity-80 text-center mt-10 mb-4">
          {title1}
        </h1>

        {/* Scrollable paragraph container */}
        <div className="w-full max-h-60 overflow-y-scroll">
          <p className="mb-4 text-lg text-white text-opacity-80">
            {paragraph1a}
          </p>
          <p className="mb-4 text-lg text-white text-opacity-80">
            {paragraph2a}
          </p>
          <p className="text-lg text-white text-opacity-80">{paragraph3a}</p>
        </div>
      </div>

      {/* Municipalities */}
      <div className="flex flex-col items-center w-full mt-10 mb-4 h-full">
        {/* Image stays fixed */}
        <img src={image2} alt="How It Works" className="w-2/5 mb-4" />
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white text-opacity-80 text-center mt-10 mb-4">
          {title2}
        </h1>
        {/* Scrollable paragraph container */}
        <div className="w-full max-h-60 overflow-y-scroll">
          <p className="mb-4 text-lg text-white text-opacity-80">
            {paragraph1b}
          </p>
          <p className="mb-4 text-lg text-white text-opacity-80">
            {paragraph2b}
          </p>
          <p className="text-lg text-white text-opacity-80">{paragraph3b}</p>
        </div>
      </div>

      {/* Service Providers */}
      <div className="flex flex-col items-center w-full mt-10 mb-4 h-full">
        {/* Image stays fixed */}
        <img src={image3} alt="How It Works" className="w-2/5 mb-4" />
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white text-opacity-80 text-center mt-10 mb-4">
          {title3}
        </h1>
        {/* Scrollable paragraph container */}
        <div className="w-full max-h-60 overflow-y-scroll">
          <p className="mb-4 text-lg text-white text-opacity-80">
            {paragraph1c}
          </p>
          <p className="mb-4 text-lg text-white text-opacity-80">
            {paragraph2c}
          </p>
          <p className="text-lg text-white text-opacity-80">{paragraph3c}</p>
        </div>
      </div>
    </div>
  );
}

function StepItem({ stepNumber, title, description, reverse, image }: StepItemProps) {
  return (
    


      <div
      className={`flex m-4 bg-gray-700 p-4 text-white rounded-3xl items-center ${
        reverse ? "sm:flex-row-reverse" : "sm:flex-row"
      } flex-col [33vh] w-3/4`}
    >
      <div className="w-full sm:w-1/4 text-center">
        <img
          src={image}
          alt="Vision"
          className="w-full h-auto object-cover rounded-lg mx-auto"
        />
      </div>
      <div className="w-full sm:w-3/4 mt-4 sm:mt-0 sm:ml-4 text-center sm:text-left overflow-y-auto h-full">
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white text-opacity-80 mb-4">
        Step {stepNumber}: {title}
        </h2>
        <p className="mb-4 text-sm sm:text-base md:text-md lg:text-lg">
          {description}
        </p>

      </div>
    </div>


  );
}

export default function Guide() {
  return (
    <div>
      {/* Desktop View */}
      <div className="hidden sm:block">
        {/* Navbar - Make sure it's fixed and above all other content */}
        <Navbar showLogin={true}/>
        {/* Background Image */}
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
            backgroundAttachment: "fixed",
            zIndex: -1,
          }}
        ></div>
        <main>
          <div className="relative">
            <h1 className="text-4xl font-bold text-white text-opacity-80 absolute top-13 transform translate-x-1/4">
              How it Works
            </h1>
          </div>
          <div className="flex flex-col h-full mt-20 w-full items-center sm:h-3/4 md:h-full lg:mt-10 overflow-hidden">
            <div className="flex flex-col items-center mt-10 w-full">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white text-opacity-80 text-center mt-10 mb-4">
                Who Can Use MyCity?
              </h1>
              <HowItWorksItem
                image1="https://mycity-storage-bucket.s3.eu-west-1.amazonaws.com/resources/guide_1.webp"
                image2="https://mycity-storage-bucket.s3.eu-west-1.amazonaws.com/resources/guide_2.webp"
                image3="https://mycity-storage-bucket.s3.eu-west-1.amazonaws.com/resources/guide_3.webp"
                title1="Citizens"
                title2="Municipalities"
                title3="Service Providers"
                paragraph1a="Citizens can use MyCity to report municipal issues such as potholes, streetlight outages, water leaks, or other public infrastructure problems."
                paragraph2a="They can easily track the status of their reports in real-time and receive notifications once the issue has been resolved."
                paragraph3a="This helps ensure that citizens are actively involved in improving their city."
                paragraph1b="Municipalities can leverage MyCity to efficiently manage and respond to reported infrastructure issues from citizens."
                paragraph2b="The platform provides a centralized system to prioritize and assign tasks to field workers, ensuring prompt resolution of faults."
                paragraph3b="With MyCity, municipalities can enhance transparency and accountability while improving city management."
                paragraph1c="Service providers, such as contractors and utility companies, can use MyCity to receive direct notifications from municipalities about required repairs or maintenance tasks."
                paragraph2c="They can update the status of their work, ensuring seamless communication with both city officials and citizens."
                paragraph3c="This helps service providers deliver faster and more effective solutions."
                reverse={false}
              />
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white text-opacity-80 text-center mt-10 mb-4">
                What Platforms Are We Available On?
              </h1>
              <HowItWorksItem
                image1="https://mycity-storage-bucket.s3.eu-west-1.amazonaws.com/resources/guide_4.webp"
                image2="https://mycity-storage-bucket.s3.eu-west-1.amazonaws.com/resources/guide_5.webp"
                image3="https://mycity-storage-bucket.s3.eu-west-1.amazonaws.com/resources/guide_6.webp"
                title1="Mobile PWA"
                title2="Web Browsers"
                title3="Windows PWA"
                paragraph1a="MyCity is available as a Progressive Web App (PWA) that can be installed on both Android and iOS devices directly from a mobile browser."
                paragraph2a="The mobile PWA offers powerful features such as push notifications, allowing users to stay updated on the status of their reports."
                paragraph3a="Users can also leverage their device’s camera to capture images of faults and utilize location services to report and navigate to issues using Google Maps integration."
                paragraph1b="You can access MyCity through any modern web browser on both desktop and mobile."
                paragraph2b="The web version offers full functionality, including reporting issues, tracking progress, and engaging with local authorities."
                paragraph3b="Whether you're using Chrome, Safari, Brave, or Edge, MyCity ensures a smooth user experience across platforms."
                paragraph1c="The MyCity app can be installed as a Progressive Web App (PWA) on Windows desktops, offering offline caching and push notifications to keep users informed even when the app is not actively in use."
                paragraph2c="This PWA functions like a native Windows application, allowing seamless access to the full range of features."
                paragraph3c="With the Windows PWA, users can stay connected to the platform without needing to open a browser, receiving real-time updates on municipal issues."
                reverse={false}
              />

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white text-opacity-80 text-center mt-10 mb-4">
                Your Next Steps
              </h1>
              <StepItem
                stepNumber="1"
                title="Create an Account"
                description="Sign up for a MyCity account using your email address or Google Account. This account will allow you to report issues, track progress, and engage with your local municipality."
                reverse={false}
                image="https://mycity-storage-bucket.s3.eu-west-1.amazonaws.com/resources/step_1.webp"
              />

              <StepItem
                stepNumber="2"
                title="Report an Issue"
                description="Use the MyCity platform to report any municipal issues you encounter, such as potholes, streetlight outages, or water leaks. Include details and images to help authorities understand the problem."
                              reverse={true}
                image="https://mycity-storage-bucket.s3.eu-west-1.amazonaws.com/resources/step_2.webp"
              />

              <StepItem
                stepNumber="3"
                title="Track Progress"
                description="Monitor the status of your reported issues in real-time. Receive notifications when the problem is assigned, in progress, or resolved. Stay informed throughout the process."
                reverse={false}
                image="https://mycity-storage-bucket.s3.eu-west-1.amazonaws.com/resources/step_3.webp"
              />

              <StepItem
                stepNumber="4"
                title="View Statistics"
                description="Explore detailed statistics on reported issues in your area. Understand trends, identify common problems, and track the performance of your local municipality. Use data to advocate for change."
                reverse={true}
                image="https://mycity-storage-bucket.s3.eu-west-1.amazonaws.com/resources/step_4.webp"
              />

              <StepItem
                stepNumber="5"
                title="Celebrate"
                description="Celebrate the successful resolution of reported issues. Share your positive experiences with MyCity and encourage others to participate in improving the community. Together, we can build a better city."
                reverse={false}
                image="https://mycity-storage-bucket.s3.eu-west-1.amazonaws.com/resources/step_5.webp"
              />
            </div>
          </div>
        </main>
      </div>

      {/* Mobile View */}
      <div className="block sm:hidden">
        <Navbar />
        {/* Mobile content here */}
        <MobileView />
      </div>
    </div>
  );
}

// Mobile View Component
function MobileView() {
  return (
    <div
      style={{
        position: "relative",
        height: "100vh",
        overflow: "hidden",
      }}
    >
      {/* Background Image */}
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
        }}
      ></div>

      {/* Mobile Content */}
      <div className="h-[5vh] flex items-center justify-center"></div>
      <div className="container mx-auto relative z-10">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl text-white font-bold mb-4 ml-4">
          <span className="text-blue-200">MyCity</span> <br />
          Under Construction
        </h1>
        <div className="text-white font-bold flex justify-center">
          <img
            src="https://i.imgur.com/eGeTTuo.png"
            alt="Under Construction"
            className="w-full h-auto"
          />
        </div>
        <p className="text-lg text-gray-200 mb-4 ml-4">
          Our Mobile site is currently under construction. Please use our
          Desktop site while we work on it.
        </p>
      </div>
    </div>
  );
}
