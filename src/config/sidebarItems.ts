// config/sidebarItems.js
import {
  BadgePercent,
  Briefcase,
  ChefHat,
  GalleryHorizontalEnd,
  Home,
  LayoutGrid,
  LineChart,
  Ratio,
  Salad,
  Store,
  TvMinimal,
  Users,
} from "lucide-react";

export const sidebarItems = [
  { href: "/", label: "Dashboard", icon: Home, isActive: true },
  { href: "/orders", label: "Live Orders", icon: GalleryHorizontalEnd },
  { href: "/table", label: "Tables", icon: Ratio },
  { href: "/pos", label: "POS", icon: TvMinimal },
  { href: "/kds", label: "KDS", icon: ChefHat },
  { href: "/orders/all", label: "Orders", icon: LayoutGrid },
  { href: "/menu", label: "Menu", icon: Salad },
  { href: "/offers", label: "Offers", icon: BadgePercent },
  { href: "/restaurant", label: "Outlet", icon: Store },
  {
    href: "/staff",
    label: "Staff",
    icon: Users,
  },
  {
    href: "#",
    label: "Marketing",
    icon: Briefcase,
    badge: "Coming Soon",
  },
  {
    href: "#",
    label: "Customers",
    icon: Users,
    badge: "Coming Soon",
  },
  { href: "/finance", label: "Finance", icon: LineChart },
];
