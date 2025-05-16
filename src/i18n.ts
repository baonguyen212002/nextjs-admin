
import {getRequestConfig} from 'next-intl/server';
import {notFound} from 'next/navigation';

// Supported locales - ensure this matches middleware.ts
const locales = ['en', 'vi'];

export default getRequestConfig(async ({locale}) => {
  // Step 1: Validate the incoming `locale` parameter.
  // This is crucial. If an invalid locale slips through, errors will occur.
  // The `as any` is a temporary workaround if `locale` type from `getRequestConfig` is too broad.
  if (!locales.includes(locale as any)) {
    console.warn(`[next-intl] i18n.ts: Unsupported locale "${locale}" received by getRequestConfig. This should ideally be caught by middleware. Calling notFound().`);
    notFound();
  }

  let messages;
  try {
    // Step 2: Attempt to dynamically import the messages for the validated locale.
    // The path `./messages/${locale}.json` is relative to `src/i18n.ts`.
    // This means it looks for `src/messages/en.json` or `src/messages/vi.json`.
    messages = (await import(`./messages/${locale}.json`)).default;
    // console.log(`[next-intl] i18n.ts: Successfully loaded messages for locale "${locale}".`);
  } catch (error) {
    // Step 3: Handle errors during message import.
    console.error(`[next-intl] i18n.ts: CRITICAL - Failed to load message file for locale "${locale}". Path: ./messages/${locale}.json. Error:`, error);
    // If messages for a supported and requested locale cannot be loaded,
    // it's a critical failure. Calling notFound() is appropriate.
    notFound();
  }
 
  // Step 4: Return the configuration object.
  return {
    messages
  };
});

