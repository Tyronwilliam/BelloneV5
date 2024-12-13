import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/toaster";
import SideMenu from "../components/fixed/SideMenu/SideMenu";
import QueryProvider from "../QueryProvider";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen">
      <QueryProvider>
        <SidebarProvider>
          <SideMenu />
          <main className="flex-1 p-4">
            <SidebarTrigger />
            {children}
          </main>
        </SidebarProvider>{" "}
        <Toaster />{" "}
      </QueryProvider>
    </div>
  );
}
