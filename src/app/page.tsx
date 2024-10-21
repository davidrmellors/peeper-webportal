import { auth } from "@clerk/nextjs/server";
import AdminDashboard from './(admin)/page';
import PublicHome from './_components/PublicHome';

export default function Home() {
  const { userId } = auth();

  if (userId) {
    return <AdminDashboard />;
  }

  return <PublicHome />;
}