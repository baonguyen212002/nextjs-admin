
'use client'; 

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Palette } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

type Theme = 'light' | 'dark' | 'system';

export default function AppearanceSettingsPage() {
  const t = useTranslations('AppearanceSettingsPage');
  const [selectedTheme, setSelectedTheme] = useState<Theme>('system');

  // Initialize theme from localStorage or system preference
  useEffect(() => {
    const storedTheme = localStorage.getItem('theme') as Theme | null;
    if (storedTheme && (storedTheme === 'light' || storedTheme === 'dark')) {
      setSelectedTheme(storedTheme);
    } else {
      setSelectedTheme('system'); // Default to system if no valid theme is stored
    }
  }, []);

  const applyTheme = (theme: Theme) => {
    setSelectedTheme(theme);
    if (theme === 'light') {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    } else if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else { // System theme
      localStorage.removeItem('theme');
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-6 w-6 text-primary" />
            {t('title')}
          </CardTitle>
          <CardDescription>
            {t('description')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-foreground">{t('themeLabel')}</h3>
            <p className="text-sm text-muted-foreground">
              {t('themeDescription')}
            </p>
            <RadioGroup
              value={selectedTheme}
              onValueChange={(value: Theme) => applyTheme(value)}
              className="space-y-2"
            >
              <div className="flex items-center space-x-2 p-2 rounded-md hover:bg-muted/50 transition-colors">
                <RadioGroupItem value="light" id="theme-light" />
                <Label htmlFor="theme-light" className="cursor-pointer flex-1">{t('themeOptionLight')}</Label>
              </div>
              <div className="flex items-center space-x-2 p-2 rounded-md hover:bg-muted/50 transition-colors">
                <RadioGroupItem value="dark" id="theme-dark" />
                <Label htmlFor="theme-dark" className="cursor-pointer flex-1">{t('themeOptionDark')}</Label>
              </div>
              <div className="flex items-center space-x-2 p-2 rounded-md hover:bg-muted/50 transition-colors">
                <RadioGroupItem value="system" id="theme-system" />
                <Label htmlFor="theme-system" className="cursor-pointer flex-1">{t('themeOptionSystem')}</Label>
              </div>
            </RadioGroup>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
