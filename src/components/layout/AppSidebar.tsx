"use client";
import { ReactNode } from "react";

import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  ClipboardList,
  SprayCan,
  Calendar,
  Users,
  User,
  Settings,
  ChevronRight,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Logo from "@/components/shared/Logo";
import Link from "next/link";

interface NavItemProps {
  to: string;
  icon: ReactNode;
  children: ReactNode;
  active?: boolean;
}

const NavItem = ({ to, icon, children, active }: NavItemProps) => (
  <SidebarMenuItem>
    <SidebarMenuButton asChild className={active ? "bg-sidebar-accent" : ""}>
      <Link href={to} className="flex items-center gap-2">
        {icon}
        <span>{children}</span>
      </Link>
    </SidebarMenuButton>
  </SidebarMenuItem>
);

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar className="border-r">
      <SidebarHeader className="flex items-center justify-center border-b pb-4 pt-5">
        <Link href="/">
          <Logo />
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent className="px-2">
            <SidebarMenu>
              <NavItem
                to="/"
                icon={<LayoutDashboard size={20} />}
                active={pathname === "/"}
              >
                Dashboard
              </NavItem>
              <NavItem
                to="/services"
                icon={<SprayCan size={20} />}
                active={pathname.startsWith("/services")}
              >
                Services
              </NavItem>
              <NavItem
                to="/bookings"
                icon={<Calendar size={20} />}
                active={pathname.startsWith("/bookings")}
              >
                Bookings
              </NavItem>
              <NavItem
                to="/captains"
                icon={<User size={20} />}
                active={pathname.startsWith("/captains")}
              >
                Captains
              </NavItem>
              <NavItem
                to="/customers"
                icon={<Users size={20} />}
                active={pathname.startsWith("/customers")}
              >
                Customers
              </NavItem>
              <NavItem
                to="/jobs"
                icon={<ClipboardList size={20} />}
                active={pathname.startsWith("/jobs")}
              >
                Today&apos;s Jobs
              </NavItem>
              <NavItem
                to="/settings"
                icon={<Settings size={20} />}
                active={pathname.startsWith("/settings")}
              >
                Settings
              </NavItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="mt-auto border-t p-4">
        <Button variant="ghost" className="w-full justify-start gap-2 px-2">
          <LogOut size={20} />
          Log Out
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
