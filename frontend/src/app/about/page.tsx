"use client";

import Navbar from "@/components/Navbar/Navbar";

export default function About() {
  return (
    <div>
      {/* Desktop View */}
      <div className="hidden sm:block">
        <div>
          <Navbar />
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
          <div className=" flex flex-col  h-3/4 mt-20 overflow-hidden w-full">
            {/* Heading */}
            <div className="relative">
              <h1 className="text-4xl font-bold text-white text-opacity-80 absolute top-13 transform translate-x-1/4">
                About Us
              </h1>
            </div>

            {/* Our Vision */}
            <div className="flex items-center mt-20 justify-center w-full  overflow-y-auto">
              <div className="w-1/2 p-4 justify-center">
                <h1 className="text-4xl font-bold text-white text-center text-opacity-80">
                  Our Vision
                </h1>

                <div className="flex w-full items-center gap-4">
                  <div className="flex w-1/3 ">
                    <img
                      src="https://mycity-storage-bucket.s3.eu-west-1.amazonaws.com/resources/about_1.webp"
                      alt=""
                    />
                  </div>
                  <div className="flex w-2/3">
                    <p className="text-white text-opacity-80 text-lg">
                      MyCity is a Progressive Web Application that aims to
                      provide users with a platform to report and track
                      municipal faults across South Africa. Our vision is to
                      create a community-driven platform that connects users
                      with municipalities, and 3rd party Service Providers,
                      enhancing the experience of reporting and tracking faults
                      in your city.
                    </p>
                  </div>
                </div>

                <div className="flex w-full items-center gap-4">
                  <div className="flex w-2/3">
                    <p className="text-white text-opacity-80 mt-4 text-lg">
                      A key feature of MyCity is its ability to provide
                      real-time statistics related to municipal faults. Users
                      will have access to data on how long it takes for issues
                      to be resolved, which municipalities have the least
                      faults, and which ones have the best resolution times as
                      well as vaious other statistics. This transparency will
                      empower residents and hold municipalities accountable,
                      driving improvements in service delivery and fostering
                      trust between the community and local government.
                    </p>
                  </div>

                  <div className="flex w-1/3">
                    <img
                      src="https://mycity-storage-bucket.s3.eu-west-1.amazonaws.com/resources/about_2.webp"
                      alt=""
                    />
                  </div>
                </div>

                <div className="flex w-full items-center gap-4">
                  <div className="flex w-1/3">
                    <img
                      src="https://mycity-storage-bucket.s3.eu-west-1.amazonaws.com/resources/about_3.webp"
                      alt=""
                    />
                  </div>
                  <div className="flex w-2/3">
                    <p className="text-white text-opacity-80 mt-4 text-lg">
                      We envision a future where MyCity becomes an essential
                      tool for residents. Our platform will serve as a bridge
                      between the people of South Africa and the municipalities
                      that run our cities. Through continuous innovation and
                      collaboration with local stakeholders, MyCity will evolve
                      into a comprehensive resource for tracking and reporting
                      faults across South Africa.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Meet The Team */}
            <div className="flex justify-center">
              <div className="flex flex-wrap justify-center w-1/2">
                <h1 className="text-4xl font-bold text-white text-opacity-80">
                  Meet The Team
                </h1>

                {/* Dominique */}
                <div className="flex m-4 bg-gray-700 p-4 text-white rounded-3xl">
                  <div className="flex flex-col w-1/3 text-center">
                    <img
                      src="https://mycity-storage-bucket.s3.eu-west-1.amazonaws.com/resources/profile_Dominique_Da_Silva.webp"
                      width="256"
                      style={{ borderRadius: "50%" }}
                      alt="Dominique Da Silva"
                    />
                    <h2 className="text-2xl">Dominique Da Silva</h2>
                    <h5>Team Leader | Documentation</h5>
                    <div className="flex gap-2 justify-center">
                      <a href="https://www.linkedin.com/in/DominiqueDaSilva/">
                        <img
                          src="https://mycity-storage-bucket.s3.eu-west-1.amazonaws.com/resources/logo_github.webp"
                          alt="GitHub"
                          style={{ width: "40px", height: "auto" }}
                        />
                      </a>
                      <a href="https://github.com/Dominique-Da-Silva">
                        <img
                          src="https://mycity-storage-bucket.s3.eu-west-1.amazonaws.com/resources/logo_linkedin.webp"
                          alt="Linkedin"
                          style={{ width: "40px", height: "auto" }}
                        />
                      </a>
                    </div>{" "}
                  </div>
                  <div className="flex flex-col w-2/3">
                    <h4>Bio:</h4>
                    <p>
                      I excel in delivering innovative solutions that generate
                      tangible value. Driven by a passion for technology and a
                      commitment to excellence, I am poised to contribute my
                      expertise to impactful projects in the realms of backend
                      development and AI.
                    </p>
                  </div>
                </div>

                {/* Kyle */}
                <div className="flex m-4 bg-gray-700 p-4 text-white rounded-3xl">
                  <div className="flex flex-col w-2/3">
                    <h4>Bio:</h4>
                    <p>
                      I am a dynamic and innovative individual with a keen eye
                      for aesthetics and user experience. Combining creativity
                      with logical thinking, I bring a unique approach to
                      software engineering as a discipline.
                    </p>
                  </div>{" "}
                  <div className="flex flex-col text-center w-1/3">
                    <img
                      src="https://mycity-storage-bucket.s3.eu-west-1.amazonaws.com/resources/profile_Kyle_Marshall.webp"
                      width="256"
                      style={{ borderRadius: "50%" }}
                      alt="Kyle Marshall"
                    />
                    <h2 className="text-2xl">Kyle Marshall</h2>
                    <h5>UI Engineer | Documentation</h5>
                    <div className="flex gap-2 justify-center">
                      <a href="https://github.com/KyleMarshall23">
                        <img
                          src="https://mycity-storage-bucket.s3.eu-west-1.amazonaws.com/resources/logo_github.webp"
                          alt="GitHub"
                          style={{ width: "40px", height: "auto" }}
                        />
                      </a>
                      <a href="https://www.linkedin.com/in/kyle-marshall23">
                        <img
                          src="https://mycity-storage-bucket.s3.eu-west-1.amazonaws.com/resources/logo_linkedin.webp"
                          alt="Linkedin"
                          style={{ width: "40px", height: "auto" }}
                        />
                      </a>
                    </div>
                  </div>
                </div>

                {/* Tino */}
                <div className="flex m-4 bg-gray-700 p-4 text-white rounded-3xl">
                  <div className="flex flex-col text-center w-1/3">
                    <img
                      src="https://mycity-storage-bucket.s3.eu-west-1.amazonaws.com/resources/profile_Tino_Gwanyanya.webp"
                      width="256"
                      style={{ borderRadius: "50%" }}
                      alt="Tino Gwanyanya"
                    />
                    <h2 className="text-2xl">Tino Gwanyanya</h2>
                    <h5>
                      Backend Engineer | Integration Engineer | Documentation
                    </h5>
                    <div className="flex gap-2 justify-center">
                      <a href="https://github.com/Tinogwanz">
                        <img
                          src="https://mycity-storage-bucket.s3.eu-west-1.amazonaws.com/resources/logo_github.webp"
                          alt="GitHub"
                          style={{ width: "40px", height: "auto" }}
                        />
                      </a>
                      <a href="https://www.linkedin.com/in/anold-tinotenda-gwanyanya">
                        <img
                          src="https://mycity-storage-bucket.s3.eu-west-1.amazonaws.com/resources/logo_linkedin.webp"
                          alt="Linkedin"
                          style={{ width: "40px", height: "auto" }}
                        />
                      </a>
                    </div>
                  </div>

                  <div className="flex flex-col w-2/3">
                    {" "}
                    <h4>Bio:</h4>
                    <p>
                      My superpower? Rapid learning. This means I cannot only
                      adapt to diverse scenarios but also excel in them. The
                      result is then the ability to not only meet but exceed set
                      objectives effectively. Driven by challenges, I possess
                      the patience and resilience to see tasks through to
                      completion.
                    </p>
                  </div>
                </div>

                {/* Matthew */}
                <div className="flex m-4 bg-gray-700 p-4 text-white rounded-3xl">
                  <div className="flex flex-col w-2/3">
                    <h4>Bio:</h4>
                    <p>
                      I am a passionate software engineer with a background in
                      computer science and multimedia. My expertise spans
                      DevOps, front-end development, and data engineering. I
                      have experience setting up and managing AWS
                      infrastructure, configuring CI/CD pipelines, and
                      developing user-friendly mobile interfaces. I thrive in
                      collaborative environments and am dedicated to creating
                      robust, scalable, and innovative solutions.
                    </p>
                    <br />
                    <h4>Project Contributions:</h4>
                    <ul className="list-disc list-inside text-left">
                      <li>
                        DevOps Engineer: Managed AWS setup and GitHub
                        configuration, implementing CI/CD pipelines for
                        efficient development and deployment.
                      </li>
                      <li>
                        Mobile Front-End Engineer: Designed and developed all
                        mobile screens, ensuring a seamless and intuitive user
                        experience.
                      </li>
                      <li>
                        Data Engineer & Integration Engineer: Created
                        comprehensive mock data sets for testing and validation
                        during the app’s development.
                      </li>
                    </ul>
                  </div>
                  <div className=" flex flex-col w-1/3 text-center">
                    <img
                      src="https://mycity-storage-bucket.s3.eu-west-1.amazonaws.com/resources/profile_Matthew_Els.webp"
                      width="256"
                      style={{ borderRadius: "50%" }}
                      alt="Matthew Els"
                    />
                    <h2 className="text-2xl">Matthew Els</h2>
                    <h5>
                      DevOps Engineer | Mobile Front-End Engineer | Data
                      Engineer | Integration Engineer | Documentation
                    </h5>
                    <div className="flex gap-2 justify-center">
                      <a href="https://github.com/MatthewEls">
                        <img
                          src="https://mycity-storage-bucket.s3.eu-west-1.amazonaws.com/resources/logo_github.webp"
                          alt="GitHub"
                          style={{ width: "40px", height: "auto" }}
                        />
                      </a>
                      <a href="https://www.linkedin.com/in/matthewels/">
                        <img
                          src="https://mycity-storage-bucket.s3.eu-west-1.amazonaws.com/resources/logo_linkedin.webp"
                          alt="Linkedin"
                          style={{ width: "40px", height: "auto" }}
                        />
                      </a>
                    </div>
                  </div>
                </div>

                {/* Andinda */}
                <div className="flex m-4 bg-gray-700 p-4 text-white rounded-3xl">
                  <div className="w-1/3 text-center">
                    <img
                      src="https://mycity-storage-bucket.s3.eu-west-1.amazonaws.com/resources/profile_Andinda_Bakainaga.webp"
                      width="256"
                      style={{ borderRadius: "50%" }}
                      alt="Andinda Bakainaga"
                    />
                    <h2 className="text-2xl">Andinda Bakainaga</h2>
                    <h5>Backend Engineer | Documentation</h5>
                    <div className="flex gap-2 justify-center">
                      <a href="https://github.com/Dindosss">
                        <img
                          src="https://mycity-storage-bucket.s3.eu-west-1.amazonaws.com/resources/logo_github.webp"
                          alt="GitHub"
                          style={{ width: "40px", height: "auto" }}
                        />
                      </a>
                      <a href="https://www.linkedin.com/in/andinda-bakainaga-b8b011216">
                        <img
                          src="https://mycity-storage-bucket.s3.eu-west-1.amazonaws.com/resources/logo_linkedin.webp"
                          alt="Linkedin"
                          style={{ width: "40px", height: "auto" }}
                        />
                      </a>
                    </div>
                  </div>
                  <div className="w-2/3">
                    <h4>Bio:</h4>
                    <p>
                      I am an energetic and relentless software developer, with
                      a focus on backend development. I bring a blend of
                      creativity and strategic thinking to problem-solving in
                      this domain, consistently delivering innovative and
                      efficient solutions.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* In Association With */}
            <div className="flex flex-col justify-center w-full ">
              <div className="justify-center text-center ">
                <h1 className="text-4xl font-bold text-white text-opacity-80">
                  In Association With
                </h1>
              </div>
              <div className="flex justify-center">
                <div className="justify-center p-2">
                  <a href="https://www.epiuselabs.com/">
                    <img
                      width="200"
                      height="auto"
                      src="https://mycity-storage-bucket.s3.eu-west-1.amazonaws.com/resources/logo_epi-use.webp"
                      alt="Epi-Use Labs"
                    />
                  </a>
                </div>

                <div className="justify-center p-2">
                  <a href="https://www.groupelephant.com/">
                    <img
                      width="200"
                      height="auto"
                      src="https://mycity-storage-bucket.s3.eu-west-1.amazonaws.com/resources/logo_group-elephant.webp"
                      alt="Group Elephant"
                    />
                  </a>
                </div>
              </div>
            </div>
          </div>
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
              src="https://mycity-storage-bucket.s3.eu-west-1.amazonaws.com/resources/MyCity-Logo-128.webp"
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
                'linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url("https://mycity-storage-bucket.s3.eu-west-1.amazonaws.com/resources/Johannesburg-Skyline.webp")',
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
