
import {getRequestConfig} from 'next-intl/server';
import {notFound} from 'next/navigation';

// Can be imported from a shared config
const locales = ['en', 'vi'];
 
export default getRequestConfig(async ({locale}) => {
  // Validate that the incoming `locale` parameter is valid
  // and that a message file exists for it.
  if (!locales.includes(locale as any)) {
    notFound();
  }
 
  return {
    // The path `./messages/` is relative to `src/i18n.ts`
    // and should correctly find `src/messages/[locale].json`
    messages: (await import(`./messages/${locale}.json`)).default
  };
});
