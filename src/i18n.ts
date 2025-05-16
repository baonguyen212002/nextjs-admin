
import {getRequestConfig} from 'next-intl/server';
import {notFound} from 'next/navigation';
 
// A list of all locales that are supported
const locales = ['en', 'vi'];
 
export default getRequestConfig(async ({locale}) => {
  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale as any)) {
    console.log(`[next-intl] i18n.ts: Locale "${locale}" is not supported by 'locales' array, calling notFound().`);
    notFound();
  }
 
  try {
    // Using `./` because i18n.ts is in src/ and messages are in src/messages/
    const messages = (await import(`./messages/${locale}.json`)).default;
    return {
      messages
    };
  } catch (error) {
    console.error(`[next-intl] i18n.ts: Critical error: Failed to load messages for supported locale "${locale}":`, error);
    // If messages for a *supported* locale can't be loaded, this is a critical error.
    notFound();
  }
});
