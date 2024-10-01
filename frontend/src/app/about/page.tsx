"use client";

import Navbar from "@/components/Navbar/Navbar";

interface TeamMemberProps {
  name: string;
  title: string;
  bio: string;
  github: string;
  linkedin: string;
  imgSrc: string;
  reverse: boolean;
}

interface VisionItemProps {
  image: string;
  paragraph1: string;
  paragraph2: string;
  paragraph3: string;
  reverse: boolean;
}

interface AssociationLogoProps {
  link: string;
  imgSrc: string;
}

export default function About() {
  return (
    <div>
      {/* Desktop View */}
      <div className="hidden sm:block">
        {/* Navbar - Make sure it's fixed and above all other content */}
        <Navbar showLogin={true} />
        {/* Background Image */}
        <div
          style={{
            position: "fixed", // Keep background fixed
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundImage:
              'linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url("https://mycity-storage-bucket.s3.eu-west-1.amazonaws.com/resources/Johannesburg-Skyline.webp")',
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            backgroundAttachment: "fixed", // This ensures the background stays fixed
            zIndex: -1, // Behind all content
          }}
        ></div>
        <main>
          <div className="relative">
            <h1 className="text-4xl font-bold text-white text-opacity-80 absolute top-13 transform translate-x-1/4">
              About Us
            </h1>
          </div>

          <div className="flex flex-col h-full mt-20 w-full items-center sm:h-3/4 md:h-full lg:mt-10 overflow-hidden">
            {/* Our Vision Section */}
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white text-opacity-80 text-center my-6">
              What is MyCity?
            </h1>
            <div className="flex flex-col md:flex-row items-start md:items-center md:space-x-6 w-full max-w-6xl mb-10">
              {/* Image */}
              <img
                src="https://mycity-storage-bucket.s3.eu-west-1.amazonaws.com/resources/about_1.webp"
                alt="What is MyCity?"
                className="w-full md:w-1/3 max-w-xs rounded-xl mb-4 md:mb-0"
              />

              {/* Description */}
              <div className="text-white text-opacity-80 space-y-4 md:flex md:flex-col md:justify-center md:text-left">
                <p>
                  MyCity is a Progressive Web Application (PWA) that connects
                  citizens, municipalities, and service providers. It simplifies
                  reporting infrastructure issues, such as broken streetlights
                  or potholes, by allowing users to log faults with
                  descriptions, photos, and locations— all from their
                  smartphone.
                </p>
                <p>
                  Reports are immediately sent to relevant departments, and
                  users can track status updates in real-time. Municipalities
                  benefit from streamlined communication and more efficient
                  resource allocation, reducing missed or duplicate reports.
                </p>
              </div>
            </div>

            {/* Real-Time Statistics */}
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white text-opacity-80 text-center my-6">
              Real-Time Statistics and Data Transparency
            </h1>
            <div className="flex flex-col md:flex-row items-start md:items-center md:space-x-6 w-full max-w-6xl mb-10">
              {/* Image */}
              <img
                src="https://mycity-storage-bucket.s3.eu-west-1.amazonaws.com/resources/about_2.webp"
                alt="Statistics and Transparency"
                className="w-full md:w-1/3 max-w-xs rounded-xl mb-4 md:mb-0"
              />
              {/* Description */}
              <div className="text-white text-opacity-80 space-y-4 md:flex md:flex-col md:justify-center md:text-left">
                <p>
                  MyCity provides real-time statistics, giving unprecedented
                  visibility into the efficiency of municipal fault management.
                  Users can see average resolution times for various issues and
                  identify which municipalities are the most efficient,
                  fostering transparency and accountability.
                </p>
                <p>
                  Municipalities benefit by using this data to identify
                  bottlenecks, allocate resources efficiently, and improve
                  service delivery. Third parties can also refine their
                  offerings based on these insights.
                </p>
              </div>
            </div>

            {/* Vision for the Future */}
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white text-opacity-80 text-center my-6">
              Vision for the Future
            </h1>
            <div className="flex flex-col md:flex-row items-start md:items-center md:space-x-6 w-full max-w-6xl mb-10">
              {/* Image */}
              <img
                src="https://mycity-storage-bucket.s3.eu-west-1.amazonaws.com/resources/about_3.webp"
                alt="Vision for the Future"
                className="w-full md:w-1/3 max-w-xs rounded-xl mb-4 md:mb-0"
              />
              {/* Description */}
              <div className="text-white text-opacity-80 space-y-4 md:flex md:flex-col md:justify-center md:text-left">
                <p>
                  We envision MyCity evolving into a comprehensive civic
                  engagement tool, enabling dialogue on public services from
                  waste management to public safety. Our long-term goal is to
                  facilitate predictive analytics to identify potential issues
                  before they arise, reducing both costs and inconveniences
                  associated with emergency repairs.
                </p>
                <p>
                  As the platform evolves, integrating more advanced features
                  will make MyCity indispensable for residents and local
                  governments. We aim to create a sustainable, responsive, and
                  transparent system for managing public infrastructure
                  efficiently and equitably.
                </p>
              </div>
            </div>

            {/* Meet The Team Section */}
            <div className="flex flex-col items-center mb-8">
              {/* Section Heading */}
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white text-opacity-80 text-center mt-10 mb-8">
                Meet The Team
              </h1>

              {/* Dominique */}
              <div className="flex flex-col items-center text-center w-full sm:w-1/2 mb-8">
                <img
                  src="https://mycity-storage-bucket.s3.eu-west-1.amazonaws.com/resources/profile_Dominique_Da_Silva.webp"
                  alt="Dominique Da Silva"
                  className="w-32 h-32 rounded-full mb-3"
                />
                <h3 className="text-lg font-bold text-white">
                  Dominique Da Silva
                </h3>
                <p className="text-white text-sm mb-2">
                  Team Leader | Documentation
                </p>
                <div className="flex gap-4">
                  <a href="https://github.com/Dominique-Da-Silva">
                    <img
                      src="https://mycity-storage-bucket.s3.eu-west-1.amazonaws.com/resources/logo_github.webp"
                      alt="GitHub"
                      className="w-6"
                    />
                  </a>
                  <a href="https://www.linkedin.com/in/DominiqueDaSilva/">
                    <img
                      src="https://mycity-storage-bucket.s3.eu-west-1.amazonaws.com/resources/logo_linkedin.webp"
                      alt="LinkedIn"
                      className="w-6"
                    />
                  </a>
                </div>
              </div>

              {/* Other Team Members - 2 Per Line */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-8 w-full sm:w-3/4">
                {/* Kyle */}
                <div className="flex flex-col items-center text-center">
                  <img
                    src="https://mycity-storage-bucket.s3.eu-west-1.amazonaws.com/resources/profile_Kyle_Marshall.webp"
                    alt="Kyle Marshall"
                    className="w-32 h-32 rounded-full mb-3"
                  />
                  <h3 className="text-lg font-bold text-white">
                    Kyle Marshall
                  </h3>
                  <p className="text-white text-sm mb-2">
                    UI Engineer | Documentation
                  </p>
                  <div className="flex gap-4">
                    <a href="https://github.com/KyleMarshall23">
                      <img
                        src="https://mycity-storage-bucket.s3.eu-west-1.amazonaws.com/resources/logo_github.webp"
                        alt="GitHub"
                        className="w-6"
                      />
                    </a>
                    <a href="https://www.linkedin.com/in/kyle-marshall23/">
                      <img
                        src="https://mycity-storage-bucket.s3.eu-west-1.amazonaws.com/resources/logo_linkedin.webp"
                        alt="LinkedIn"
                        className="w-6"
                      />
                    </a>
                  </div>
                </div>

                {/* Tino */}
                <div className="flex flex-col items-center text-center">
                  <img
                    src="https://mycity-storage-bucket.s3.eu-west-1.amazonaws.com/resources/profile_Tino_Gwanyanya.webp"
                    alt="Tino Gwanyanya"
                    className="w-32 h-32 rounded-full mb-3"
                  />
                  <h3 className="text-lg font-bold text-white">
                    Tino Gwanyanya
                  </h3>
                  <p className="text-white text-sm mb-2">
                    Backend Engineer | Integration Engineer
                  </p>
                  <div className="flex gap-4">
                    <a href="https://github.com/Tinogwanz">
                      <img
                        src="https://mycity-storage-bucket.s3.eu-west-1.amazonaws.com/resources/logo_github.webp"
                        alt="GitHub"
                        className="w-6"
                      />
                    </a>
                    <a href="https://www.linkedin.com/in/anold-tinotenda-gwanyanya/">
                      <img
                        src="https://mycity-storage-bucket.s3.eu-west-1.amazonaws.com/resources/logo_linkedin.webp"
                        alt="LinkedIn"
                        className="w-6"
                      />
                    </a>
                  </div>
                </div>

                {/* Matthew */}
                <div className="flex flex-col items-center text-center">
                  <img
                    src="https://mycity-storage-bucket.s3.eu-west-1.amazonaws.com/resources/profile_Matthew_Els.webp"
                    alt="Matthew Els"
                    className="w-32 h-32 rounded-full mb-3"
                  />
                  <h3 className="text-lg font-bold text-white">Matthew Els</h3>
                  <p className="text-white text-sm mb-2">
                    DevOps Engineer | Front-End Engineer
                  </p>
                  <div className="flex gap-4">
                    <a href="https://github.com/MatthewEls">
                      <img
                        src="https://mycity-storage-bucket.s3.eu-west-1.amazonaws.com/resources/logo_github.webp"
                        alt="GitHub"
                        className="w-6"
                      />
                    </a>
                    <a href="https://www.linkedin.com/in/matthewels/">
                      <img
                        src="https://mycity-storage-bucket.s3.eu-west-1.amazonaws.com/resources/logo_linkedin.webp"
                        alt="LinkedIn"
                        className="w-6"
                      />
                    </a>
                  </div>
                </div>

                {/* Andinda */}
                <div className="flex flex-col items-center text-center">
                  <img
                    src="https://mycity-storage-bucket.s3.eu-west-1.amazonaws.com/resources/profile_Andinda_Bakainaga.webp"
                    alt="Andinda Bakainaga"
                    className="w-32 h-32 rounded-full mb-3"
                  />
                  <h3 className="text-lg font-bold text-white">
                    Andinda Bakainaga
                  </h3>
                  <p className="text-white text-sm mb-2">
                    Backend Engineer | Documentation
                  </p>
                  <div className="flex gap-4">
                    <a href="https://github.com/Dindosss">
                      <img
                        src="https://mycity-storage-bucket.s3.eu-west-1.amazonaws.com/resources/logo_github.webp"
                        alt="GitHub"
                        className="w-6"
                      />
                    </a>
                    <a href="https://www.linkedin.com/in/andinda-bakainaga-b8b011216/">
                      <img
                        src="https://mycity-storage-bucket.s3.eu-west-1.amazonaws.com/resources/logo_linkedin.webp"
                        alt="LinkedIn"
                        className="w-6"
                      />
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Sponsorship Section */}
            <div className="flex flex-col items-center mt-10 w-full">
              {/* Section Heading */}
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white text-opacity-80 text-center my-6">
                Sponsorship
              </h1>

              {/* Sponsorship Details */}
              <div className="flex flex-col md:flex-row items-center md:space-x-6 w-full max-w-6xl mb-10">
                {/* Image & Title */}
                <div className="flex flex-col items-center w-full md:w-1/3 max-w-xs">
                  <a href="https://placekit.io/">
                    <img
                      src="https://mycity-storage-bucket.s3.eu-west-1.amazonaws.com/resources/logo_placekit.webp"
                      alt="PlaceKit Logo"
                      className="w-32 h-32 object-cover rounded-full mb-4"
                    />
                  </a>
                  <a href="https://placekit.io/">
                    <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white text-opacity-80 text-center">
                      Placekit.io
                    </h2>
                  </a>
                </div>

                {/* Description */}
                <div className="text-white text-opacity-80 space-y-4 md:w-2/3 md:flex md:flex-col md:justify-center mt-4 md:mt-0 text-center md:text-left">
                  <p className="mb-4 text-sm sm:text-base md:text-md lg:text-lg">
                    We are incredibly thankful to PlaceKit for their generous
                    sponsorship and unwavering support for the MyCity project.
                    Initially, we were limited by the constraints of a free
                    account with 10,000 requests per month. However, recognizing
                    the potential and the significance of MyCity, PlaceKit
                    generously upgraded us to a plan with 1 million requests per
                    month at no cost. Their willingness to support student
                    initiatives has made a profound difference in the
                    development of our platform.
                  </p>
                  <p className="mb-4 text-sm sm:text-base md:text-md lg:text-lg">
                    In addition to technical support, PlaceKit has gone above
                    and beyond by sponsoring custom shirts for our team to wear
                    on project day. This thoughtful gesture ensures that MyCity
                    stands out and helps us present our project with a unified,
                    professional look. Their commitment to empowering
                    student-led projects like ours has been invaluable, and we
                    are deeply appreciative of their contribution.
                  </p>
                </div>
              </div>
            </div>

            {/* In Association With */}
            <div className="flex flex-col justify-center w-full">
              <div className="text-center">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white text-opacity-80">
                  In Association With
                </h1>
              </div>
              <div className="flex justify-center flex-wrap gap-4">
                <AssociationLogo
                  link="https://www.epiuselabs.com/"
                  imgSrc="https://mycity-storage-bucket.s3.eu-west-1.amazonaws.com/resources/logo_epi-use.webp"
                />
                <AssociationLogo
                  link="https://www.groupelephant.com/"
                  imgSrc="https://mycity-storage-bucket.s3.eu-west-1.amazonaws.com/resources/logo_group-elephant.webp"
                />
              </div>
            </div>
          </div>
        </main>
      </div>

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

  <main className="relative z-[-10] p-4 mt-0 mb-7">
    <div className="text-white text-opacity-80 font-bold transform hover:scale-105 transition-transform duration-200 flex justify-center">
      <img
        src="https://mycity-storage-bucket.s3.eu-west-1.amazonaws.com/resources/MyCity-Logo-256.webp"
        alt="MyCity"
        width={256}
        height={256}
      />
    </div>

    {/* Page Title */}
    <h1 className="text-3xl font-bold text-white text-opacity-80 mb-6 text-center">
      About Us
    </h1>

    {/* What is MyCity Section */}
    <section className="mb-10">
      <h2 className="text-2xl font-bold text-white text-opacity-80 text-center mb-4">
        What is MyCity?
      </h2>
      <img
        src="https://mycity-storage-bucket.s3.eu-west-1.amazonaws.com/resources/about_1.webp"
        width={180}
        height={180}
        alt="MyCity Vision"
        className="w-full h-auto rounded-lg mb-4"
      />
      <p className="text-white text-opacity-80 text-sm mb-4">
        MyCity is a Progressive Web Application (PWA) that seeks to redefine the
        relationship between citizens, municipalities, and service providers by
        creating a centralized platform for reporting and tracking municipal
        faults.
      </p>
      <p className="text-white text-opacity-80 text-sm mb-4">
        The platform simplifies the process of logging issues like broken
        streetlights or potholes, providing real-time tracking of reports. It
        helps municipalities to streamline the process by eliminating duplicate
        reports and making data-driven decisions.
      </p>
    </section>

    {/* Meet The Team Section */}
    <section className="mb-10">
      <h2 className="text-2xl font-bold text-white text-opacity-80 text-center mb-4">
        Meet The Team
      </h2>
      <div className="grid grid-cols-1 gap-6">
        {/* Dominique */}
        <div className="flex flex-col items-center text-center">
          <img
            src="https://mycity-storage-bucket.s3.eu-west-1.amazonaws.com/resources/profile_Dominique_Da_Silva.webp"
            alt="Dominique Da Silva"
            width={130}
            height={130}
            className="w-32 h-32 rounded-full mb-2"
          />
          <h3 className="text-lg font-bold text-white text-opacity-80">
            Dominique Da Silva
          </h3>
          <p className="text-white text-opacity-80 text-sm mb-2">
            Team Leader | Documentation
          </p>
          <div className="flex gap-4">
            <a href="https://github.com/Dominique-Da-Silva">
              <img
                src="https://mycity-storage-bucket.s3.eu-west-1.amazonaws.com/resources/logo_github.webp"
                alt="GitHub"
                width={24}
                height={24}
                className="w-6"
              />
            </a>
            <a href="https://www.linkedin.com/in/DominiqueDaSilva/">
              <img
                src="https://mycity-storage-bucket.s3.eu-west-1.amazonaws.com/resources/logo_linkedin.webp"
                alt="LinkedIn"
                width={24}
                height={24}
                className="w-6"
              />
            </a>
          </div>
        </div>

        {/* Kyle */}
        <div className="flex flex-col items-center text-center">
          <img
            src="https://mycity-storage-bucket.s3.eu-west-1.amazonaws.com/resources/profile_Kyle_Marshall.webp"
            alt="Kyle Marshall"
            width={130}
            height={130}
            className="w-32 h-32 rounded-full mb-2"
          />
          <h3 className="text-lg font-bold text-white text-opacity-80">
            Kyle Marshall
          </h3>
          <p className="text-white text-opacity-80 text-sm mb-2">
            UI Engineer | Documentation
          </p>
          <div className="flex gap-4">
            <a href="https://github.com/KyleMarshall23">
              <img
                src="https://mycity-storage-bucket.s3.eu-west-1.amazonaws.com/resources/logo_github.webp"
                alt="GitHub"
                width={24}
                height={24}
                className="w-6"
              />
            </a>
            <a href="https://www.linkedin.com/in/kyle-marshall23/">
              <img
                src="https://mycity-storage-bucket.s3.eu-west-1.amazonaws.com/resources/logo_linkedin.webp"
                alt="LinkedIn"
                width={24}
                height={24}
                className="w-6"
              />
            </a>
          </div>
        </div>

        {/* Tino */}
        <div className="flex flex-col items-center text-center">
          <img
            src="https://mycity-storage-bucket.s3.eu-west-1.amazonaws.com/resources/profile_Tino_Gwanyanya.webp"
            alt="Tino Gwanyanya"
            width={130}
            height={130}
            className="w-32 h-32 rounded-full mb-2"
          />
          <h3 className="text-lg font-bold text-white text-opacity-80">
            Tino Gwanyanya
          </h3>
          <p className="text-white text-opacity-80 text-sm mb-2">
            Backend Engineer | Integration Engineer
          </p>
          <div className="flex gap-4">
            <a href="https://github.com/Tinogwanz">
              <img
                src="https://mycity-storage-bucket.s3.eu-west-1.amazonaws.com/resources/logo_github.webp"
                alt="GitHub"
                width={24}
                height={24}
                className="w-6"
              />
            </a>
            <a href="https://www.linkedin.com/in/anold-tinotenda-gwanyanya/">
              <img
                src="https://mycity-storage-bucket.s3.eu-west-1.amazonaws.com/resources/logo_linkedin.webp"
                alt="LinkedIn"
                width={24}
                height={24}
                className="w-6"
              />
            </a>
          </div>
        </div>

        {/* Matthew */}
        <div className="flex flex-col items-center text-center">
          <img
            src="https://mycity-storage-bucket.s3.eu-west-1.amazonaws.com/resources/profile_Matthew_Els.webp"
            alt="Matthew Els"
            width={130}
            height={130}
            className="w-32 h-32 rounded-full mb-2"
          />
          <h3 className="text-lg font-bold text-white text-opacity-80">
            Matthew Els
          </h3>
          <p className="text-white text-opacity-80 text-sm mb-2">
            DevOps Engineer | Front-End Engineer | Data Engineer
          </p>
          <div className="flex gap-4">
            <a href="https://github.com/MatthewEls">
              <img
                src="https://mycity-storage-bucket.s3.eu-west-1.amazonaws.com/resources/logo_github.webp"
                alt="GitHub"
                width={24}
                height={24}
                className="w-6"
              />
            </a>
            <a href="https://www.linkedin.com/in/matthewels/">
              <img
                src="https://mycity-storage-bucket.s3.eu-west-1.amazonaws.com/resources/logo_linkedin.webp"
                alt="LinkedIn"
                width={24}
                height={24}
                className="w-6"
              />
            </a>
          </div>
        </div>

        {/* Andinda */}
        <div className="flex flex-col items-center text-center">
          <img
            src="https://mycity-storage-bucket.s3.eu-west-1.amazonaws.com/resources/profile_Andinda_Bakainaga.webp"
            alt="Andinda Bakainaga"
            width={130}
            height={130}
            className="w-32 h-32 rounded-full mb-2"
          />
          <h3 className="text-lg font-bold text-white text-opacity-80">
            Andinda Bakainaga
          </h3>
          <p className="text-white text-opacity-80 text-sm mb-2">
            Backend Engineer | Documentation
          </p>
          <div className="flex gap-4">
            <a href="https://github.com/Dindosss">
              <img
                src="https://mycity-storage-bucket.s3.eu-west-1.amazonaws.com/resources/logo_github.webp"
                alt="GitHub"
                width={24}
                height={24}
                className="w-6"
              />
            </a>
            <a href="https://www.linkedin.com/in/andinda-bakainaga-b8b011216/">
              <img
                src="https://mycity-storage-bucket.s3.eu-west-1.amazonaws.com/resources/logo_linkedin.webp"
                alt="LinkedIn"
                width={24}
                height={24}
                className="w-6"
              />
            </a>
          </div>
        </div>

        {/* Sponsorship Section */}
        <div className="flex flex-col items-center mt-10 w-full">
          {/* Section Heading */}
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white text-opacity-80 text-center my-6">
            Sponsorship
          </h1>

          {/* Sponsorship Details */}
          <div className="flex flex-col md:flex-row items-center md:space-x-6 w-full max-w-6xl mb-10">
            {/* Image & Title */}
            <div className="flex flex-col items-center w-full md:w-1/3 max-w-xs">
              <a href="https://placekit.io/">
                <img
                  src="https://mycity-storage-bucket.s3.eu-west-1.amazonaws.com/resources/logo_placekit.webp"
                  alt="PlaceKit Logo"
                  className="w-32 h-32 object-cover rounded-full mb-4"
                />
              </a>
              <a href="https://placekit.io/">
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white text-opacity-80 text-center">
                  Placekit.io
                </h2>
              </a>
            </div>

            {/* Description */}
            <div className="text-white text-opacity-80 space-y-4 md:w-2/3 md:flex md:flex-col md:justify-center mt-4 md:mt-0 text-center md:text-left">
              <p className="mb-4 text-sm sm:text-base md:text-md lg:text-lg">
                We are incredibly thankful to PlaceKit for their generous
                sponsorship and unwavering support for the MyCity project.
                Initially, we were limited by the constraints of a free account
                with 10,000 requests per month. However, recognizing the
                potential and the significance of MyCity, PlaceKit generously
                upgraded us to a plan with 1 million requests per month at no
                cost. Their willingness to support student initiatives has made
                a profound difference in the development of our platform.
              </p>
              <p className="mb-4 text-sm sm:text-base md:text-md lg:text-lg">
                In addition to technical support, PlaceKit has gone above and
                beyond by sponsoring custom shirts for our team to wear on
                project day. This thoughtful gesture ensures that MyCity stands
                out and helps us present our project with a unified, professional
                look. Their commitment to empowering student-led projects like
                ours has been invaluable, and we are deeply appreciative of their
                contribution.
              </p>
            </div>
          </div>
        </div>

        {/* In Association With Section */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-white text-opacity-80 text-center mb-4">
            In Association With
          </h2>
          <div className="flex justify-center gap-6">
            <a href="https://www.epiuselabs.com/">
              <img
                src="https://mycity-storage-bucket.s3.eu-west-1.amazonaws.com/resources/logo_epi-use.webp"
                alt="Epi-Use"
                width={180}
                height={180}
                className="w-24 h-auto"
              />
            </a>
            <a href="https://www.groupelephant.com/">
              <img
                src="https://mycity-storage-bucket.s3.eu-west-1.amazonaws.com/resources/logo_group-elephant.webp"
                alt="Group Elephant"
                width={180}
                height={180}
                className="w-24 h-auto"
              />
            </a>
          </div>
        </section>
      </div>
    </section>
  </main>
</div>

    </div>
  );
}

// Team Member Component
function TeamMember({
  name,
  title,
  bio,
  github,
  linkedin,
  imgSrc,
  reverse,
}: TeamMemberProps) {
  return (
    <div
      className={`flex p-4 my-4 dark:bg-gray-700 dark:text-white bg-gray-100 rounded-3xl items-center ${
        reverse ? "sm:flex-row-reverse" : "sm:flex-row"
      } flex-col h-[40vh] overflow-hidden`}
    >
      <div className="w-1/4 text-center ">
        <img
          src={imgSrc}
          alt={name}
          width={130}
          height={130}
          className="w-3/5 h-auto object-cover rounded-full mx-auto"
        />

        <h5 className="text-sm sm:text-base md:text-lg lg:text-xl text-center mt-2">
          {title}
        </h5>
        <div className="flex gap-2 justify-center mt-2">
          <a href={github}>
            <img
              src="https://mycity-storage-bucket.s3.eu-west-1.amazonaws.com/resources/logo_github.webp"
              alt="GitHub"
              width={24}
              height={24}
              className="w-6 sm:w-8"
            />
          </a>
          <a href={linkedin}>
            <img
              src="https://mycity-storage-bucket.s3.eu-west-1.amazonaws.com/resources/logo_linkedin.webp"
              alt="LinkedIn"
              width={24}
              height={24}
              className="w-6 sm:w-8"
            />
          </a>
        </div>
      </div>
      <div className="w-3/4 mt-4 sm:mt-0 ml-4 mr-4  sm:text-left h-full ">
        <h2 className="text-lg sm:text-2xl md:text-3xl lg:text-4xl mt-2 mb-4 text-center w-full">
          {name}
        </h2>

        <p className="text-sm sm:text-base md:text-md lg:text-lg">{bio}</p>
      </div>
    </div>
  );
}

// Vision Item Component (with responsive text size)
function VisionItem({
  image,
  paragraph1,
  paragraph2,
  paragraph3,
  reverse,
}: VisionItemProps) {
  return (
    <div
      className={`flex m-4 p-4 dark:bg-gray-700 dark:text-white bg-gray-100 rounded-3xl items-center ${
        reverse ? "sm:flex-row-reverse" : "sm:flex-row"
      } flex-col sm:h-[33vh] md:h-[50vh] lg:h-[60vh] w-3/4`}
    >
      <div className="w-full sm:w-1/4 text-center">
        <img
          src={image}
          alt="Vision"
          width={100}
          height={100}
          className="w-full h-auto object-cover rounded-lg mx-auto"
        />
      </div>
      <div className="w-full sm:w-3/4 mt-4 sm:mt-0 sm:ml-4 text-center sm:text-left overflow-y-auto h-full">
        <p className="mb-4 text-sm sm:text-base md:text-md lg:text-lg">
          {paragraph1}
        </p>
        <p className="mb-4 text-sm sm:text-base md:text-md lg:text-lg">
          {paragraph2}
        </p>
        <p className="text-sm sm:text-base md:text-md lg:text-lg">
          {paragraph3}
        </p>
      </div>
    </div>
  );
}

// Association Logo Component
function AssociationLogo({ link, imgSrc }: AssociationLogoProps) {
  return (
    <div className="p-2 w-1/6">
      <a href={link}>
        <img
          src={imgSrc}
          alt="Association Logo"
          width={100}
          height={100}
          className="w-full h-auto"
        />
      </a>
    </div>
  );
}
