/**
 * Student Lessons Page Component
 * 
 * Provides an interactive learning interface for students using the platform.
 * Key features:
 * - Consistent color scheme with main application
 * - Interactive sidebar navigation
 * - Progressive learning modules covering:
 *   - Account setup and onboarding
 *   - Hour tracking process
 *   - Project management
 *   - Verification workflow
 * 
 * Uses Framer Motion for smooth animations and transitions
 */
"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import Navbar from "~/app/_components/PublicNavigation";


const colors = [
  "#334FD7", // royal blue
  "#EA4B4B", // red
  "#FE7143", // orange
  "#D9E7FF", // light blue
  "#466D57", // dark green
  "#C8B0FF", // purple
  "#FCDE39", // yellow
  "#A4DB51", // lime green
  "#8EAB48", // light green
];


// Lesson content data
const lessons = [
  {
    id: 1,
    title: "Getting Started",
    emoji: "🚀",
    content: `
      <h2 class="text-2xl font-bold mb-4">Welcome to Peeper!</h2>
      <p class="mb-4">Let's get you started with the basics of using our platform...</p>
      <h3 class="text-xl font-semibold mb-3">First Steps:</h3>
      <ul class="list-disc pl-6 mb-4">
        <li>Create your account</li>
        <li>Complete your profile</li>
        <li>Connect with your organization</li>
      </ul>
    `
  },
  {
    id: 2,
    title: "Tracking Hours",
    emoji: "⏱️",
    content: `
      <h2 class="text-2xl font-bold mb-4">How to Track Your Service Hours</h2>
      <p class="mb-4">Recording your community service hours is simple and straightforward...</p>
      <h3 class="text-xl font-semibold mb-3">Steps to log hours:</h3>
      <ol class="list-decimal pl-6 mb-4">
        <li>Navigate to the Dashboard</li>
        <li>Click "Log Hours"</li>
        <li>Fill in the required information</li>
        <li>Submit for approval</li>
      </ol>
    `
  },
  {
    id: 3,
    title: "Managing Projects",
    emoji: "📋",
    content: `
      <h2 class="text-2xl font-bold mb-4">Creating and Managing Projects</h2>
      <p class="mb-4">Learn how to organize your service activities into projects...</p>
      <h3 class="text-xl font-semibold mb-3">Project Management Features:</h3>
      <ul class="list-disc pl-6 mb-4">
        <li>Create new projects</li>
        <li>Set goals and milestones</li>
        <li>Track team progress</li>
        <li>Generate reports</li>
      </ul>
    `
  },
  {
    id: 4,
    title: "Verification Process",
    emoji: "✅",
    content: `
      <h2 class="text-2xl font-bold mb-4">Understanding the Verification Process</h2>
      <p class="mb-4">Learn about how hours are verified and approved...</p>
      <h3 class="text-xl font-semibold mb-3">Verification Steps:</h3>
      <ol class="list-decimal pl-6 mb-4">
        <li>Submit your hours</li>
        <li>Supervisor review</li>
        <li>Approval process</li>
        <li>Confirmation and recording</li>
      </ol>
    `
  }
];

const LessonSidebar = ({ 
  activeLesson, 
  setActiveLesson 
}: { 
  activeLesson: number;
  setActiveLesson: (id: number) => void;
}) => (
  <div className="w-64 h-full bg-white shadow-lg rounded-lg p-4">
    <h2 className="text-xl font-bold mb-4 text-gray-800">Lessons</h2>
    <div className="space-y-2">
      {lessons.map((lesson, index) => (
        <motion.button
          key={lesson.id}
          className={`w-full text-left p-3 rounded-lg flex items-center space-x-3 ${
            activeLesson === lesson.id
              ? "text-white"
              : "hover:bg-lime-50 text-gray-700"
          }`}
          style={{
            backgroundColor: activeLesson === lesson.id ? colors[index % colors.length] : "transparent",
          }}
          onClick={() => setActiveLesson(lesson.id)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <span className="text-xl">{lesson.emoji}</span>
          <span className="font-medium">{lesson.title}</span>
        </motion.button>
      ))}
    </div>
  </div>
);
const LessonContent = ({ lessonId }: { lessonId: number }) => {
  const lesson = lessons.find((l) => l.id === lessonId);
  if (!lesson) return null;

  return (
    <motion.div
      key={lesson.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white shadow-lg rounded-lg p-8"
    >
      <div dangerouslySetInnerHTML={{ __html: lesson.content }} />
    </motion.div>
  );
};

const LessonsPage = () => {
  const [isNavVisible, setIsNavVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [activeLesson, setActiveLesson] = useState(1);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsNavVisible(currentScrollY <= 0 || currentScrollY < lastScrollY);
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <div className="relative">
      {/* Navigation */}
      <Navbar isNavVisible={isNavVisible} />

      {/* Main Content */}
      <main className="pt-[72px] min-h-screen bg-gray-50">
        <div className="container mx-auto max-w-7xl px-4 py-8">
          <motion.h1
            className="text-4xl font-bold text-gray-800 mb-8 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            How To Use <span className="text-lime-500">Peeper</span>
          </motion.h1>
          
          <div className="flex gap-8">
            <LessonSidebar 
              activeLesson={activeLesson} 
              setActiveLesson={setActiveLesson} 
            />
            <div className="flex-1">
              <LessonContent lessonId={activeLesson} />
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="flex w-full items-center justify-center bg-gradient-to-b from-lime-500 to-lime-700 py-8">
        <p className="text-center text-white">
          &copy; {new Date().getFullYear()} Peeper. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default LessonsPage;