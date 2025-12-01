import SideBar from "@/components/atoms/sidebar";
import Topbar from "@/components/atoms/topbar";
import { ProtectedRoute } from "@/components/auth/protected-route";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      <div className="h-screen w-screen overflow-hidden flex bg-background">
        {/* Sidebar  */}
        <div className="h-full sticky left-0 top-0">
          <SideBar />
        </div>

        {/* Right side */}
        <div className="flex flex-col flex-1 h-full">
          {/* Topbar  */}
          <div className="sticky top-0 z-50">
            <Topbar />
          </div>

          {/* Scrollable content */}
          <div className="flex-1 overflow-y-auto p-8">{children}</div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
