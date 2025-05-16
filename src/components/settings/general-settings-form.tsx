
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Save } from 'lucide-react';
import { useEffect, useState } from 'react';

const generalSettingsSchema = z.object({
  siteName: z.string().min(3, { message: 'Site name must be at least 3 characters.' }),
  defaultLanguage: z.string({ required_error: 'Default language is required.' }),
  timezone: z.string({ required_error: 'Timezone is required.' }),
});

type GeneralSettingsFormValues = z.infer<typeof generalSettingsSchema>;

// Base default settings
const baseSettings = {
  siteName: 'Admin Dashboard',
  defaultLanguage: 'en',
  timezone: 'Etc/UTC', // Default to UTC if nothing else is set
};

const languages = [
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Español (Spanish)' },
  { value: 'fr', label: 'Français (French)' },
  { value: 'de', label: 'Deutsch (German)' },
  { value: 'vi', label: 'Tiếng Việt (Vietnamese)' },
];

const timezones = [
  { value: 'Etc/UTC', label: 'Coordinated Universal Time (UTC)' },
  { value: 'Etc/GMT+12', label: 'GMT-12:00 International Date Line West' },
  { value: 'Pacific/Midway', label: 'GMT-11:00 Midway Island, Samoa' },
  { value: 'Pacific/Honolulu', label: 'GMT-10:00 Hawaii' },
  { value: 'America/Anchorage', label: 'GMT-09:00 Alaska' },
  { value: 'America/Los_Angeles', label: 'GMT-08:00 Pacific Time (US & Canada)' },
  { value: 'America/Denver', label: 'GMT-07:00 Mountain Time (US & Canada)' },
  { value: 'America/Chicago', label: 'GMT-06:00 Central Time (US & Canada)' },
  { value: 'America/New_York', label: 'GMT-05:00 Eastern Time (US & Canada)' },
  { value: 'America/Caracas', label: 'GMT-04:30 Caracas' },
  { value: 'America/Halifax', label: 'GMT-04:00 Atlantic Time (Canada)' },
  { value: 'America/Sao_Paulo', label: 'GMT-03:00 Brasilia' },
  { value: 'Atlantic/South_Georgia', label: 'GMT-02:00 Mid-Atlantic' },
  { value: 'Atlantic/Azores', label: 'GMT-01:00 Azores' },
  { value: 'Europe/London', label: 'GMT+00:00 London, Dublin, Lisbon' },
  { value: 'Europe/Paris', label: 'GMT+01:00 Paris, Berlin, Rome, Madrid' },
  { value: 'Europe/Istanbul', label: 'GMT+02:00 Istanbul, Athens, Helsinki' },
  { value: 'Europe/Moscow', label: 'GMT+03:00 Moscow, St. Petersburg' },
  { value: 'Asia/Dubai', label: 'GMT+04:00 Abu Dhabi, Muscat' },
  { value: 'Asia/Kolkata', label: 'GMT+05:30 Chennai, Kolkata, Mumbai, New Delhi' },
  { value: 'Asia/Dhaka', label: 'GMT+06:00 Astana, Dhaka' },
  { value: 'Asia/Bangkok', label: 'GMT+07:00 Bangkok, Hanoi, Jakarta' },
  { value: 'Asia/Ho_Chi_Minh', label: 'GMT+07:00 Indochina Time (Ho Chi Minh City)'},
  { value: 'Asia/Singapore', label: 'GMT+08:00 Singapore, Hong Kong, Beijing' },
  { value: 'Asia/Tokyo', label: 'GMT+09:00 Tokyo, Seoul, Osaka' },
  { value: 'Australia/Sydney', label: 'GMT+10:00 Sydney, Melbourne' },
  { value: 'Pacific/Auckland', label: 'GMT+12:00 Auckland, Wellington' },
];

export default function GeneralSettingsForm() {
  const { toast } = useToast();
  const [initialFormValues, setInitialFormValues] = useState(baseSettings);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedSiteName = localStorage.getItem('appSiteName');
      const storedLanguage = localStorage.getItem('appLanguage');
      const storedTimezone = localStorage.getItem('appTimezone');
      
      const loadedSettings = { ...baseSettings };
      if (storedSiteName) {
        loadedSettings.siteName = storedSiteName;
      }
      if (storedLanguage && languages.some(lang => lang.value === storedLanguage)) {
        loadedSettings.defaultLanguage = storedLanguage;
      }
      if (storedTimezone && timezones.some(tz => tz.value === storedTimezone)) {
        loadedSettings.timezone = storedTimezone;
      }
      setInitialFormValues(loadedSettings);
    }
  }, []);

  const form = useForm<GeneralSettingsFormValues>({
    resolver: zodResolver(generalSettingsSchema),
    defaultValues: initialFormValues, // Initialize with baseSettings, will be updated by useEffect
  });

  useEffect(() => {
    // Update form values if initialFormValues changes (e.g., after loading from localStorage)
    form.reset(initialFormValues);
  }, [initialFormValues, form]);

  async function onSubmit(values: GeneralSettingsFormValues) {
    // In a real app, you would call a server action here to save the settings
    console.log('General Settings Submitted:', values);
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('appSiteName', values.siteName);
      localStorage.setItem('appLanguage', values.defaultLanguage);
      localStorage.setItem('appTimezone', values.timezone);
      window.dispatchEvent(new CustomEvent('settingsChanged', { detail: values }));
    }
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    toast({
      title: 'Settings Saved!',
      description: 'Your general settings have been updated and stored locally.',
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="siteName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Site Name</FormLabel>
              <FormControl>
                <Input placeholder="Your Application Name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="defaultLanguage"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Default Language</FormLabel>
              <Select onValueChange={field.onChange} value={field.value} defaultValue={initialFormValues.defaultLanguage}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select default language" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {languages.map((lang) => (
                    <SelectItem key={lang.value} value={lang.value}>
                      {lang.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="timezone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Timezone</FormLabel>
              <Select onValueChange={field.onChange} value={field.value} defaultValue={initialFormValues.timezone}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select timezone" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {timezones.map((tz) => (
                    <SelectItem key={tz.value} value={tz.value}>
                      {tz.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end pt-4">
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? (
              <>Saving...</>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Settings
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}

