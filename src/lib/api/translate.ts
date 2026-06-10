export async function translate(text: string, target: string) {
    const res = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, target }),
    });

    if (!res.ok) {
        throw new Error(`Translate failed: ${res.status}`);
    }

    const data = await res.json();
    return data.translatedText;
}
