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
        <li>Sign in with your approved Admin Account by entering your email address</li>
        <li>Check your email for a verification code and enter it to confirm your account</li>
        <li>Navigate to the Dashboard</li>
      </ul>
    `
  },
  {
    id: 2,
    title: "Managing Students",
    emoji: "👨‍🎓",
    content: `
      <h2 class="text-2xl font-bold mb-4">How to Manage Students</h2>
      <p class="mb-4">Adding and managing students is simple and straightforward...</p>
      <h3 class="text-xl font-semibold mb-3">Steps to add students:</h3>
      <ol class="list-decimal pl-6 mb-4">
        <li>Navigate to the Dashboard</li>
        <li>Click "Manage Students"</li>
        <li>Add new students by entering their email address or uploading a CSV file with their student numbers</li>
        <li>Edit or delete students by clicking the corresponding button</li>
      </ol>
    `
  },
  {
    id: 3,
    title: "Managing Organisations",
    emoji: "🏢",
    content: `
      <h2 class="text-2xl font-bold mb-4">Creating and Managing Organisations</h2>
      <p class="mb-4">Learn how to manage organisations...</p>
      <h3 class="text-xl font-semibold mb-3">Steps to add organisations:</h3>
      <ul class="list-disc pl-6 mb-4">
        <li>Navigate to the Dashboard</li>
        <li>Click "Manage Organisations"</li>
        <li>You will see a list of organisations as well as organisation requests</li>
        <li>Click "View" to view the organisation details</li>
        <li>Click "Approve" to approve the organisation request</li>
        <li>Click "Reject" to reject the organisation request</li>
        <li>This will add the organisation to the list of organisations and send an email to the students who applied</li>
      </ul>
    `
  },
  {
    id: 4,
    title: "Generating Reports",
    emoji: "📊",
    content: `
      <h2 class="text-2xl font-bold mb-4">Understanding the Verification Process</h2>
      <p class="mb-4">Learn how to generate reports...</p>
      <h3 class="text-xl font-semibold mb-3">Steps to generate reports:</h3>
      <ol class="list-decimal pl-6 mb-4">
        <li>Select the students you want to generate a report for</li>
        <li>Click the "Manage" button</li>
        <li>Click the "Generate Report" button</li>
        <li>Select the file type you want to generate the report in</li>
        <li>Click the "Generate" button</li>
        <li>This will generate a report for the selected students and download it to your device</li>
        <li>NB: The report generation may take a while depending on the number of students</li>
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