// HowToPage.tsx
"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "~/app/_components/PublicNavigation";


const GuideCard = ({
  title,
  description,
  icon,
  link,
  delay,
}: {
  title: string;
  description: string;
  icon: string;
  link: string;
  delay: number;
}) => (
  <motion.div
    className="group relative overflow-hidden rounded-xl bg-white p-6 shadow-lg transition-all hover:shadow-xl"
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay, duration: 0.5 }}
    whileHover={{ y: -5, scale: 1.02 }}
  >
    <Link href={link} className="block">
      <div className="mb-4 text-4xl">{icon}</div>
      <h3 className="mb-2 text-xl font-bold text-gray-800">{title}</h3>
      <p className="text-gray-600">{description}</p>
      <motion.div
        className="mt-4 inline-flex items-center text-lime-500"
        whileHover={{ x: 5 }}
      >
        Learn more →
      </motion.div>
    </Link>
  </motion.div>
);

// Main How To Page
const HowToPage = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isNavVisible, setIsNavVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

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

  const guides = [
    {
      title: "For Students",
      description: "Learn how to track your community service hours and manage your volunteer activities effectively.",
      icon: "📚",
      link: "/lessons/students",
      linkedInUrl: "https://www.linkedin.com/in/student",
    },
    {
      title: "For Lecturers",
      description: "Discover how to register your organization and manage volunteer opportunities.",
      icon: "🏢",
      link: "/lessons/lecturer",
      linkedInUrl: "https://www.linkedin.com/in/organization",
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
              How to use <span className="text-lime-500">HereNow</span>
            </motion.h1>
            <motion.p
              className="mx-auto max-w-2xl text-xl text-gray-600"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              Comprehensive guides to help you make the most of our platform.
              Choose your role below to get started.
            </motion.p>
          </div>
        </section>

        {/* Guides Section */}
        <section className="relative z-20 w-full overflow-hidden rounded-tl-[50px] rounded-tr-[50px] bg-gradient-to-b from-lime-500 to-lime-700 py-20">
          <div className="container mx-auto max-w-7xl px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-4 sm:px-6">
              {guides.map((guide, index) => (
                <GuideCard
                  key={guide.title}
                  title={guide.title}
                  description={guide.description}
                  icon={guide.icon}
                  link={guide.link}
                  delay={index * 0.1}
                />
              ))}
            </div>
          </div>
        </section>

        <footer className="flex w-full items-center justify-center bg-lime-700 py-8">
          <p className="text-center text-white">
            &copy; {new Date().getFullYear()} HereNow. All rights reserved.
          </p>
        </footer>
      </main>
    </div>
  );
};

export default HowToPage;