<script lang="ts">
    import { _ } from 'svelte-i18n';

    const { label } = $props<{ label: string }>();
</script>

<span>{$_(label)}</span>
