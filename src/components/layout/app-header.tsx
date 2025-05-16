
'use client';

import Link from 'next/link';
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
    setCurrentTime(new Date().toLocaleTimeString(undefined, { timeZone: getStoredTimezone() }));

    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString(undefined, { timeZone: currentTimezone }));
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
        <span>--:--:--</span>
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
  const [siteName, setSiteName] = useState('Admin Dashboard');

  useEffect(() => {
     const getStoredSiteName = () => {
      if (typeof window !== 'undefined') {
        return localStorage.getItem('appSiteName') || 'Admin Dashboard';
      }
      return 'Admin Dashboard';
    };
    setSiteName(getStoredSiteName());

    const handleSettingsChange = (event: Event) => {
      const customEvent = event as CustomEvent<{ siteName?: string }>;
      if (customEvent.detail && customEvent.detail.siteName) {
        setSiteName(customEvent.detail.siteName);
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
  }, []);


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
        <Button variant="ghost" size="icon" aria-label="Notifications">
          <Bell className="h-5 w-5 text-accent" />
          <span className="sr-only">Notifications</span>
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <UserCircle className="h-6 w-6" />
              <span className="sr-only">User menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild><Link href="/settings/general">Profile</Link></DropdownMenuItem>
            <DropdownMenuItem asChild><Link href="/settings">Settings</Link></DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

