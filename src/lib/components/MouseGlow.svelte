<script lang="ts">
    import { onMount } from 'svelte';

    let glow = $state<HTMLDivElement | null>(null);
    let finePointer = $state(true);

    $effect(() => {
        const query = window.matchMedia('(hover: hover) and (pointer: fine)');
        finePointer = query.matches;

        const onChange = (e: MediaQueryListEvent) => {
            finePointer = e.matches;
        };

        query.addEventListener('change', onChange);
        return () => query.removeEventListener('change', onChange);
    });

    onMount(() => {
        if (!finePointer || !glow) return;

        let frame = 0;
        let nextX = 0;
        let nextY = 0;
        let curX = 0;
        let curY = 0;
        let started = false;

        // Center the element on the cursor using its own measured size.
        const offset = glow ? glow.offsetWidth / 2 : 110;

        // Coalesce every pointer event into a single write per frame.
        const flush = () => {
            // Ease toward the target so motion stays fluid at any event rate.
            curX += (nextX - curX) * 0.18;
            curY += (nextY - curY) * 0.18;

            glow?.style.setProperty(
                'transform',
                `translate3d(${curX - offset}px, ${curY - offset}px, 0)`,
            );

            frame =
                Math.abs(nextX - curX) < 0.1 && Math.abs(nextY - curY) < 0.1
                    ? 0
                    : requestAnimationFrame(flush);
        };

        const handleMouseMove = (e: MouseEvent) => {
            nextX = e.clientX;
            nextY = e.clientY;

            // First real position: snap into place and reveal, so the glow
            // never renders at the default 0,0 or eases in from the corner.
            if (!started && glow) {
                started = true;
                curX = nextX;
                curY = nextY;
                glow.style.opacity = '1';
                glow.style.visibility = 'visible';
            }

            if (!frame) frame = requestAnimationFrame(flush);
        };

        window.addEventListener('mousemove', handleMouseMove, {
            passive: true,
        });

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            if (frame) cancelAnimationFrame(frame);
        };
    });
</script>

{#if finePointer}
    <div class="mouse-glow" aria-hidden="true">
        <div class="glow" bind:this={glow}></div>
    </div>
{/if}

<style>
    .mouse-glow {
        position: fixed;
        inset: 0;
        pointer-events: none;
        z-index: 2147483647;
        contain: strict;
    }

    .glow {
        position: absolute;
        top: 0;
        left: 0;
        width: 220px;
        height: 220px;
        border-radius: 9999px;
        will-change: transform;

        /* Hidden until the first pointer position is known; revealed
           imperatively via inline style, since Svelte prunes selectors
           whose classes never appear statically in the template. */
        opacity: 0;
        visibility: hidden;

        background: radial-gradient(
            circle,
            rgba(255, 226, 150, 0.55) 0%,
            rgba(255, 205, 110, 0.34) 35%,
            rgba(255, 190, 90, 0.12) 60%,
            transparent 75%
        );
        filter: blur(24px);

        mix-blend-mode: plus-lighter;
    }

    :global(.dark) .glow {
        background: radial-gradient(
            circle,
            rgba(255, 232, 170, 0.6) 0%,
            rgba(255, 210, 120, 0.4) 35%,
            rgba(255, 195, 95, 0.15) 60%,
            transparent 75%
        );
        mix-blend-mode: screen;
    }

    @media (prefers-reduced-motion: reduce) {
        .glow {
            display: none;
        }
    }
</style>
