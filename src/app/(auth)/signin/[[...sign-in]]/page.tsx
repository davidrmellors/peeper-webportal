"use client";
import { useState, useEffect } from 'react';
import { useSignIn, useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Navbar from "~/app/_components/PublicNavigation";
import { 
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "../../../_components/input-otp";

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [pendingVerification, setPendingVerification] = useState(false);
  const { isLoaded, signIn, setActive } = useSignIn();
  const { isSignedIn } = useAuth();
  const router = useRouter();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isNavVisible, setIsNavVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');

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

  useEffect(() => {
    if (isSignedIn) {
      router.replace("/dashboard");
    }
  }, [isSignedIn, router]);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsNavVisible(currentScrollY <= 0 || currentScrollY < lastScrollY);
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  if (!isLoaded || isSignedIn) {
    return null;
  }

  const handleSendVerification = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isLoaded || !signIn) return;

    setErrorMessage('');

    try {
      const { supportedFirstFactors } = await signIn.create({
        identifier: email,
      });
      
      if (supportedFirstFactors) {
        const emailCodeFactor = supportedFirstFactors.find(
          (factor) => factor.strategy === "email_code"
        );

        if (emailCodeFactor) {
          await signIn.prepareFirstFactor({
            strategy: "email_code",
            emailAddressId: emailCodeFactor.emailAddressId,
          });
          setPendingVerification(true);
        }
      }
    } catch (err) {
      console.error("Error during sign-in:", err);
      if (err instanceof Error) {
        setErrorMessage(err.message || "An error occurred during sign-in. Please try again.");
      } else {
        console.error("Unknown error:", err);
        setErrorMessage("An unknown error occurred during sign-in. Please try again.");
      }
    }
  };

  const handleVerify = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isLoaded || !signIn) return;

    setErrorMessage('');

    try {
      const result = await signIn.attemptFirstFactor({
        strategy: "email_code",
        code,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        router.push("/dashboard");
      } else {
        console.log("Verification failed", result);
        setErrorMessage("Verification failed. Please try again.");
      }
    } catch (err) {
      console.error("Error:", err);
      if (err instanceof Error) {
        setErrorMessage(err.message || "An error occurred during verification. Please try again.");
      } else {
        console.error("Unknown error:", err);
        setErrorMessage("An unknown error occurred during verification. Please try again.");
      }
    }
  };

  const errorDisplay = errorMessage && (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-red-500 text-sm mt-2 text-center"
    >
      {errorMessage}
    </motion.div>
  );

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-white overflow-hidden px-4 sm:px-6">
      <Navbar isNavVisible={isNavVisible} />
      
      <motion.div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: "radial-gradient(circle at 1px 1px, black 1px, transparent 0)",
          backgroundSize: "50px 50px",
          transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)`,
        }}
        animate={{
          backgroundPosition: `${mousePosition.x * 0.5}px ${mousePosition.y * 0.5}px`,
        }}
        transition={{ type: "spring", stiffness: 75, damping: 15 }}
      />

      <div className="relative z-10 w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">
            <span className="bg-gradient-to-r from-lime-500 to-lime-700 bg-clip-text text-transparent">
              Welcome Back
            </span>
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">
            {pendingVerification 
              ? "Check your email for the verification code" 
              : "Sign in to continue tracking your impact"}
          </p>
        </motion.div>

        {!pendingVerification ? (
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            onSubmit={handleSendVerification}
            className="space-y-6 px-4 sm:px-0"
          >
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 sm:px-6 py-3 sm:py-4 rounded-lg border-2 border-lime-500 bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:border-lime-600 transition-colors text-sm sm:text-base"
                placeholder="Enter your email..."
                required
              />
              {errorDisplay}
            </div>
            <motion.button
              type="submit"
              className="w-full bg-gradient-to-r from-lime-500 to-lime-700 text-white py-3 sm:py-4 rounded-lg font-semibold text-sm sm:text-lg shadow-lg hover:from-lime-600 hover:to-lime-800 transition-all"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Continue with Email
            </motion.button>
          </motion.form>
        ) : (
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            onSubmit={handleVerify}
            className="space-y-6 px-4 sm:px-0"
          >
            <div className="flex justify-center my-8">
              <InputOTP 
                maxLength={6} 
                value={code} 
                onChange={(value) => setCode(value)}
              >
                <InputOTPGroup>
                  <InputOTPSlot className="h-10 w-10 sm:h-14 sm:w-14 text-base sm:text-lg border-2 border-lime-500 rounded-lg" index={0} />
                  <InputOTPSlot className="h-10 w-10 sm:h-14 sm:w-14 text-base sm:text-lg border-2 border-lime-500 rounded-lg" index={1} />
                  <InputOTPSlot className="h-10 w-10 sm:h-14 sm:w-14 text-base sm:text-lg border-2 border-lime-500 rounded-lg" index={2} />
                </InputOTPGroup>
                <InputOTPSeparator />
                <InputOTPGroup>
                  <InputOTPSlot className="h-10 w-10 sm:h-14 sm:w-14 text-base sm:text-lg border-2 border-lime-500 rounded-lg" index={3} />
                  <InputOTPSlot className="h-10 w-10 sm:h-14 sm:w-14 text-base sm:text-lg border-2 border-lime-500 rounded-lg" index={4} />
                  <InputOTPSlot className="h-10 w-10 sm:h-14 sm:w-14 text-base sm:text-lg border-2 border-lime-500 rounded-lg" index={5} />
                </InputOTPGroup>
              </InputOTP>
            </div>
            {errorDisplay}
          </motion.form>
        )}
      </div>
    </div>
  );
}