<script lang="ts">
    import { translations, language } from '$lib/api/i18n';
    import { derived } from 'svelte/store';

    const { label } = $props<{ label: string }>();

    const text = derived(
        [translations, language],
        ([$translations, $language]) => {
            return $translations[$language]?.[label] ?? label;
        },
    );
</script>

<span>{$text}</span>
