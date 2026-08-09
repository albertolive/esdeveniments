import {
  DEFAULT_LOCALE,
  SUPPORTED_LOCALES,
  type AppLocale,
  type RouteTranslator,
} from "types/i18n";

const messagesLoaders: Record<
  AppLocale,
  () => Promise<Record<string, unknown>>
> = {
  ca: async () =>
    (await import("../messages/ca.json")).default as Record<string, unknown>,
  es: async () =>
    (await import("../messages/es.json")).default as Record<string, unknown>,
  en: async () =>
    (await import("../messages/en.json")).default as Record<string, unknown>,
};

function getNestedMessage(
  messages: Record<string, unknown>,
  path: string,
): unknown {
  return path.split(".").reduce<unknown>((value, segment) => {
    if (value && typeof value === "object" && segment in value) {
      return (value as Record<string, unknown>)[segment];
    }
    return undefined;
  }, messages);
}

function formatMessage(
  message: string,
  values?: Record<string, string | number>,
): string {
  if (!values) return message;
  return Object.entries(values).reduce(
    (formatted, [key, value]) =>
      formatted.split(`{${key}}`).join(String(value)),
    message,
  );
}

export async function getRouteTranslations(
  locale: AppLocale = DEFAULT_LOCALE,
  namespace?: string,
): Promise<RouteTranslator> {
  const resolvedLocale = SUPPORTED_LOCALES.includes(locale)
    ? locale
    : DEFAULT_LOCALE;
  const messages = await messagesLoaders[resolvedLocale]();

  return (key: string, values?: Record<string, string | number>): string => {
    const path = namespace ? `${namespace}.${key}` : key;
    const message = getNestedMessage(messages, path);
    return formatMessage(
      typeof message === "string" ? message : path,
      values,
    );
  };
}
