
'use client';

import { Link, useRouter, usePathname } from '@/i18n/navigation';
import { Bell, UserCircle, Sun, Moon, Menu, Clock, Settings2, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SidebarTrigger, useSidebar } from '@/components/ui/sidebar';
import { useEffect, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import Image from 'next/image';

// A mock theme toggle - in a real app, this would integrate with a theme provider (e.g., next-themes)
const ThemeToggle = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Check for saved theme or system preference
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      document.documentElement.classList.add('dark');
      setIsDarkMode(true);
    } else {
      document.documentElement.classList.remove('dark');
      setIsDarkMode(false);
    }
  }, []);
  
  const toggleTheme = () => {
    if (document.documentElement.classList.contains('dark')) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setIsDarkMode(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setIsDarkMode(true);
    }
  };

  return (
    <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle theme">
      {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </Button>
  );
};

const LiveClock = () => {
  const t = useTranslations('AppHeader');
  const [currentTime, setCurrentTime] = useState<string | null>(null);
  const [currentTimezone, setCurrentTimezone] = useState<string | undefined>(undefined);

  useEffect(() => {
    const getStoredTimezone = () => {
      if (typeof window !== 'undefined') {
        return localStorage.getItem('appTimezone') || 'Etc/UTC'; // Default to UTC if not set
      }
      return 'Etc/UTC';
    };

    setCurrentTimezone(getStoredTimezone());

    const handleSettingsChange = (event: Event) => {
      const customEvent = event as CustomEvent<{ timezone?: string }>;
      if (customEvent.detail && customEvent.detail.timezone) {
        setCurrentTimezone(customEvent.detail.timezone);
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('settingsChanged', handleSettingsChange);
    }
    
    // Set initial time
    try {
      setCurrentTime(new Date().toLocaleTimeString(undefined, { timeZone: getStoredTimezone() }));
    } catch (e) {
      console.warn("Failed to set initial time with stored timezone, defaulting.", e);
      setCurrentTime(new Date().toLocaleTimeString(undefined, { timeZone: 'Etc/UTC' }));
    }


    const timer = setInterval(() => {
      try {
        setCurrentTime(new Date().toLocaleTimeString(undefined, { timeZone: currentTimezone }));
      } catch (e) {
         // If timezone becomes invalid, fallback or log
        console.warn("Error updating time with current timezone, falling back to UTC for this tick.", e, currentTimezone);
        setCurrentTime(new Date().toLocaleTimeString(undefined, { timeZone: 'Etc/UTC' }));
      }
    }, 1000);

    return () => {
      clearInterval(timer);
      if (typeof window !== 'undefined') {
        window.removeEventListener('settingsChanged', handleSettingsChange);
      }
    };
  }, [currentTimezone]); // Re-run effect if currentTimezone changes

  if (currentTime === null) {
    return (
      <div className="flex items-center text-sm text-muted-foreground">
        <Clock className="mr-1 h-4 w-4" />
        <span>{t('liveClockLoading')}</span>
      </div>
    );
  }

  return (
    <div className="flex items-center text-sm font-medium text-foreground">
      <Clock className="mr-1 h-4 w-4 text-accent" />
      <span>{currentTime}</span>
    </div>
  );
};

const mockNotifications = [
  { id: '1', type: 'update', titleKey: 'notificationUpdateTitle', messageKey: 'notificationUpdateMessage', time: '2 mins ago', read: false, icon: Settings2, iconColor: 'text-blue-500', userImageHint: 'system update' },
  { id: '2', type: 'new_user', titleKey: 'notificationNewUserTitle', messageKey: 'notificationNewUserMessage', time: '1 hour ago', read: true, icon: UserCircle, iconColor: 'text-green-500', userImageHint: 'new user' },
  { id: '3', type: 'alert', titleKey: 'notificationAlertTitle', messageKey: 'notificationAlertMessage', time: '3 hours ago', read: false, icon: Info, iconColor: 'text-red-500', userImageHint: 'alert icon' },
];


export default function AppHeader() {
  const { isMobile } = useSidebar();
  const t = useTranslations('AppHeader');
  const [siteName, setSiteName] = useState(t('adminDashboardTitle')); 
  const [notifications, setNotifications] = useState(mockNotifications);

  useEffect(() => {
     const getStoredSiteName = () => {
      if (typeof window !== 'undefined') {
        return localStorage.getItem('appSiteName') || t('adminDashboardTitle');
      }
      return t('adminDashboardTitle');
    };
    setSiteName(getStoredSiteName());

    const handleSettingsChange = (event: Event) => {
      const customEvent = event as CustomEvent<{ siteName?: string }>;
      if (customEvent.detail && customEvent.detail.siteName) {
        setSiteName(customEvent.detail.siteName);
      } else {
        // If siteName is not in detail, re-fetch from localStorage or default
        setSiteName(localStorage.getItem('appSiteName') || t('adminDashboardTitle'));
      }
    };
     if (typeof window !== 'undefined') {
      window.addEventListener('settingsChanged', handleSettingsChange);
    }
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('settingsChanged', handleSettingsChange);
      }
    };
  }, [t]); // t is included to re-evaluate default if language changes

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="sticky top-0 z-50 flex h-16 items-center justify-between border-b bg-card px-4 sm:px-6 lg:px-8 shadow-sm">
      <div className="flex items-center gap-4">
        {isMobile && <SidebarTrigger><Menu className="h-6 w-6" /></SidebarTrigger>}
        <Link href="/" className="text-xl font-bold text-primary">
          {siteName}
        </Link>
      </div>
      <div className="flex items-center gap-3">
        <LiveClock />
        <ThemeToggle />
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" aria-label={t('notificationsLabel')} className="relative">
              <Bell className="h-5 w-5"/>
              {unreadCount > 0 && (
                <span className="absolute top-0 right-0 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                </span>
              )}
              <span className="sr-only">{t('notificationsLabel')}</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-0" align="end">
            <div className="p-4">
              <h4 className="text-lg font-semibold text-foreground">{t('notificationsPopoverTitle')}</h4>
            </div>
            <div className="max-h-96 overflow-y-auto">
              {notifications.length > 0 ? (
                notifications.map(notification => (
                  <div 
                    key={notification.id} 
                    className={`p-3 border-b last:border-b-0 hover:bg-muted/50 cursor-pointer ${!notification.read ? 'bg-primary/5' : ''}`}
                    onClick={() => setNotifications(prev => prev.map(n => n.id === notification.id ? {...n, read: true} : n))}
                  >
                    <div className="flex items-start gap-3">
                      <Avatar className="h-8 w-8 mt-1">
                         <AvatarFallback className={`bg-transparent ${notification.iconColor}`}>
                           <notification.icon className="h-5 w-5" />
                         </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className={`text-sm font-medium text-foreground ${!notification.read ? 'font-semibold' : ''}`}>
                          {t(notification.titleKey as any)} {/* Cast to any if TS complains about key type */}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {t(notification.messageKey as any)}
                        </p>
                        <p className="text-xs text-muted-foreground/70 mt-0.5">{notification.time}</p>
                      </div>
                       {!notification.read && (
                        <span className="mt-1 h-2 w-2 rounded-full bg-primary" aria-label={t('unreadNotificationLabel')}></span>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p className="p-4 text-sm text-center text-muted-foreground">{t('noNotificationsText')}</p>
              )}
            </div>
            {notifications.length > 0 && (
              <div className="p-2 border-t">
                <Button variant="link" size="sm" className="w-full text-primary">
                  {t('viewAllNotificationsLink')}
                </Button>
              </div>
            )}
          </PopoverContent>
        </Popover>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full" aria-label={t('userMenuLabel')}>
              <UserCircle className="h-6 w-6" />
              <span className="sr-only">{t('userMenuLabel')}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>{t('myAccountDropdown')}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild><Link href="/settings/profile">{t('profileDropdown')}</Link></DropdownMenuItem>
            <DropdownMenuItem asChild><Link href="/settings">{t('settingsDropdown')}</Link></DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>{t('logoutDropdown')}</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}


    