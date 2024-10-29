"use client";

import { Suspense, useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import PhoneDisplay from "~/app/_components/PhoneModel";
import PageSkeleton from "~/app/_components/PageSkeleton";
import { motion, useScroll, useTransform } from "framer-motion";
import Navbar from "~/app/_components/PublicNavigation";

const charityEmojis = [
  "🤝",
  "💝",
  "🌟",
  "💖",
  "🌈",
  "🕊",
  "🤲",
  "💕",
  "💫",
  "🌍",
  "💞",
  "🌱",
  "🦆",
];

const EmojiConfetti = () => {
  const [emojis, setEmojis] = useState<
    Array<{
      id: number;
      emoji: string;
      style: { [key: string]: string | number };
    }>
  >([]);

  useEffect(() => {
    const createEmoji = () => {
      const newEmojis = [];
      for (let i = 0; i < 50; i++) {
        const randomEmoji =
          charityEmojis[Math.floor(Math.random() * charityEmojis.length)];
        if (randomEmoji) {
          newEmojis.push({
            id: i,
            emoji: randomEmoji,
            style: {
              position: "fixed",
              left: `${Math.random() * 100}vw`,
              top: "-20px",
              transform: `rotate(${Math.random() * 360}deg)`,
              animation: `fall ${2 + Math.random() * 2}s forwards`,
              fontSize: `${20 + Math.random() * 20}px`,
              zIndex: 1000,
            },
          });
        }
      }
      setEmojis(newEmojis);
      setTimeout(() => setEmojis([]), 3000);
    };

    createEmoji();
  }, []);

  return (
    <>
      <style jsx global>{`
        @keyframes fall {
          to {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
      `}</style>
      {emojis.map(({ id, emoji, style }) => (
        <div key={id} style={style as React.CSSProperties}>
          {emoji}
        </div>
      ))}
    </>
  );
};

const FloatingElement = ({
  delay = 0,
  children,
}: {
  delay?: number;
  children: React.ReactNode;
}) => (
  <motion.div
    initial={{ y: 0 }}
    animate={{ y: [-10, 10, -10] }}
    transition={{
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut",
      delay,
    }}
  >
    {children}
  </motion.div>
);

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

const FeatureCard = ({
  icon,
  title,
  description,
}: {
  icon: string;
  title: string;
  description: string;
}) => (
  <motion.div
    className="rounded-xl bg-white p-6 shadow-lg"
    whileHover={{ y: -5, scale: 1.02 }}
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5 }}
  >
    <div className="mb-4 text-4xl">{icon}</div>
    <h3 className="mb-2 text-xl font-bold text-gray-800">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </motion.div>
);

