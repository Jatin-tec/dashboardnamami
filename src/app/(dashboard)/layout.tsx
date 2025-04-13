import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import AppHeader from "@/components/layout/AppHeader";
import { getSelectedCity } from "@/lib/common/city";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const selectedCity = await getSelectedCity();

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <main className="flex w-full flex-col">
          <AppHeader selectedCity={selectedCity} />
          <div className="flex-1 p-4 lg:p-6">{children}</div>
        </main>
      </div>
    </SidebarProvider>
  );
}
