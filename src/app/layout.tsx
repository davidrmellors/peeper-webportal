import "~/styles/globals.css";
import { ClerkProvider, SignedIn, SignedOut } from '@clerk/nextjs'
import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import { TRPCReactProvider } from "~/trpc/react";
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

export const metadata: Metadata = {
  title: "Lekka Academy",
  description: "Community Service Tracking",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ClerkProvider>
      <html lang="en" className={`${GeistSans.variable}`}>
        <body>
          <TRPCReactProvider>
            {children}
            <ReactQueryDevtools initialIsOpen={false} />
          </TRPCReactProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
