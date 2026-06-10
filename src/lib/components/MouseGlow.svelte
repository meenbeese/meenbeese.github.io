<script lang="ts">
    import { onMount } from 'svelte';

    let x = $state(0);
    let y = $state(0);

    function handleMouseMove(e: MouseEvent) {
        x = e.clientX;
        y = e.clientY;
    }

    onMount(() => {
        window.addEventListener('mousemove', handleMouseMove);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
        };
    });
</script>

<div class="mouse-glow">
    <div
        class="glow"
        style="transform: translate(calc({x}px - 50%), calc({y}px - 50%));"
    />
</div>

<style>
    .mouse-glow {
        position: fixed;
        inset: 0;
        pointer-events: none;
        z-index: 10;
    }

    .glow {
        position: absolute;
        width: 360px;
        height: 360px;
        border-radius: 9999px;

        background: radial-gradient(
            circle,
            rgba(255, 220, 120, 0.25) 0%,
            rgba(255, 200, 80, 0.12) 40%,
            transparent 70%
        );
        filter: blur(36px);

        transition: transform 120ms ease-out;
        mix-blend-mode: soft-light;
    }
</style>
