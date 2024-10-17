import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../../styles/globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Keep Making Change",
  description: "Login to Keep Making Change",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex min-h-screen">
          <div className="flex-1 bg-gray-100 flex justify-center items-center">
            <div className="w-24 h-24 border-4 border-white transform rotate-45"></div>
          </div>
          <div className="flex-1 bg-lime-500 p-10 flex flex-col justify-center">
            <h1 className="text-white text-5xl font-bold mb-10">
              KEEP<br/>MAKING<br/>CHANGE
            </h1>
            <form className="flex flex-col">
              <p className="text-white mb-2">Login with your email</p>
              <input 
                type="email" 
                placeholder="Email.." 
                className="p-2 mb-4 rounded"
              />
              <button 
                type="submit" 
                className="bg-white text-lime-500 p-2 rounded text-lg font-semibold"
              >
                LOGIN
              </button>
            </form>
          </div>
        </div>
        {children}
      </body>
    </html>
  );
}   