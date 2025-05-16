
'use client';

import { Link, usePathname, useRouter } from 'next-intl/navigation';
import {
  LayoutDashboard,
  Database,
  UploadCloud,
  Settings,
  LifeBuoy,
  Power,
  Users,
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
} from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';
import { useTranslations } from 'next-intl';

export default function AppSidebar() {
  const pathname = usePathname(); // This will be the path without the locale, e.g., /dashboard
  const t = useTranslations('AppSidebar');

  const navItems = [
    { href: '/', label: t('dashboard'), icon: LayoutDashboard },
    { href: '/manage-data', label: t('manageData'), icon: Database },
    { href: '/upload-items', label: t('uploadItems'), icon: UploadCloud },
    { href: '/settings/users', label: t('userManagement'), icon: Users },
  ];
  
  const bottomNavItems = [
    { href: '/settings', label: t('settings'), icon: Settings },
    { href: '/support', label: t('support'), icon: LifeBuoy },
  ];

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="p-4">
        {/* Optional: Logo or App Name can go here if not in header for collapsed state */}
      </SidebarHeader>
      <SidebarContent className="flex-grow">
        <SidebarMenu>
          {navItems.map((item) => {
             // For active state, pathname from next-intl/client doesn't include locale.
            // So, '/settings/users' will match if item.href is '/settings/users'.
            const isUserManagementLink = item.href === '/settings/users';
            const isLinkActive = isUserManagementLink
              ? pathname.startsWith(item.href) 
              : pathname === item.href;

            return (
              <SidebarMenuItem key={item.href}>
                <Link href={item.href} passHref legacyBehavior={false}>
                  <SidebarMenuButton
                    asChild
                    isActive={isLinkActive}
                    tooltip={{ children: item.label, side: 'right', align: 'center' }}
                    className={cn(
                      'w-full justify-start',
                      isLinkActive && 'bg-sidebar-accent text-sidebar-accent-foreground'
                    )}
                  >
                    <> {/* Ensure SidebarMenuButton receives a single child when asChild is true */}
                      <item.icon className="h-5 w-5" />
                      <span className="group-data-[collapsible=icon]:hidden">{item.label}</span>
                    </>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <SidebarSeparator />
        <SidebarMenu>
          {bottomNavItems.map((item) => {
            const isSettingsLink = item.href === '/settings';
             // pathname from next-intl/client is unlocalized
            const isLinkActive = isSettingsLink
              ? (pathname === item.href || (pathname.startsWith(item.href + '/') && !pathname.startsWith('/settings/users')))
              : pathname === item.href; 

            return (
               <SidebarMenuItem key={item.href}>
                 <Link href={item.href} passHref legacyBehavior={false}>
                    <SidebarMenuButton
                      asChild
                      isActive={isLinkActive}
                      tooltip={{ children: item.label, side: 'right', align: 'center' }}
                      className={cn(
                        'w-full justify-start',
                        isLinkActive && 'bg-sidebar-accent text-sidebar-accent-foreground'
                      )}
                    >
                      <>
                        <item.icon className="h-5 w-5" />
                        <span className="group-data-[collapsible=icon]:hidden">{item.label}</span>
                      </>
                    </SidebarMenuButton>
                 </Link>
               </SidebarMenuItem>
            );
          })}
          <SidebarMenuItem>
             <Link href="/logout" passHref legacyBehavior={false}> {/* Assuming /logout is not a localized route or handled differently */}
                <SidebarMenuButton
                  asChild
                  tooltip={{ children: t('logout'), side: 'right', align: 'center' }}
                  className="w-full justify-start hover:bg-destructive/20"
                >
                  <>
                    <Power className="h-5 w-5 text-destructive" />
                    <span className="group-data-[collapsible=icon]:hidden text-destructive">{t('logout')}</span>
                  </>
                </SidebarMenuButton>
             </Link>
           </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
