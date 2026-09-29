import type { Locale } from '$lib/i18n';

export const languages = [
    { code: 'en', label: 'English' },
    { code: 'es', label: 'Español' },
    { code: 'fr', label: 'Français' },
] as const satisfies ReadonlyArray<{ code: Locale; label: string }>;
