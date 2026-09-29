import { addMessages, init, locale } from 'svelte-i18n';
import en from './locales/en.json';
import es from './locales/es.json';
import fr from './locales/fr.json';
import ja from './locales/ja.json';
import ko from './locales/ko.json';
import pt from './locales/pt.json';
import zh from './locales/zh.json';

export type Locale = 'en' | 'es' | 'fr' | 'ja' | 'ko' | 'pt' | 'zh';

export const locales = { en, es, fr, ja, ko, pt, zh } satisfies Record<
    Locale,
    object
>;

const STORAGE_KEY = 'language';

const isLocale = (value: string | null): value is Locale =>
    Object.hasOwn(locales, value ?? '');

let initialised = false;

export function setupI18n() {
    // Must run at module-evaluation time, not in onMount: prerendering is
    // server-side and never fires component lifecycle hooks, so the locale
    // has to exist before the first `$_` call or SSR throws.
    if (initialised) return;
    initialised = true;

    for (const [code, messages] of Object.entries(locales)) {
        addMessages(code, messages);
    }

    init({ fallbackLocale: 'en', initialLocale: 'en' });
}

export function restoreLocale() {
    if (typeof localStorage === 'undefined') return;

    const saved = localStorage.getItem(STORAGE_KEY);
    if (isLocale(saved)) setLocale(saved);
}

export function setLocale(next: Locale) {
    locale.set(next);
    localStorage.setItem(STORAGE_KEY, next);
    document.documentElement.lang = next;
}

export { locale };
