"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import Navbar from "~/app/_components/PublicNavigation";



// Reusing the NavLink component from the landing page
const NavLink = ({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) => (
  <Link
    href={href}
    className="group relative text-sm font-semibold text-gray-800"
  >
    {children}
    <motion.div
      className="absolute -bottom-1 left-0 h-0.5 w-0 bg-lime-500"
      whileHover={{ width: "100%" }}
      transition={{ duration: 0.2 }}
    />
  </Link>
);

// Developer card component
const DeveloperCard = ({
  name,
  role,
  description,
  delay,
  linkedInUrl,
}: {
  name: string;
  role: string;
  description: string;
  delay: number;
  linkedInUrl: string;
}) => {
  const imageName = name.toLowerCase().replace(/ /g, "-");
  return (
    <motion.div
      className="rounded-xl bg-white p-6 shadow-lg"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.5 }}
      whileHover={{ y: -5, scale: 1.02 }}
    >
      <div className="mb-4 h-32 w-32 mx-auto overflow-hidden rounded-full bg-lime-100">
        <img
          src={`/images/${imageName}.webp`}
          alt={`${name}'s photo`}
          className="h-full w-full object-cover"
        />
      </div>
      <h3 className="mb-2 text-xl font-bold text-gray-800 text-center">{name}</h3>
      <p className="mb-2 text-lime-600 text-center font-medium">{role}</p>
      <p className="text-gray-600 text-center">{description}</p>
      <div className="flex justify-center mt-4">
        <a href={linkedInUrl} target="_blank" rel="noopener noreferrer">
          <img
            src="/images/linkedin-logo.png"
            alt="LinkedIn"
            className="h-6 w-6"
          />
        </a>
      </div>
    </motion.div>
  );
};

const AboutPage = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isNavVisible, setIsNavVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const router = useRouter();
  const { isSignedIn } = useAuth();

  const handleSignIn = () => {
    if (isSignedIn) {
      router.push("/dashboard");
    } else {
      router.push("/signin");
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsNavVisible(currentScrollY <= 0 || currentScrollY < lastScrollY);
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX - window.innerWidth / 2) / 50,
        y: (e.clientY - window.innerHeight / 2) / 50,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const developers = [
    {
      name: "Jasper",
      role: "Middle End Developer",
      description: "Meet Jasper, our technical guru and Scrum Master. He ensures seamless system functionality and fosters a collaborative team environment.",
      linkedInUrl: "https://www.linkedin.com/in/jasper",
    },
    {
      name: "Anneme",
      role: "Project Manager",
      description: "Meet Anneme, our Project Manager, Designer and Frontend Developer, ensuring smooth project flow, effective communication, and great design.",
      linkedInUrl: "https://www.linkedin.com/in/annemeholzhausen/",
    },
    {
      name: "Harvey",
      role: "Front/Middle End Developer",
      description: "Meet Harvey, our UI/UX wizard. He ensures our application is intuitive, engaging, and seamlessly bridges design with system logic.",
      linkedInUrl: "https://www.linkedin.com/in/joshua-harvey-/",
    },
    {
      name: "David",
      role: "Front/Middle End IOS Developer",
      description: "Meet David, our iOS expert, focusing on front-end and middle-end development. He’s dedicated to creating a seamless, user-friendly experience, blending design and functionality perfectly.",
      linkedInUrl: "https://www.linkedin.com/in/drmellors/",
    },
    {
      name: "Nick",
      role: "IOS Developer/Backend Developer",
      description: "Meet Nicholas (or Nick), our iOS maestro. He ensures our app meets Apple's high standards, while seamlessly integrating APIs for a reliable and feature-rich experience.",
      linkedInUrl: "https://www.linkedin.com/in/nicholas-m-1405a7133/",
    },
    {
      name: "Michael",
      role: "Backend Developer",
      description: "Meet Michael, our database expert, crafting a solid framework to support both functionality and future growth.",
      linkedInUrl: "https://www.linkedin.com/in/michael-french-b78427153/",
    },
  ];

  return (
    <div className="relative">
              <Navbar isNavVisible={isNavVisible} />

      <main className="pt-[72px]">
        {/* Hero Section */}
        <section className="relative flex min-h-[60vh] w-full items-center justify-center overflow-hidden bg-white">
          <motion.div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, black 1px, transparent 0)`,
              backgroundSize: "50px 50px",
              transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)`,
            }}
          />

          <div className="relative z-10 text-center">
            <motion.h1
              className="mb-6 text-6xl font-bold"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              About <span className="text-lime-500">Peeper</span>
            </motion.h1>
            <motion.p
              className="mx-auto max-w-2xl text-xl text-gray-600"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              We&apos;re on a mission to make community service tracking seamless and meaningful. 
              Our platform connects students, organizations, and educators in a powerful ecosystem 
              designed to maximize social impact.
            </motion.p>
          </div>
        </section>

        {/* Mission Section */}
        <section className="relative z-20 w-full overflow-hidden rounded-tl-[50px] rounded-tr-[50px] bg-gradient-to-b from-lime-500 to-lime-700 py-20 text-white">
          <div className="container mx-auto max-w-7xl px-4">
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="mb-6 text-4xl font-bold">Our Mission</h2>
              <p className="mx-auto max-w-3xl text-xl">
                To empower individuals and organizations by providing innovative tools 
                that streamline community service tracking, foster meaningful connections, 
                and celebrate the impact of voluntary work in our communities.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Meet the Team Section */}
        <section className="relative w-full bg-white py-20">
          <div className="container mx-auto max-w-7xl px-4">
            <motion.div
              className="mb-16 text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="mb-6 text-4xl font-bold text-gray-800">
                Meet Our Team
              </h2>
              <p className="mx-auto max-w-3xl text-xl text-gray-600">
                We&apos;re a diverse team of developers, designers, and dreamers working 
                together to create the best community service tracking platform.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {developers.map((dev, index) => (
                <DeveloperCard
                  key={dev.name}
                  name={dev.name}
                  role={dev.role}
                  description={dev.description}
                  delay={index * 0.1}
                  linkedInUrl={dev.linkedInUrl}
                />
              ))}
            </div>
          </div>
        </section>

        <footer className="flex w-full items-center justify-center rounded-tl-[50px] rounded-tr-[50px] bg-gradient-to-b from-lime-500 to-lime-700 py-8">
          <p className="text-center text-white">
            &copy; {new Date().getFullYear()} Peeper. All rights reserved.
          </p>
        </footer>
      </main>
    </div>
  );
};

export default AboutPage;