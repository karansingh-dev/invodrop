import { AuthGuard } from "@/features/(app)/auth-guard";

import SideBar from "@/components/molecules/sidebar";
import Header from "@/components/molecules/header";

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthGuard>
      <div className="flex">
        <SideBar />
        <div className="flex flex-col min-h-screen w-full">
          <Header />
          <main>{children}</main>
        </div>
      </div>
    </AuthGuard>
  );
}
