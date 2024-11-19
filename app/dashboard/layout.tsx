import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import SideMenu from "../components/fixed/SideMenu/SideMenu";
import { Toaster } from "@/components/ui/toaster";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen">
      <SidebarProvider>
        <SideMenu />
        <main className="flex-1 p-4">
          <SidebarTrigger />
          {children}
        </main>
      </SidebarProvider>{" "}
      <Toaster />
    </div>
  );
}
