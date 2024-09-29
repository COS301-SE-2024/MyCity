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
      className={`flex p-4 my-4 dark:bg-gray-700 dark:text-white bg-gray-100 rounded-3xl items-center ${
        reverse ? "sm:flex-row-reverse" : "sm:flex-row"
      } flex-col sm:h-[33vh] md:h-[50vh] lg:h-[55vh] w-3/4 overflow-hidden gap-4`}
    >
      {/* Citizen */}
      <div className="flex flex-col items-center w-full mt-10 mb-4 h-full">
        {/* Image stays fixed */}
        <img
          src={image1}
          width={100}
          height={100}
          alt="How It Works"
          className="w-2/5 mb-4"
        />
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold dark:text-white text-opacity-80 text-center mt-10 mb-4">
          {title1}
        </h1>

        {/* Scrollable paragraph container */}
        <div className="w-full max-h-60 overflow-y-scroll">
          <p className="mb-4 text-lg dark:text-white text-opacity-80">
            {paragraph1a}
          </p>
          <p className="mb-4 text-lg dark:text-white text-opacity-80">
            {paragraph2a}
          </p>
          <p className="text-lg dark:text-white text-opacity-80">
            {paragraph3a}
          </p>
        </div>
      </div>

      {/* Municipalities */}
      <div className="flex flex-col items-center w-full mt-10 mb-4 h-full">
        {/* Image stays fixed */}
        <img
          src={image2}
          width={100}
          height={100}
          alt="How It Works"
          className="w-2/5 mb-4"
        />
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold dark:text-white text-opacity-80 text-center mt-10 mb-4">
          {title2}
        </h1>
        {/* Scrollable paragraph container */}
        <div className="w-full max-h-60 overflow-y-scroll">
          <p className="mb-4 text-lg dark:text-white text-opacity-80">
            {paragraph1b}
          </p>
          <p className="mb-4 text-lg dark:text-white text-opacity-80">
            {paragraph2b}
          </p>
          <p className="text-lg dark:text-white text-opacity-80">
            {paragraph3b}
          </p>
        </div>
      </div>

      {/* Service Providers */}
      <div className="flex flex-col items-center w-full mt-10 mb-4 h-full">
        {/* Image stays fixed */}
        <img
          src={image3}
          width={100}
          height={100}
          alt="How It Works"
          className="w-2/5 mb-4"
        />
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold dark:text-white text-opacity-80 text-center mt-10 mb-4">
          {title3}
        </h1>
        {/* Scrollable paragraph container */}
        <div className="w-full max-h-60 overflow-y-scroll">
          <p className="mb-4 text-lg dark:text-white text-opacity-80">
            {paragraph1c}
          </p>
          <p className="mb-4 text-lg dark:text-white text-opacity-80">
            {paragraph2c}
          </p>
          <p className="text-lg dark:text-white text-opacity-80">
            {paragraph3c}
          </p>
        </div>
      </div>
    </div>
  );
}

