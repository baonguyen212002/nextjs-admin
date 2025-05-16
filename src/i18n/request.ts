import {getRequestConfig} from 'next-intl/server';
import {routing} from './routing';

function hasLocale<T extends readonly string[]>(locales: T, value: unknown): value is T[number] {
  return typeof value === 'string' && locales.includes(value as T[number]);
}

export default getRequestConfig(async ({requestLocale}) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default
  };
});
