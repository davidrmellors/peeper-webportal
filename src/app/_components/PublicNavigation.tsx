import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import Image from "next/image";


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

const PublicNavigation = ({ isNavVisible }: { isNavVisible: boolean }) => {
  const router = useRouter();
  const { isSignedIn } = useAuth();

  return (
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
            <Image
              src="/images/rubber-ducky.webp" // Use absolute path
              alt="Rubber Ducky"
              className="w-full h-full"
              width={32}
              height={32}
            />
          </div>
          <NavLink href="/about">About Us</NavLink>
          <NavLink href="/lessons">How To</NavLink>
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
  );
};

export default PublicNavigation;