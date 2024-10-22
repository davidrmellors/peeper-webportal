import Link from "next/link";
import { Suspense } from "react";
import PageSkeleton from "~/app/_components/PageSkeleton";

export default function Home() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-lime-500 to-lime-700 text-white">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
            Welcome to <span className="text-white">Lekka Academy</span>
          </h1>
          <p className="text-2xl text-center">
            Community Service Tracking Portal
          </p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-8">
            <Link
              className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 hover:bg-white/20"
              href="/signin"
            >
              <h3 className="text-2xl font-bold">Sign In →</h3>
              <div className="text-lg">
                Access your account to manage community service hours.
              </div>
            </Link>
            <Link
              className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 hover:bg-white/20"
              href="/about"
            >
              <h3 className="text-2xl font-bold">About Us →</h3>
              <div className="text-lg">
                Learn more about Lekka Academy and our community service program.
              </div>
            </Link>
          </div>
        </div>
      </main>
    </Suspense>
  );
}