import { json } from '@sveltejs/kit';
import { DEEPL_API_KEY } from '$env/static/private';

const cache = new Map<string, string>();

export async function POST({ request }) {
    const { text, target } = await request.json();

    if (!text || !target) {
        return json({ error: 'Missing text or target' }, { status: 400 });
    }

    if (target === 'en') {
        return json({ translatedText: text });
    }

    const key = `${text}_${target}`;
    if (cache.has(key)) {
        return json({ translatedText: cache.get(key) });
    }

    const res = await fetch('https://api-free.deepl.com/v2/translate', {
        method: 'POST',
        headers: {
            Authorization: `DeepL-Auth-Key ${DEEPL_API_KEY}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            text: [text],
            target_lang: target.toUpperCase(),
            source_lang: 'EN',
        }),
    });

    if (!res.ok) {
        const err = await res.text();
        return json({ error: err }, { status: res.status });
    }

    const data = await res.json();
    const translatedText = data.translations?.[0]?.text;

    cache.set(key, translatedText);

    return json({ translatedText });
}
