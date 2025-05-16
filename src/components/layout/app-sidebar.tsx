'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Database,
  UploadCloud,
  Settings,
  LifeBuoy,
  Power,
} from 'lucide-react';
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarSeparator,
} from '@/components/ui/sidebar'; // Adjusted to use new Sidebar component structure
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/manage-data', label: 'Manage Data', icon: Database },
  { href: '/upload-items', label: 'Upload Items', icon: UploadCloud },
];

const bottomNavItems = [
  { href: '/settings', label: 'Settings', icon: Settings },
  { href: '/support', label: 'Support', icon: LifeBuoy },
];

export default function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="p-4">
        {/* Optional: Logo or App Name can go here if not in header for collapsed state */}
        {/* <h1 className="text-lg font-semibold text-sidebar-primary group-data-[collapsible=icon]:hidden">Admin</h1> */}
      </SidebarHeader>
      <SidebarContent className="flex-grow">
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <Link href={item.href} legacyBehavior passHref>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === item.href}
                  tooltip={{ children: item.label, side: 'right', align: 'center' }}
                  className={cn(
                    'w-full justify-start',
                    pathname === item.href && 'bg-sidebar-accent text-sidebar-accent-foreground'
                  )}
                >
                  <a>
                    <item.icon className="h-5 w-5" />
                    <span className="group-data-[collapsible=icon]:hidden">{item.label}</span>
                  </a>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <SidebarSeparator />
        <SidebarMenu>
          {bottomNavItems.map((item) => (
             <SidebarMenuItem key={item.href}>
               <Link href={item.href} legacyBehavior passHref>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.href}
                    tooltip={{ children: item.label, side: 'right', align: 'center' }}
                    className={cn(
                    'w-full justify-start',
                    pathname === item.href && 'bg-sidebar-accent text-sidebar-accent-foreground'
                  )}
                  >
                    <a>
                      <item.icon className="h-5 w-5" />
                      <span className="group-data-[collapsible=icon]:hidden">{item.label}</span>
                    </a>
                  </SidebarMenuButton>
               </Link>
             </SidebarMenuItem>
          ))}
          <SidebarMenuItem>
             <Link href="/logout" legacyBehavior passHref>
                <SidebarMenuButton
                  asChild
                  tooltip={{ children: "Logout", side: 'right', align: 'center' }}
                  className="w-full justify-start hover:bg-destructive/20"
                >
                  <a>
                    <Power className="h-5 w-5 text-destructive" />
                    <span className="group-data-[collapsible=icon]:hidden text-destructive">Logout</span>
                  </a>
                </SidebarMenuButton>
             </Link>
           </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
