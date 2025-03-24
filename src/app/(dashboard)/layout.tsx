import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import AppHeader from "@/components/layout/AppHeader";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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
}
