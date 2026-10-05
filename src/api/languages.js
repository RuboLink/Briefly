const APITUBE_LANGUAGE_CODES = new Set([
  'af', 'sq', 'ar', 'hy', 'az', 'eu', 'by', 'bn', 'bs', 'bg', 'ca', 'zh', 'hr',
  'cs', 'da', 'nl', 'en', 'et', 'fi', 'fr', 'ka', 'de', 'el', 'gu', 'he', 'hi',
  'hu', 'is', 'id', 'ga', 'it', 'ja', 'kn', 'ko', 'la', 'lv', 'lt', 'mk', 'ms',
  'mt', 'no', 'fa', 'pl', 'pt', 'ro', 'sr', 'sk', 'sl', 'es', 'sw', 'sv', 'ta',
  'te', 'th', 'tr', 'un', 'ur', 'vi', 'cy', 'yi',
]);

export function normalizeNewsLanguages(values) {
  const configuredValues = (Array.isArray(values) ? values : [values])
    .flatMap((value) => (typeof value === 'string' ? value.split(',') : []));
  const languages = ['es'];

  for (const value of configuredValues) {
    const language = value.trim().split(/[-_]/, 1)[0].toLowerCase();
    if (APITUBE_LANGUAGE_CODES.has(language) && !languages.includes(language)) {
      languages.push(language);
    }
  }

  return languages;
}

export function getBrowserNewsLanguages() {
  if (typeof navigator === 'undefined') return ['es'];

  const browserLanguages = Array.isArray(navigator.languages) && navigator.languages.length > 0
    ? navigator.languages
    : [navigator.language];

  return normalizeNewsLanguages(browserLanguages);
}
