"use client";

import Navbar from "@/components/Navbar/Navbar";
import Image from "next/image";
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
            <div className="flex flex-col items-center mt-10 w-full">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white text-opacity-80 text-center mt-10 mb-4">
                What is MyCity?
              </h1>
              <VisionItem
                image="https://mycity-storage-bucket.s3.eu-west-1.amazonaws.com/resources/about_1.webp"
                paragraph1="MyCity is a Progressive Web Application (PWA) that seeks to redefine the relationship between citizens, municipalities, and service providers by creating a centralized platform for reporting and tracking municipal faults. Traditionally, reporting infrastructure issues has been a cumbersome and inefficient process, often requiring residents to go through tedious paperwork or rely on limited communication channels, which frequently lead to delayed resolutions or even lost requests. MyCity aims to change this by offering a seamless, user-friendly digital solution that simplifies the process for everyone involved."
                paragraph2="The platform is designed to be intuitive and accessible, allowing users to log issues in just a few clicks. Whether it's a broken streetlight, a hazardous pothole, or a malfunctioning water system, users can report faults with detailed descriptions, photos, and GPS-based location tracking to ensure accuracy. This data is then immediately relayed to the relevant municipal department or service provider. Users can track the status of their reports in real-time, receiving updates as the issue moves through different stages of resolution—from being acknowledged to being actively worked on, and ultimately resolved. The interactive, mobile-responsive design of MyCity ensures that users can report issues on the go, directly from their smartphones, making it easier than ever to contribute to the upkeep of their communities."
                paragraph3="Furthermore, municipalities and third-party service providers benefit greatly from MyCity. By consolidating reports and streamlining communications, MyCity eliminates inefficiencies such as duplicate tickets for the same issue, missed reports, or scattered data. This ensures that municipal resources are used more effectively, while also giving them the tools to manage and monitor public infrastructure with greater transparency and accountability. By bridging the gap between the public and local governments, MyCity not only empowers users to take charge of their communities but also helps municipalities improve their service delivery through a modern, data-driven approach."
                reverse={false}
              />
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white text-opacity-80 text-center mt-10 mb-4">
                Real-Time Statistics and Data Transparency
              </h1>
              <VisionItem
                image="https://mycity-storage-bucket.s3.eu-west-1.amazonaws.com/resources/about_2.webp"
                paragraph1="A key feature of MyCity is its powerful ability to generate real-time statistics, providing unprecedented visibility into the efficiency and responsiveness of municipal fault management. In many cases, citizens report faults without any clear understanding of how long the resolution will take or which municipalities are better equipped to handle the issue. MyCity changes this by offering detailed data dashboards that highlight key performance indicators (KPIs) for municipal services."
                paragraph2="For instance, users will have access to statistics that show the average time it takes for different types of faults—such as water leaks or potholes—to be resolved, giving them a realistic expectation of how long their issue might take to address. They can also view which municipalities have the fewest reported faults and which have the fastest resolution times, creating a competitive environment where municipalities are encouraged to improve their service delivery. The transparency this brings is transformative: users no longer feel disconnected from the process once a report is submitted; they are kept in the loop every step of the way. This level of transparency fosters trust and encourages further citizen engagement, as residents can see that their voices are being heard and that their concerns are being actively addressed."
                paragraph3="For municipalities, this statistical data provides essential insights into their own performance. They can identify bottlenecks, allocate resources more efficiently, and focus on areas that need improvement. In essence, it becomes a self-assessment tool that empowers municipalities to take action where it’s most needed. Additionally, third-party service providers who bid for municipal repair work can leverage this data to refine their service offerings, improving turnaround times and ensuring that they meet the community’s needs effectively. The real-time aspect of this data ensures that stakeholders are always working with the most current information, which helps prioritize urgent issues and mitigate long-standing faults more effectively."
                reverse={true}
              />
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white text-opacity-80 text-center mt-10 mb-4">
                Vision for the Future
              </h1>
              <VisionItem
                image="https://mycity-storage-bucket.s3.eu-west-1.amazonaws.com/resources/about_3.webp"
                paragraph1="At MyCity, we envision a future where our platform becomes a vital tool in shaping smarter, more responsive cities. In its current form, MyCity is focused on fault reporting and tracking, but we believe this is only the beginning of what the platform can offer. Our long-term goal is to transform MyCity into a comprehensive civic engagement tool that fosters ongoing dialogue between residents, municipalities, and service providers on a wide range of public service issues. From waste management and public transportation to park maintenance and public safety, we aim to expand the scope of MyCity to encompass all aspects of urban infrastructure."
                paragraph2="Imagine a future where not only are faults reported and tracked, but where predictive analytics are used to anticipate issues before they arise. By analyzing data on past faults, usage patterns, and environmental factors, MyCity could alert municipalities to potential risks—such as deteriorating infrastructure that is likely to fail—allowing for preventative maintenance and minimizing service disruptions. This would represent a proactive approach to urban management, reducing both the costs and inconveniences associated with emergency repairs. As the platform evolves, integrating more advanced features like these will position MyCity as an indispensable tool for both residents and local governments alike."
                paragraph3="In the years ahead, we see MyCity becoming an integral part of how urban areas operate—not just in South Africa, but globally. By continually refining our platform to meet the ever-changing needs of modern cities, we aim to create a system where local governments are more accountable, service providers are more efficient, and residents are more engaged in the well-being of their communities. Ultimately, we believe that by facilitating stronger connections between these groups, MyCity will contribute to creating more sustainable, responsive, and transparent urban environments. Our vision is to foster a future where the management of public infrastructure is not only efficient but also equitable, ensuring that all citizens—regardless of where they live—benefit from improved municipal services."
                reverse={false}
              />
            </div>

            {/* Meet The Team Section */}
            <div className="flex justify-center">
              <div className="flex flex-wrap flex-col item-center justify-center w-full sm:w-3/4 lg:w-3/4">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white text-opacity-80 text-center mt-10 mb-4">
                  Meet The Team
                </h1>

                {/* Team Members */}
                <TeamMember
                  name="Dominique Da Silva"
                  title="Team Leader | Documentation"
                  bio="Dominique Da Silva is a seasoned software developer with a passion for delivering innovative solutions that generate tangible value. Her work includes developing tools that streamline business processes, including competitive analysis and sales automation. Dominique's background in Computer Science provides her with a diverse range of technical skills, and her interest in Artificial Intelligence further drives her to contribute to impactful projects. Her commitment to excellence and technology makes her a key asset in both backend development and AI."
                  github="https://github.com/Dominique-Da-Silva"
                  linkedin="https://www.linkedin.com/in/DominiqueDaSilva/"
                  imgSrc="https://mycity-storage-bucket.s3.eu-west-1.amazonaws.com/resources/profile_Dominique_Da_Silva.webp"
                  reverse={false}
                />
                <TeamMember
                  name="Kyle Marshall"
                  title="UI Engineer | Documentation"
                  bio="Kyle Marshall is a creative software engineer who blends aesthetics with functionality to craft engaging user experiences. He specializes in developing intuitive, visually appealing interfaces for both mobile and web platforms. Kyle’s ability to work with APIs and create seamless user interactions demonstrates his innovative thinking. His leadership and teamwork skills, combined with a strong sense of design, make him an asset to any project team."
                  github="https://github.com/KyleMarshall23"
                  linkedin="https://www.linkedin.com/in/kyle-marshall23"
                  imgSrc="https://mycity-storage-bucket.s3.eu-west-1.amazonaws.com/resources/profile_Kyle_Marshall.webp"
                  reverse={true}
                />
                <TeamMember
                  name="Tino Gwanyanya"
                  title="Backend Engineer | Integration Engineer | Documentation"
                  bio="Tino Gwanyanya is a dedicated backend developer with a passion for learning and adapting to new challenges. Known for his rapid learning abilities, Tino excels in creating and integrating backend systems that enhance user experience. He thrives in collaborative environments, bringing resilience and critical thinking to every task. Whether working on APIs or solving complex problems, Tino consistently exceeds expectations and delivers high-quality work."
                  github="https://github.com/Tinogwanz"
                  linkedin="https://www.linkedin.com/in/anold-tinotenda-gwanyanya/"
                  imgSrc="https://mycity-storage-bucket.s3.eu-west-1.amazonaws.com/resources/profile_Tino_Gwanyanya.webp"
                  reverse={false}
                />
                <TeamMember
                  name="Matthew Els"
                  title="DevOps Engineer | Front-End Engineer | Data Engineer"
                  bio="Matthew Els is a Computer Science and Multimedia student with a strong focus on front-end development and user experience design. Known for his attention to detail and problem-solving skills, he consistently delivers high-quality, user-centered interfaces. Beyond development, Matthew has a keen interest in security, penetration testing, network engineering, and DevOps. His collaborative approach and ability to adapt to diverse challenges make him a well-rounded and valuable asset to any project."
                  github="https://github.com/MatthewEls"
                  linkedin="https://www.linkedin.com/in/matthewels/"
                  imgSrc="https://mycity-storage-bucket.s3.eu-west-1.amazonaws.com/resources/profile_Matthew_Els.webp"
                  reverse={true}
                />
                <TeamMember
                  name="Andinda Bakainaga"
                  title="Backend Engineer | Documentation"
                  bio="Andinda Bakainaga is an energetic backend developer with a knack for solving complex problems through creative and strategic solutions. His focus on backend systems ensures efficiency and reliability in every project he undertakes. Andinda’s passion for innovation is evident in his personal projects, which often incorporate cutting-edge technology. His drive for continuous improvement makes him a valuable contributor to any software team."
                  github="https://github.com/Dindosss"
                  linkedin="https://www.linkedin.com/in/andinda-bakainaga-b8b011216/"
                  imgSrc="https://mycity-storage-bucket.s3.eu-west-1.amazonaws.com/resources/profile_Andinda_Bakainaga.webp"
                  reverse={false}
                />
              </div>
            </div>

            {/* Sponsorship*/}

            <div className="flex flex-col justify-center w-3/4">
              <div className="text-center">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white text-opacity-80">
                  Sponsorship
                </h1>
              </div>

              <a href={"https://placekit.io/"}>
                <div
                  className={`flex m-4 dark:bg-gray-700 dark:text-white bg-gray-100 p-4 justify-center rounded-3xl items-center w-full`}
                >
                  <div className="w-full sm:w-1/4 text-center">
                    <a href={"https://placekit.io/"}>
                      <Image
                        src="https://mycity-storage-bucket.s3.eu-west-1.amazonaws.com/resources/logo_placekit.webp"
                        alt="Vision"
                        width={100}
                        height={100}
                        className="w-full h-auto object-cover rounded-lg mx-auto"
                      />
                    </a>
                  </div>
                  <div className="w-full sm:w-3/4 mt-4 sm:mt-0 sm:ml-4 text-center sm:text-left overflow-y-auto h-full">
                    <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold dark:text-white text-opacity-80 mb-4">
                      Placekit.io
                    </h2>
                    <p className="mb-4 text-sm sm:text-base md:text-md lg:text-lg">
                      We are incredibly thankful to PlaceKit for their generous
                      sponsorship and unwavering support for the MyCity project.
                      Initially, we were limited by the constraints of a free
                      account with 10,000 requests per month. However,
                      recognizing the potential and the significance of MyCity,
                      PlaceKit generously upgraded us to a plan with 1 million
                      requests per month at no cost. Their willingness to
                      support student initiatives has made a profound difference
                      in the development of our platform, allowing us to fully
                      focus on creating a solution that benefits both the
                      community and local governments.
                    </p>
                    <p className="mb-4 text-sm sm:text-base md:text-md lg:text-lg">
                      In addition to the technical support, PlaceKit has gone
                      above and beyond by sponsoring custom shirts for our team
                      to wear on project day. This thoughtful gesture ensures
                      that MyCity stands out and helps us present our project
                      with a unified, professional look. Their kindness and
                      commitment to empowering student-led projects like ours
                      have been invaluable, and we are deeply appreciative of
                      their contribution. Thanks to PlaceKit, we are ready to
                      make an impact and showcase MyCity with confidence on
                      project day.
                    </p>
                  </div>
                </div>
              </a>
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
    <div className="text-white font-bold transform hover:scale-105 transition-transform duration-200 flex justify-center">
      <Image
        src="https://mycity-storage-bucket.s3.eu-west-1.amazonaws.com/resources/MyCity-Logo-256.webp"
        alt="MyCity"
        width={180}
        height={180}
      />
    </div>
    
    {/* Page Title */}
    <h1 className="text-3xl font-bold text-white mb-6 text-center">
      About Us
    </h1>

    {/* What is MyCity Section */}
    <section className="mb-10">
      <h2 className="text-2xl font-bold text-white text-center mb-4">
        What is MyCity?
      </h2>
      <Image
        src="https://mycity-storage-bucket.s3.eu-west-1.amazonaws.com/resources/about_1.webp"
        width={180}
        height={180}
        alt="MyCity Vision"
        className="w-full h-auto rounded-lg mb-4"
      />
      <p className="text-white text-sm mb-4">
        MyCity is a Progressive Web Application (PWA) that seeks to redefine the relationship between citizens, municipalities, and service providers by creating a centralized platform for reporting and tracking municipal faults.
      </p>
      <p className="text-white text-sm mb-4">
        The platform simplifies the process of logging issues like broken streetlights or potholes, providing real-time tracking of reports. It helps municipalities to streamline the process by eliminating duplicate reports and making data-driven decisions.
      </p>
    </section>

    {/* Meet The Team Section */}
    <section className="mb-10">
      <h2 className="text-2xl font-bold text-white text-center mb-4">
        Meet The Team
      </h2>
      <div className="grid grid-cols-1 gap-6">
        {/* Dominique */}
        <div className="flex flex-col items-center text-center">
          <Image
            src="https://mycity-storage-bucket.s3.eu-west-1.amazonaws.com/resources/profile_Dominique_Da_Silva.webp"
            alt="Dominique Da Silva"
            width={130}
            height={130}
            className="w-32 h-32 rounded-full mb-2"
          />
          <h3 className="text-lg font-bold text-white">Dominique Da Silva</h3>
          <p className="text-white text-sm mb-2">Team Leader | Documentation</p>
          <div className="flex gap-4">
            <a href="https://github.com/Dominique-Da-Silva">
              <Image
                src="https://mycity-storage-bucket.s3.eu-west-1.amazonaws.com/resources/logo_github.webp"
                alt="GitHub"
                width={24}
                height={24}
                className="w-6"
              />
            </a>
            <a href="https://www.linkedin.com/in/DominiqueDaSilva/">
              <Image
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
          <Image
            src="https://mycity-storage-bucket.s3.eu-west-1.amazonaws.com/resources/profile_Kyle_Marshall.webp"
            alt="Kyle Marshall"
            width={130}
            height={130}
            className="w-32 h-32 rounded-full mb-2"
          />
          <h3 className="text-lg font-bold text-white">Kyle Marshall</h3>
          <p className="text-white text-sm mb-2">UI Engineer | Documentation</p>
          <div className="flex gap-4">
            <a href="https://github.com/KyleMarshall23">
              <Image
                src="https://mycity-storage-bucket.s3.eu-west-1.amazonaws.com/resources/logo_github.webp"
                alt="GitHub"
                width={24}
                height={24}
                className="w-6"
              />
            </a>
            <a href="https://www.linkedin.com/in/kyle-marshall23/">
              <Image
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
          <Image
            src="https://mycity-storage-bucket.s3.eu-west-1.amazonaws.com/resources/profile_Tino_Gwanyanya.webp"
            alt="Tino Gwanyanya"
            width={130}
            height={130}
            className="w-32 h-32 rounded-full mb-2"
          />
          <h3 className="text-lg font-bold text-white">Tino Gwanyanya</h3>
          <p className="text-white text-sm mb-2">
            Backend Engineer | Integration Engineer
          </p>
          <div className="flex gap-4">
            <a href="https://github.com/Tinogwanz">
              <Image
                src="https://mycity-storage-bucket.s3.eu-west-1.amazonaws.com/resources/logo_github.webp"
                alt="GitHub"
                width={24}
                height={24}
                className="w-6"
              />
            </a>
            <a href="https://www.linkedin.com/in/anold-tinotenda-gwanyanya/">
              <Image
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
          <Image
            src="https://mycity-storage-bucket.s3.eu-west-1.amazonaws.com/resources/profile_Matthew_Els.webp"
            alt="Matthew Els"
            width={130}
            height={130}
            className="w-32 h-32 rounded-full mb-2"
          />
          <h3 className="text-lg font-bold text-white">Matthew Els</h3>
          <p className="text-white text-sm mb-2">DevOps Engineer | Front-End Engineer | Data Engineer</p>
          <div className="flex gap-4">
            <a href="https://github.com/MatthewEls">
              <Image
                src="https://mycity-storage-bucket.s3.eu-west-1.amazonaws.com/resources/logo_github.webp"
                alt="GitHub"
                width={24}
                height={24}
                className="w-6"
              />
            </a>
            <a href="https://www.linkedin.com/in/matthewels/">
              <Image
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
          <Image
            src="https://mycity-storage-bucket.s3.eu-west-1.amazonaws.com/resources/profile_Andinda_Bakainaga.webp"
            alt="Andinda Bakainaga"
            width={130}
            height={130}
            className="w-32 h-32 rounded-full mb-2"
          />
          <h3 className="text-lg font-bold text-white">Andinda Bakainaga</h3>
          <p className="text-white text-sm mb-2">Backend Engineer | Documentation</p>
          <div className="flex gap-4">
            <a href="https://github.com/Dindosss">
              <Image
                src="https://mycity-storage-bucket.s3.eu-west-1.amazonaws.com/resources/logo_github.webp"
                alt="GitHub"
                width={24}
                height={24}
                className="w-6"
              />
            </a>
            <a href="https://www.linkedin.com/in/andinda-bakainaga-b8b011216/">
              <Image
                src="https://mycity-storage-bucket.s3.eu-west-1.amazonaws.com/resources/logo_linkedin.webp"
                alt="LinkedIn"
                width={24}
                height={24}
                className="w-6"
              />
            </a>
          </div>
        </div>
        {/* In Association With Section */}
<section className="mb-10">
  <h2 className="text-2xl font-bold text-white text-center mb-4">
    In Association With
  </h2>
  <div className="flex justify-center gap-6">
    <a href="https://www.epiuselabs.com/">
      <Image
        src="https://mycity-storage-bucket.s3.eu-west-1.amazonaws.com/resources/logo_epi-use.webp"
        alt="Epi-Use"
        width={180}
        height={180}
        className="w-24 h-auto"
      />
    </a>
    <a href="https://www.groupelephant.com/">
      <Image
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
        <Image
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
            <Image
              src="https://mycity-storage-bucket.s3.eu-west-1.amazonaws.com/resources/logo_github.webp"
              alt="GitHub"
              width={24}
              height={24}
              className="w-6 sm:w-8"
            />
          </a>
          <a href={linkedin}>
            <Image
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
        <Image
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
        <Image src={imgSrc} alt="Association Logo" width={100} height={100} className="w-full h-auto" />
      </a>
    </div>
  );
}