function StepItem({
  stepNumber,
  title,
  description,
  reverse,
  image,
}: StepItemProps) {
  return (
    <div
      className={`flex m-4 dark:bg-gray-700 dark:text-white bg-gray-100 p-4  rounded-3xl items-center ${
        reverse ? "sm:flex-row-reverse" : "sm:flex-row"
      } flex-col [33vh] w-3/4`}
    >
      <div className="w-full sm:w-1/4 text-center">
        <img
          src={image}
          width={100}
          height={100}
          alt="Vision"
          className="w-full h-auto object-cover rounded-lg mx-auto"
        />
      </div>
      <div className="w-full sm:w-3/4 mt-4 sm:mt-0 sm:ml-4 text-center sm:text-left overflow-y-auto h-full">
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold dark:text-white text-opacity-80 mb-4">
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
        <Navbar showLogin={true} />

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

        <main className="relative z-0 p-8 mt-0">
          {/* Page Title */}
          <div className="text-white font-bold text-center transform hover:scale-105 transition-transform duration-200">
            <img
              src="https://mycity-storage-bucket.s3.eu-west-1.amazonaws.com/resources/MyCity-Logo-256.webp"
              alt="MyCity"
              width={256}
              height={256}
              className="mx-auto"
            />
            <h1 className="text-4xl font-bold text-white text-opacity-80 mb-8">
              How it Works
            </h1>
          </div>

          {/* Who Can Use MyCity Section */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-white text-opacity-80 text-center mb-8">
              Who Can Use MyCity?
            </h2>
            <div className="grid grid-cols-3 gap-12 text-center">
              {/* Citizens */}
              <div>
                <img
                  src="https://mycity-storage-bucket.s3.eu-west-1.amazonaws.com/resources/guide_1.webp"
                  alt="Citizens"
                  width={100}
                  height={100}
                  className="w-3/4 mx-auto mb-4 rounded-lg"
                />
                <h3 className="text-xl font-bold text-white text-opacity-80">
                  Citizens
                </h3>
                <p className="text-white text-opacity-80">
                  Report issues like potholes or streetlight outages.
                </p>
              </div>

              {/* Municipalities */}
              <div>
                <img
                  src="https://mycity-storage-bucket.s3.eu-west-1.amazonaws.com/resources/guide_2.webp"
                  alt="Municipalities"
                  width={100}
                  height={100}
                  className="w-3/4 mx-auto mb-4 rounded-lg"
                />
                <h3 className="text-xl font-bold text-white text-opacity-80">
                  Municipalities
                </h3>
                <p className="text-white text-opacity-80">
                  Manage and respond to reported infrastructure issues.
                </p>
              </div>

              {/* Service Providers */}
              <div>
                <img
                  src="https://mycity-storage-bucket.s3.eu-west-1.amazonaws.com/resources/guide_3.webp"
                  alt="Service Providers"
                  width={100}
                  height={100}
                  className="w-3/4 mx-auto mb-4 rounded-lg"
                />
                <h3 className="text-xl font-bold text-white text-opacity-80">
                  Service Providers
                </h3>
                <p className="text-white text-opacity-80">
                  Receive updates on repairs and maintenance tasks.
                </p>
              </div>
            </div>
          </section>

          {/* What Platforms Section */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-white text-opacity-80 text-center mb-8">
              What Platforms Are We Available On?
            </h2>
            <div className="grid grid-cols-3 gap-12 text-center">
              {/* Mobile PWA */}
              <div>
                <img
                  src="https://mycity-storage-bucket.s3.eu-west-1.amazonaws.com/resources/guide_4.webp"
                  alt="Mobile PWA"
                  width={100}
                  height={100}
                  className="w-3/4 mx-auto mb-4 rounded-lg"
                />
                <h3 className="text-xl font-bold text-white text-opacity-80">
                  Mobile PWA
                </h3>
                <p className="text-white text-opacity-80">
                  Available on Android and iOS as a Progressive Web App.
                </p>
              </div>

              {/* Web Browsers */}
              <div>
                <img
                  src="https://mycity-storage-bucket.s3.eu-west-1.amazonaws.com/resources/guide_5.webp"
                  alt="Web Browsers"
                  width={100}
                  height={100}
                  className="w-3/4 mx-auto mb-4 rounded-lg"
                />
                <h3 className="text-xl font-bold text-white text-opacity-80">
                  Web Browsers
                </h3>
                <p className="text-white text-opacity-80">
                  Access through any modern web browser on desktop or mobile.
                </p>
              </div>

              {/* Windows PWA */}
              <div>
                <img
                  src="https://mycity-storage-bucket.s3.eu-west-1.amazonaws.com/resources/guide_6.webp"
                  alt="Windows PWA"
                  width={100}
                  height={100}
                  className="w-3/4 mx-auto mb-4 rounded-lg"
                />
                <h3 className="text-xl font-bold text-white text-opacity-80">
                  Windows PWA
                </h3>
                <p className="text-white text-opacity-80">
                  Installable on Windows desktops with offline access and
                  notifications.
                </p>
              </div>
            </div>
          </section>

          {/* Your Next Steps Section */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-white text-opacity-80 text-center mb-8">
              How to Get Started
            </h2>
            <div className="flex flex-col items-center space-y-12">
              {/* Step 1 */}
              <div className="flex flex-col items-center text-center">
                <img
                  src="https://mycity-storage-bucket.s3.eu-west-1.amazonaws.com/resources/step_1.webp"
                  alt="Step 1"
                  width={100}
                  height={100}
                  className="w-1/3 mb-4 rounded-lg"
                />
                <h3 className="text-xl font-bold text-white text-opacity-80">
                  Step 1: Create an Account
                </h3>
                <p className="text-white text-opacity-80">
                  Sign up to report issues and track progress.
                </p>
              </div>

              {/* Step 2 */}
              <div className="flex flex-col items-center text-center">
                <img
                  src="https://mycity-storage-bucket.s3.eu-west-1.amazonaws.com/resources/step_2.webp"
                  alt="Step 2"
                  width={100}
                  height={100}
                  className="w-1/3 mb-4 rounded-lg"
                />
                <h3 className="text-xl font-bold text-white text-opacity-80">
                  Step 2: Report an Issue
                </h3>
                <p className="text-white text-opacity-80">
                  Report municipal issues with details and images.
                </p>
              </div>

              {/* Step 3 */}
              <div className="flex flex-col items-center text-center">
                <img
                  src="https://mycity-storage-bucket.s3.eu-west-1.amazonaws.com/resources/step_3.webp"
                  alt="Step 3"
                  width={100}
                  height={100}
                  className="w-1/3 mb-4 rounded-lg"
                />
                <h3 className="text-xl font-bold text-white text-opacity-80">
                  Step 3: Track Progress
                </h3>
                <p className="text-white text-opacity-80">
                  Monitor status updates on your reported issues.
                </p>
              </div>

              {/* Step 4 */}
              <div className="flex flex-col items-center text-center">
                <img
                  src="https://mycity-storage-bucket.s3.eu-west-1.amazonaws.com/resources/step_4.webp"
                  alt="Step 4"
                  width={100}
                  height={100}
                  className="w-1/3 mb-4 rounded-lg"
                />
                <h3 className="text-xl font-bold text-white text-opacity-80">
                  Step 4: View Statistics
                </h3>
                <p className="text-white text-opacity-80">
                  Explore detailed statistics on reported issues.
                </p>
              </div>

              {/* Step 5 */}
              <div className="flex flex-col items-center text-center">
                <img
                  src="https://mycity-storage-bucket.s3.eu-west-1.amazonaws.com/resources/step_5.webp"
                  alt="Step 5"
                  width={100}
                  height={100}
                  className="w-1/3 mb-4 rounded-lg"
                />
                <h3 className="text-xl font-bold text-white text-opacity-80">
                  Step 5: Celebrate
                </h3>
                <p className="text-white text-opacity-80">
                  Celebrate successful resolutions and share positive
                  experiences.
                </p>
              </div>
            </div>
          </section>
        </main>
      </div>

      <div className="block sm:hidden">
        <Navbar />
        {/* Mobile View */}
        <div className="block sm:hidden">
          <Navbar showLogin={true} />

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
              zIndex: -11,
            }}
          ></div>

          <main className="relative z-[-10] p-4 mt-0 pb-16">
            {/* Page Title */}
            <div className="text-white text-opacity-80 font-bold transform hover:scale-105 transition-transform duration-200 flex justify-center">
              <img
                src="https://mycity-storage-bucket.s3.eu-west-1.amazonaws.com/resources/MyCity-Logo-256.webp"
                alt="MyCity"
                width={256}
                height={256}
              />
            </div>
            <h1 className="text-3xl font-bold text-white text-opacity-80 mb-6 text-center">
              How it Works
            </h1>

            {/* Who Can Use MyCity Section */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-white text-opacity-80 text-center mb-4">
                Who Can Use MyCity?
              </h2>
              <div className="flex flex-col items-center text-center">
                {/* Citizens */}
                <div className="mb-6">
                  <img
                    src="https://mycity-storage-bucket.s3.eu-west-1.amazonaws.com/resources/guide_1.webp"
                    alt="Citizens"
                    width={100}
                    height={100}
                    className="w-1/2 mx-auto mb-2 rounded-lg"
                  />
                  <h3 className="text-lg font-bold text-white text-opacity-80">
                    Citizens
                  </h3>
                  <p className="text-white text-opacity-80 text-sm">
                    Citizens can report issues like potholes or streetlight
                    outages.
                  </p>
                </div>

                {/* Municipalities */}
                <div className="mb-6">
                  <img
                    src="https://mycity-storage-bucket.s3.eu-west-1.amazonaws.com/resources/guide_2.webp"
                    alt="Municipalities"
                    width={100}
                    height={100}
                    className="w-1/2 mx-auto mb-2 rounded-lg"
                  />
                  <h3 className="text-lg font-bold text-white text-opacity-80">
                    Municipalities
                  </h3>
                  <p className="text-white text-opacity-80 text-sm">
                    Municipalities can manage and respond to reported
                    infrastructure issues.
                  </p>
                </div>

                {/* Service Providers */}
                <div className="mb-6">
                  <img
                    src="https://mycity-storage-bucket.s3.eu-west-1.amazonaws.com/resources/guide_3.webp"
                    alt="Service Providers"
                    width={100}
                    height={100}
                    className="w-1/2 mx-auto mb-2 rounded-lg"
                  />
                  <h3 className="text-lg font-bold text-white text-opacity-80">
                    Service Providers
                  </h3>
                  <p className="text-white text-opacity-80 text-sm">
                    Service providers receive notifications and updates on
                    required repairs.
                  </p>
                </div>
              </div>
            </section>

            {/* What Platforms Section */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-white text-opacity-80 text-center mb-4">
                What Platforms Are We Available On?
              </h2>
              <div className="flex flex-col items-center text-center">
                {/* Mobile PWA */}
                <div className="mb-6">
                  <img
                    src="https://mycity-storage-bucket.s3.eu-west-1.amazonaws.com/resources/guide_4.webp"
                    alt="Mobile PWA"
                    width={100}
                    height={100}
                    className="w-1/2 mx-auto mb-2 rounded-lg"
                  />
                  <h3 className="text-lg font-bold text-white text-opacity-80">
                    Mobile PWA
                  </h3>
                  <p className="text-white text-opacity-80 text-sm">
                    MyCity is available on Android and iOS as a Progressive Web
                    App.
                  </p>
                </div>

                {/* Web Browsers */}
                <div className="mb-6">
                  <img
                    src="https://mycity-storage-bucket.s3.eu-west-1.amazonaws.com/resources/guide_5.webp"
                    alt="Web Browsers"
                    width={100}
                    height={100}
                    className="w-1/2 mx-auto mb-2 rounded-lg"
                  />
                  <h3 className="text-lg font-bold text-white text-opacity-80">
                    Web Browsers
                  </h3>
                  <p className="text-white text-opacity-80 text-sm">
                    Access MyCity through any modern web browser on both desktop
                    and mobile.
                  </p>
                </div>

                {/* Windows PWA */}
                <div className="mb-6">
                  <img
                    src="https://mycity-storage-bucket.s3.eu-west-1.amazonaws.com/resources/guide_6.webp"
                    alt="Windows PWA"
                    width={100}
                    height={100}
                    className="w-1/2 mx-auto mb-2 rounded-lg"
                  />
                  <h3 className="text-lg font-bold text-white text-opacity-80">
                    Windows PWA
                  </h3>
                  <p className="text-white text-opacity-80 text-sm">
                    Install MyCity as a PWA on Windows desktops for offline
                    access and notifications.
                  </p>
                </div>
              </div>
            </section>

            {/* Next Steps Section */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-white text-opacity-80 text-center mb-4">
                Your Next Steps
              </h2>

              {/* Step 1 */}
              <div className="mb-6">
                <img
                  src="https://mycity-storage-bucket.s3.eu-west-1.amazonaws.com/resources/step_1.webp"
                  alt="Step 1"
                  width={100}
                  height={100}
                  className="w-1/2 mx-auto mb-2 rounded-lg"
                />
                <h3 className="text-lg font-bold text-white text-opacity-80 text-center">
                  Step 1: Create an Account
                </h3>
                <p className="text-white text-opacity-80 text-sm text-center">
                  Sign up to report issues and track progress with your MyCity
                  account.
                </p>
              </div>

              {/* Step 2 */}
              <div className="mb-6">
                <img
                  src="https://mycity-storage-bucket.s3.eu-west-1.amazonaws.com/resources/step_2.webp"
                  alt="Step 2"
                  width={100}
                  height={100}
                  className="w-1/2 mx-auto mb-2 rounded-lg"
                />
                <h3 className="text-lg font-bold text-white text-opacity-80 text-center">
                  Step 2: Report an Issue
                </h3>
                <p className="text-white text-opacity-80 text-sm text-center">
                  Report municipal issues such as potholes, streetlight outages,
                  or water leaks.
                </p>
              </div>

              {/* Step 3 */}
              <div className="mb-6">
                <img
                  src="https://mycity-storage-bucket.s3.eu-west-1.amazonaws.com/resources/step_3.webp"
                  alt="Step 3"
                  width={100}
                  height={100}
                  className="w-1/2 mx-auto mb-2 rounded-lg"
                />
                <h3 className="text-lg font-bold text-white text-opacity-80 text-center">
                  Step 3: Track Progress
                </h3>
                <p className="text-white text-opacity-80 text-sm text-center">
                  Track your issue in real-time and stay updated with
                  notifications.
                </p>
              </div>

              {/* Step 4 */}
              <div className="mb-6">
                <img
                  src="https://mycity-storage-bucket.s3.eu-west-1.amazonaws.com/resources/step_4.webp"
                  alt="Step 4"
                  width={100}
                  height={100}
                  className="w-1/2 mx-auto mb-2 rounded-lg"
                />
                <h3 className="text-lg font-bold text-white text-opacity-80 text-center">
                  Step 4: View Statistics
                </h3>
                <p className="text-white text-opacity-80 text-sm text-center">
                  Explore detailed statistics on reported issues in your area.
                </p>
              </div>

              {/* Step 5 */}
              <div className="mb-6">
                <img
                  src="https://mycity-storage-bucket.s3.eu-west-1.amazonaws.com/resources/step_5.webp"
                  alt="Step 5"
                  width={100}
                  height={100}
                  className="w-1/2 mx-auto mb-2 rounded-lg"
                />
                <h3 className="text-lg font-bold text-white text-opacity-80 text-center">
                  Step 5: Celebrate
                </h3>
                <p className="text-white text-opacity-80 text-sm text-center">
                  Celebrate successful resolutions and share positive
                  experiences.
                </p>
              </div>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}

// Mobile View Component
