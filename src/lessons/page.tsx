// HowToPage.tsx
"use client";

import React from "react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";

// Reusable components
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

  const guides = [
    {
      title: "For Students",
      description: "Learn how to track your community service hours and manage your volunteer activities effectively.",
      icon: "📚",
      link: "/lessons/students",
      linkedInUrl: "https://www.linkedin.com/in/student",
    },
    {
      title: "For Organizations",
      description: "Discover how to register your organization and manage volunteer opportunities.",
      icon: "🏢",
      link: "/lessons/organizations",
      linkedInUrl: "https://www.linkedin.com/in/organization",
    },
  ];

  return (
    <div className="relative">
     <motion.nav
        className="fixed left-0 right-0 top-0 z-50 bg-white backdrop-blur-sm"
        initial={{ y: 0 }}
        animate={{ y: isNavVisible ? 0 : -100 }}
        transition={{ duration: 0.3 }}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/" className="group relative text-3xl font-bold text-black">
            <span className="relative z-10">Peeper</span>
            <motion.div
              className="absolute -bottom-1 left-0 h-1 rounded-full bg-lime-500"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 0.3 }}
              style={{ originX: 0 }}
            />
          </Link>
          <div className="relative flex items-center gap-4 overflow-hidden rounded-full bg-white px-6 py-2 shadow-lg backdrop-blur-sm">
            <div className="absolute top-1/2 left-0 w-8 h-8 animate-swim">
              <img
                src="images/rubber-ducky.webp"
                alt="Rubber Ducky"
                className="w-full h-full"
              />
            </div>
            <NavLink href="/about">About Us</NavLink>
            <NavLink href="/file:lessons.tsx">How To</NavLink>
            <motion.button
              className="rounded-full bg-black px-6 py-2.5 text-sm font-semibold text-white"
              whileHover={{ scale: 1.05, backgroundColor: "#1a1a1a" }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push(isSignedIn ? "/dashboard" : "/signin")}
            >
              {isSignedIn ? "Dashboard" : "Sign In"}
            </motion.button>
          </div>
        </div>
      </motion.nav>

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
              How to use <span className="text-lime-500">Peeper</span>
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
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
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
            &copy; {new Date().getFullYear()} Peeper. All rights reserved.
          </p>
        </footer>
      </main>
    </div>
  );
};

export default HowToPage;