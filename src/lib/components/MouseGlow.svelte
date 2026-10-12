<script lang="ts">
    const { enabled = true } = $props<{ enabled?: boolean }>();

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

    $effect(() => {
        if (!finePointer || !enabled || !glow) return;

        let frame = 0;
        let nextX = 0;
        let nextY = 0;
        let curX = 0;
        let curY = 0;
        let started = false;

        // Coalesce every pointer event into a single write per frame.
        const flush = () => {
            // Ease toward the target so motion stays fluid at any event rate.
            curX += (nextX - curX) * 0.18;
            curY += (nextY - curY) * 0.18;

            glow?.style.setProperty(
                'transform',
                // 160 = half of the fixed 320px glow size in CSS.
                `translate3d(${curX - 160}px, ${curY - 160}px, 0)`,
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

        window.addEventListener('mousemove', handleMouseMove, { passive: true });

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            if (frame) cancelAnimationFrame(frame);
        };
    });
</script>

{#if finePointer && enabled}
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
        width: 320px;
        height: 320px;
        border-radius: 9999px;
        will-change: transform;

        /* Hidden until the first pointer position is known; revealed
           imperatively via inline style, since Svelte prunes selectors
           whose classes never appear statically in the template. */
        opacity: 0;
        visibility: hidden;

        background: radial-gradient(
            circle,
            rgba(255, 226, 150, 0.35) 0%,
            rgba(255, 205, 110, 0.2) 45%,
            rgba(255, 190, 90, 0.08) 70%,
            transparent 85%
        );
        filter: blur(40px);

        mix-blend-mode: plus-lighter;
    }

    :global(.dark) .glow {
        background: radial-gradient(
            circle,
            rgba(255, 232, 170, 0.38) 0%,
            rgba(255, 210, 120, 0.22) 45%,
            rgba(255, 195, 95, 0.09) 70%,
            transparent 85%
        );
        mix-blend-mode: screen;
    }

    @media (prefers-reduced-motion: reduce) {
        .glow {
            display: none;
        }
    }
</style>
