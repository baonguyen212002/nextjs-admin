
'use client';

import { Link, usePathname, useRouter } from 'next-intl/client';
import { Bell, UserCircle, Sun, Moon, Menu, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { SidebarTrigger, useSidebar } from '@/components/ui/sidebar'; 
import { useEffect, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';

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


export default function AppHeader() {
  const { isMobile } = useSidebar();
  const t = useTranslations('AppHeader');
  const [siteName, setSiteName] = useState(t('adminDashboardTitle')); // Initialize with translated fallback

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
        // If siteName is cleared from settings, revert to translated default
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
  }, [t]); // Add t to dependency array


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
        <Button variant="ghost" size="icon" aria-label={t('notificationsLabel')}>
          <Bell className="h-5 w-5 text-accent" />
          <span className="sr-only">{t('notificationsLabel')}</span>
        </Button>
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
            <DropdownMenuItem asChild><Link href="/settings/general">{t('profileDropdown')}</Link></DropdownMenuItem>
            <DropdownMenuItem asChild><Link href="/settings">{t('settingsDropdown')}</Link></DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>{t('logoutDropdown')}</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
