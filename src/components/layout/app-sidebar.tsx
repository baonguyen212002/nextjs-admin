'use client';

import Link from 'next/link';
import { usePathname as useNextPathname } from 'next/navigation';
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
import { NextIntlClientProvider, useTranslations } from 'next-intl';

export default function AppSidebar({ messages, locale }) {
  // Fallback an toàn
  if (!messages || !locale) {
    console.error('Missing messages or locale in AppSidebar');
    return null;
  }

  const nextPathname = useNextPathname();

  // Loại bỏ prefix locale khỏi path
  const removeLocaleFromPathname = (path, loc) => {
    const localePrefix = `/${loc}`;
    return path.startsWith(localePrefix) ? path.slice(localePrefix.length) || '/' : path;
  };

  const pathname = removeLocaleFromPathname(nextPathname, locale);

  const navItems = [
    { href: '/', labelKey: 'dashboard', icon: LayoutDashboard },
    { href: '/manage-data', labelKey: 'manageData', icon: Database },
    { href: '/upload-items', labelKey: 'uploadItems', icon: UploadCloud },
    { href: '/settings/users', labelKey: 'userManagement', icon: Users },
  ];

  const bottomNavItems = [
    { href: '/settings', labelKey: 'settings', icon: Settings },
    { href: '/support', labelKey: 'support', icon: LifeBuoy },
  ];

  const localizeHref = (href) => `/${locale}${href === '/' ? '' : href}`;

  return (
    <NextIntlClientProvider messages={messages} locale={locale}>
      <AppSidebarContent
        navItems={navItems}
        bottomNavItems={bottomNavItems}
        pathname={pathname}
        localizeHref={localizeHref}
      />
    </NextIntlClientProvider>
  );
}

function AppSidebarContent({ navItems, bottomNavItems, pathname, localizeHref }) {
  const t = useTranslations('AppSidebar');

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="p-4">
        {/* Optional logo or app name */}
      </SidebarHeader>
      <SidebarContent className="flex-grow">
        <SidebarMenu>
          {navItems.map((item) => {
            const isUserManagement = item.href === '/settings/users';
            const isActive = isUserManagement ? pathname.startsWith(item.href) : pathname === item.href;

            return (
              <SidebarMenuItem key={item.href}>
                <Link href={localizeHref(item.href)}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive}
                    tooltip={{ children: t(item.labelKey), side: 'right', align: 'center' }}
                    className={cn(
                      'w-full justify-start',
                      isActive && 'bg-sidebar-accent text-sidebar-accent-foreground'
                    )}
                  >
                    <>
                      <item.icon className="h-5 w-5" />
                      <span className="group-data-[collapsible=icon]:hidden">
                        {t(item.labelKey)}
                      </span>
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
            const isSettings = item.href === '/settings';
            const isActive = isSettings
              ? (pathname === item.href ||
                  (pathname.startsWith(item.href + '/') && !pathname.startsWith('/settings/users')))
              : pathname === item.href;

            return (
              <SidebarMenuItem key={item.href}>
                <Link href={localizeHref(item.href)}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive}
                    tooltip={{ children: t(item.labelKey), side: 'right', align: 'center' }}
                    className={cn(
                      'w-full justify-start',
                      isActive && 'bg-sidebar-accent text-sidebar-accent-foreground'
                    )}
                  >
                    <>
                      <item.icon className="h-5 w-5" />
                      <span className="group-data-[collapsible=icon]:hidden">
                        {t(item.labelKey)}
                      </span>
                    </>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            );
          })}

          <SidebarMenuItem>
            <Link href={localizeHref('/logout')}>
              <SidebarMenuButton
                asChild
                tooltip={{ children: t('logout'), side: 'right', align: 'center' }}
                className="w-full justify-start hover:bg-destructive/20"
              >
                <>
                  <Power className="h-5 w-5 text-destructive" />
                  <span className="group-data-[collapsible=icon]:hidden text-destructive">
                    {t('logout')}
                  </span>
                </>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
