
import {getRequestConfig} from 'next-intl/server';
import {notFound} from 'next/navigation';

// Import messages statically
import enMessages from './messages/en.json';
import viMessages from './messages/vi.json';

const locales = ['en', 'vi'];

const allMessages: Record<string, any> = { // Using Record<string, any> for simplicity
  en: enMessages,
  vi: viMessages
};

export default getRequestConfig(async ({locale}) => {
  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale as any)) {
    console.error(`[next-intl] i18n.ts: Locale "${locale}" is not supported by 'locales' array. This should have been caught by middleware. Calling notFound().`);
    notFound();
  }

  const messagesForLocale = allMessages[locale];

  if (!messagesForLocale) {
    console.error(`[next-intl] i18n.ts: No messages found for supported locale "${locale}". This is unexpected. Ensure message files (e.g., en.json, vi.json) exist and are correctly imported. Calling notFound().`);
    notFound();
  }
 
  return {
    messages: messagesForLocale
  };
});

