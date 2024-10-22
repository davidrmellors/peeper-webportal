'use client';

import { useState, useEffect } from 'react';
import { useSignIn, useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { EmailCodeFactor } from "@clerk/types";
import { 
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot, } from "../../../_components/input-otp";

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [pendingVerification, setPendingVerification] = useState(false);
  const { isLoaded, signIn, setActive } = useSignIn();
  const { isSignedIn } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isSignedIn) {
      router.replace("/dashboard");
    }
  }, [isSignedIn, router]);

  if (!isLoaded || isSignedIn) {
    return null; // or return a loading spinner
  }

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
        router.push("/dashboard"); // Replace with your main authenticated route
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
      <h2 className="text-white text-2xl mt-20 font-rany font-semibold mb-2">
        {pendingVerification ? "Your OTP Awaits! Enter It Below!" : ""}
      </h2>
      {!pendingVerification ? (
        <form onSubmit={handleSendVerification} className="w-full max-w-md">
          <div className="mb-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-0 rounded-xl border-2 border-white h-16 bg-transparent text-white placeholder-white"
              placeholder="Email..."
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-white text-lime-500 py-2 rounded-md h-16 font-semibold text-xl"
          >
            LOGIN
          </button>
        </form>
      ) : (
        <form onSubmit={handleVerify} className="w-full max-w-md">
          <div className="mb-4 flex justify-center my-10 h-14 ">
          <InputOTP maxLength={6} height={100} color='white' value={code} onChange={(value) => setCode(value)}>
            <InputOTPGroup >
              <InputOTPSlot className='h-14 w-14 text-lg' index={0} />
              <InputOTPSlot className='h-14 w-14 text-lg' index={1} />
              <InputOTPSlot className='h-14 w-14 text-lg' index={2} />
            </InputOTPGroup>
            <InputOTPSeparator />
            <InputOTPGroup>
              <InputOTPSlot className='h-14 w-14 text-lg' index={3} />
              <InputOTPSlot className='h-14 w-14 text-lg' index={4} />
              <InputOTPSlot className='h-14 w-14 text-lg' index={5} />
            </InputOTPGroup>
          </InputOTP>
          </div>
          <button
            type="submit"
            className="w-full mt-10 bg-white text-lime-500 py-2 rounded-md h-16 font-semibold text-xl"
          >
            Verify Email
          </button>
        </form>
      )}
    </div>
  );
}