export default function Home() {
  const router = useRouter();
  const { isSignedIn } = useAuth();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const { scrollYProgress } = useScroll();
  const [showConfetti, setShowConfetti] = useState(true);
  const [isNavVisible, setIsNavVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [showPlatformButtons, setShowPlatformButtons] = useState(false);

  const handleStartTrackingClick = () => {
    setShowPlatformButtons(!showPlatformButtons);
  };
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const mouseX = clientX / window.innerWidth;
      const mouseY = clientY / window.innerHeight;
      setMousePosition({
        x: (mouseX - 0.5) * 50,
        y: (mouseY - 0.5) * 50,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsNavVisible(currentScrollY <= 0 || currentScrollY < lastScrollY);
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const handleSignIn = () => {
    if (isSignedIn) {
      router.push("/dashboard");
    } else {
      router.push("/signin");
    }
  };

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

  return (
    <Suspense fallback={<PageSkeleton />}>
      <div className="relative">
        {showConfetti && <EmojiConfetti />}

        {/* Enhanced Navbar with smooth transition */}
        <Navbar isNavVisible={isNavVisible} />

        <main className="pt-[72px]">
          {" "}
          {/* Adjust the padding-top value to match the height of your navbar */}
          <section className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-white">
            {/* Subtle grid pattern */}
            <motion.div
              className="absolute inset-0 opacity-[0.03]"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 1px 1px, black 1px, transparent 0)",
                backgroundSize: "50px 50px",
                transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)`,
              }}
              animate={{
                backgroundPosition: `${mousePosition.x * 0.5}px ${mousePosition.y * 0.5}px`,
              }}
              transition={{ type: "spring", stiffness: 75, damping: 15 }}
            />

            <div className="relative mt-8 flex w-full max-w-7xl flex-col items-center px-4 text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <h1 className="relative z-10 text-7xl font-bold leading-tight">
                  <span className="bg-gradient-to-r from-lime-500 to-lime-700 bg-clip-text text-transparent">
                    Your Impact.
                  </span>
                  <br />
                  Our App.
                </h1>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
              >
                <p className="relative z-10 mt-2 text-3xl font-medium text-transparent">
                  Seamlessly track your community service hours
                  <br />
                  with our powerful app
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.8 }}
              >
                <motion.button
                  className="relative z-10 mt-8 rounded-lg bg-gradient-to-br from-[#334FD7] to-[#283CA6] px-8 py-4 text-lg font-semibold text-white shadow-lg"
                  whileHover={{ scale: 1.05, backgroundColor: "#283CA6" }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSignIn}
                >
                  {isSignedIn ? "Go to Dashboard" : "Get Started"}
                </motion.button>
              </motion.div>

              <div className="pointer-events-none absolute inset-0 mt-16 flex w-full items-center justify-between px-4">
                <motion.div
                  className="pointer-events-auto w-1/3 -translate-x-1/3 -rotate-12 transform"
                  initial={{ opacity: 0, x: -100 }}
                  animate={{ opacity: 1, x: "-33%" }}
                  transition={{ delay: 0.6, duration: 0.8 }}
                >
                  <PhoneDisplay
                    videoPath="/videos/android.mp4"
                    alt="Android App Demo"
                    className="h-auto max-w-full"
                    rotationAngle={25}
                    scale={1.25}
                  />
                </motion.div>

                <motion.div
                  className="pointer-events-auto w-1/3 translate-x-1/3 rotate-12 transform"
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: "33%" }}
                  transition={{ delay: 0.6, duration: 0.8 }}
                >
                  <PhoneDisplay
                    videoPath="/videos/iphone.mp4"
                    alt="iPhone App Demo"
                    className="h-auto max-w-full"
                    rotationAngle={20}
                    scale={1.25}
                  />
                </motion.div>
              </div>

              {/* Stats floating cards */}
              <div className="absolute bottom-20 left-1/2 flex -translate-x-1/2 gap-8">
                <FloatingElement delay={0}>
                  <motion.div
                    className="rounded-xl bg-white/80 p-6 shadow-lg backdrop-blur-sm"
                    whileHover={{ y: -5 }}
                  >
                    <h3 className="bg-gradient-to-br from-[#FCDE39] to-[#D4B72D] bg-clip-text text-4xl font-bold text-transparent">
                      100+
                    </h3>
                    <p className="text-gray-600">Active Users</p>
                  </motion.div>
                </FloatingElement>

                <FloatingElement delay={0.2}>
                  <motion.div
                    className="rounded-xl bg-white/80 p-6 shadow-lg backdrop-blur-sm"
                    whileHover={{ y: -5 }}
                  >
                    <h3 className="bg-gradient-to-br from-[#FE7143] to-[#D65A35] bg-clip-text text-4xl font-bold text-transparent">
                      50K+
                    </h3>
                    <p className="text-gray-600">Hours Tracked</p>
                  </motion.div>
                </FloatingElement>

                <FloatingElement delay={0.4}>
                  <motion.div
                    className="rounded-xl bg-white/80 p-6 shadow-lg backdrop-blur-sm"
                    whileHover={{ y: -5 }}
                  >
                    <h3 className="bg-gradient-to-br from-[#C8B0FF] to-[#A48ED7] bg-clip-text text-4xl font-bold text-transparent">
                      100+
                    </h3>
                    <p className="text-gray-600">Organizations</p>
                  </motion.div>
                </FloatingElement>
              </div>
            </div>
          </section>
          {/* Enhanced second section */}
          <motion.section
            className="relative z-20 flex min-h-screen w-full flex-col items-center justify-center overflow-hidden rounded-tl-[50px] rounded-tr-[50px] bg-gradient-to-b from-lime-500 to-lime-700 text-white"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="container mx-auto max-w-7xl px-4 py-16">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mb-16 text-center"
              >
                <h2 className="mb-6 text-5xl font-extrabold tracking-tight sm:text-[5rem]">
                  Making Impact Visible
                </h2>
                <p className="mx-auto max-w-3xl text-xl">
                  Transform your community service journey with powerful
                  tracking tools and meaningful insights
                </p>
              </motion.div>

              <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
                <FeatureCard
                  icon="🧭"
                  title="Live Tracking"
                  description="Track your community service live. Wherever. Whenever."
                />
                <FeatureCard
                  icon="✨"
                  title="Add your Own"
                  description="Don't have your chosen organisation? Feel free to add it! "
                />
                <FeatureCard
                  icon="💪"
                  title="Community Connect"
                  description="You now have verified documentation confirming your participation in the required community service program"
                />
              </div>

              <motion.div
                className="mt-16 text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <motion.button
                  className="rounded-full bg-white px-8 py-4 text-lg font-bold text-lime-600 shadow-lg"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleStartTrackingClick}
                >
                  Start Tracking Now
                </motion.button>

                {showPlatformButtons && (
                  <div className="mt-4 flex justify-center gap-4">
                    <motion.button
                      className="rounded-full bg-lime-600 px-6 py-2 text-sm font-semibold text-white shadow-lg"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() =>
                        (window.location.href = "https://play.google.com/store")
                      }
                    >
                      Android
                    </motion.button>
                    <motion.button
                      className="rounded-full bg-lime-600 px-6 py-2 text-sm font-semibold text-white shadow-lg"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() =>
                        (window.location.href =
                          "https://www.apple.com/app-store")
                      }
                    >
                      iOS
                    </motion.button>
                  </div>
                )}
              </motion.div>
            </div>
          </motion.section>
          {/* Enhanced third section */}
          <section className="relative flex min-h-screen w-full flex-col items-center justify-center bg-white text-gray-800">
            <div className="container mx-auto max-w-7xl px-4 py-16">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mb-16 text-center"
              >
                <h2 className="mb-6 text-4xl font-bold">
                  Join Our Growing Community
                </h2>
                <p className="mx-auto max-w-3xl text-xl text-gray-600">
                  Contribute to your community, monitor your impact, and see the
                  difference you make. Every step you take brings positive
                  change!
                </p>
              </motion.div>

              <div className="mt-12 grid grid-cols-1 gap-12 md:grid-cols-2">
                <motion.div
                  className="relative"
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                >
                  <div className="aspect-video rounded-2xl bg-[linear-gradient(135deg,#D9E7FF,#B8CCF0)] p-1">
                    <div className="h-full w-full rounded-2xl bg-white p-6">
                      <h3 className="mb-4 text-2xl font-bold">For Students</h3>
                      <ul className="space-y-4">
                        <li className="flex items-center">
                          <span className="mr-2">✨</span>
                          Track hours automatically
                        </li>
                        <li className="flex items-center">
                          <span className="mr-2">📱</span>
                          Mobile-friendly interface
                        </li>
                        <li className="flex items-center">
                          <span className="mr-2">🏆</span>
                          Meet your goals.
                        </li>
                        <li className="flex items-center">
                          <span className="mr-2">✅</span>
                          Instant Validation
                        </li>
                        <li className="flex items-center">
                          <span className="mr-2">📚</span>
                          Resource Library
                        </li>
                        <li className="flex items-center">
                          <span className="mr-2">💡</span>
                          Progress Tracking
                        </li>
                      </ul>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  className="relative"
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                >
                  <div className="aspect-video rounded-2xl bg-[linear-gradient(135deg,#B8CCF0,#B8CCF0)] p-1">
                    <div className="h-full w-full rounded-2xl bg-white p-6">
                      <h3 className="mb-4 text-2xl font-bold">For Lecturers</h3>
                      <ul className="space-y-4">
                        <li className="flex items-center">
                          <span className="mr-2">📊</span>
                          Detailed Dashboard
                        </li>
                        <li className="flex items-center">
                          <span className="mr-2">👥</span>
                          Manage your Students
                        </li>
                        <li className="flex items-center">
                          <span className="mr-2">📢</span>
                          Less Emails
                        </li>
                        <li className="flex items-center">
                          <span className="mr-2">📄</span>
                          Automated Reports
                        </li>
                        <li className="flex items-center">
                          <span className="mr-2">🛡</span>
                          Secure Record Keeping
                        </li>
                        <li className="flex items-center">
                          <span className="mr-2">✅</span>
                          Simplified Attendance Verification
                        </li>
                      </ul>
                    </div>
                  </div>
                </motion.div>
              </div>

              <motion.div
                className="mt-16 text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <motion.button
                  className="inline-block rounded-lg bg-gradient-to-br from-[#334FD7] to-[#283CA6] px-8 py-4 text-xl font-semibold text-white transition-colors hover:from-[#283CA6] hover:to-[#1a1a1a]"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSignIn}
                >
                  Get Started Today
                </motion.button>
              </motion.div>
            </div>
          </section>
          <footer className="flex w-full items-center justify-center rounded-tl-[50px] rounded-tr-[50px] bg-gradient-to-b from-lime-500 to-lime-700 py-8">
            <p className="text-center text-white">
              &copy; {new Date().getFullYear()} Peeper. All rights reserved.
            </p>
          </footer>
        </main>
      </div>
    </Suspense>
  );
}
