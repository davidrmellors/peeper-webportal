'use client';

import { useState, useEffect } from 'react';
import { useSignIn, useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { EmailCodeFactor } from "@clerk/types";

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [pendingVerification, setPendingVerification] = useState(false);
  const { isLoaded, signIn, setActive } = useSignIn();
  const { isSignedIn } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isSignedIn) {
      router.push("/");
    }
  }, [isSignedIn, router]);

  const handleSendVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded || !signIn) return;

    try {
      const { supportedFirstFactors } = await signIn.create({
        identifier: email,
      });
      
      if (supportedFirstFactors) {
        const emailCodeFactor = supportedFirstFactors.find(
          (factor): factor is EmailCodeFactor => factor.strategy === "email_code"
        );

      if (emailCodeFactor) {
        await signIn.prepareFirstFactor({
          strategy: "email_code",
          emailAddressId: emailCodeFactor.emailAddressId,
        });
        setPendingVerification(true);
      } else {
        throw new Error("Email code factor not found");
        }
      }
    } catch (err: any) {
      console.error("Error during sign-in:", err);
      alert(err.errors?.[0]?.message || "An error occurred during sign-in. Please try again.");
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded || !signIn) return;

    try {
      const result = await signIn.attemptFirstFactor({
        strategy: "email_code",
        code,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        router.push("/admin"); // Replace with your main authenticated route
      } else {
        console.log("Verification failed", result);
        alert("Verification failed. Please try again.");
      }
    } catch (err: any) {
      console.error("Error:", err);
      alert(err.errors?.[0]?.message || "An error occurred during verification. Please try again.");
    }
  };

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-white text-2xl font-semibold mb-2">
        {pendingVerification ? "Your OTP Awaits! Enter It Below!" : "Keep Making Change"}
      </h2>
      {!pendingVerification ? (
        <form onSubmit={handleSendVerification} className="w-full max-w-md">
          <div className="mb-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 rounded-full bg-white bg-opacity-20 text-white placeholder-white"
              placeholder="Login with your email"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-white text-lime-500 py-2 rounded-full font-semibold text-xl"
          >
            Login
          </button>
        </form>
      ) : (
        <form onSubmit={handleVerify} className="w-full max-w-md">
          <div className="mb-4">
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full px-4 py-2 rounded-full bg-white bg-opacity-20 text-white placeholder-white"
              placeholder="Enter 6-digit code"
              required
              maxLength={6}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-white text-lime-500 py-2 rounded-full font-semibold text-xl"
          >
            Verify Email
          </button>
        </form>
      )}
    </div>
  );
}