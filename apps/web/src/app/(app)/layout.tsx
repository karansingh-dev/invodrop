import { AuthGuard } from "@/features/(app)/auth-guard";
import { AppSidebar } from "@/components/molecules/app-sidebar"
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar"
import Header from "@/components/molecules/header";

export default function AppLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {


    return (
        <AuthGuard>

            <SidebarProvider>
                <AppSidebar />
                <SidebarInset>
                    <div className="flex flex-col min-h-screen">
                        <Header />
                        <main className="flex-1 overflow-y-auto py-4">{children}</main>
                    </div>
                </SidebarInset>
            </SidebarProvider>

        </AuthGuard>


    );
}
