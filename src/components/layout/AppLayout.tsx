
import { ReactNode } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import AppHeader from "./AppHeader";

interface AppLayoutProps {
  children: ReactNode;
}

const AppLayout = ({ children }: AppLayoutProps) => {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <main className="flex w-full flex-col">
          <AppHeader />
          <div className="flex-1 p-4 lg:p-6">{children}</div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default AppLayout;
