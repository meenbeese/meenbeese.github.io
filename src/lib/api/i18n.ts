import { writable, get } from 'svelte/store';
import { translate } from './translate';

export const language = writable('en');

// { lang: { label: translation } }
export const translations = writable<Record<string, Record<string, string>>>(
    {},
);

export async function translatePage(labels: string[]) {
    const lang = get(language);

    if (lang === 'en') return;

    const result: Record<string, string> = {};

    for (const label of labels) {
        result[label] = await translate(label, lang);

        // small delay helps avoid 429
        await new Promise((r) => setTimeout(r, 120));
    }

    translations.update((t) => ({ ...t, [lang]: { ...t[lang], ...result } }));
}
