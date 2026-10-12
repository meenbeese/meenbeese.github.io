<script lang="ts">
    import { onMount } from 'svelte';
    import { _, locale } from 'svelte-i18n';

    import {
        BriefcaseRegular,
        CheckRegular,
        CloseRegular,
        CopyRegular,
        EarthRegular,
        LeftRegular,
        MailRegular,
        MenuRegular,
        MoonRegular,
        MortarboardRegular,
        RightRegular,
        SunRegular,
    } from '@mingcute/svelte/core-regular';
    import { LinkedinFilled } from '@mingcute/svelte/core-filled';

    import MouseGlow from '#lib/components/MouseGlow.svelte';
    import T from '#lib/components/T.svelte';
    import { navLinks } from '#lib/data/nav.js';
    import { projects } from '#lib/data/projects.js';
    import { frontendSkills } from '#lib/data/skills.js';
    import { backendSkills } from '#lib/data/skills.js';
    import { locales } from '#lib/data/langs.js';
    import { languages } from '#lib/data/programming.js';
    import { socials } from '#lib/data/socials.js';
    import { setupI18n, restoreLocale, setLocale, type Locale } from '#lib/i18n/index.js';

    let open = $state(false);
    let darkMode = $state(false);
    let langOpen = $state(false);
    let activeSection = $state('profile');
    let copied: 'email' | 'linkedin' | null = $state(null);

    const emailAddress = 'kuzeybilgin@proton.me';
    const linkedinUrl =
        socials.find((s) => s.name === 'LinkedIn')?.url ??
        'https://ca.linkedin.com/in/kuzey-bilgin-66a7b3213/';
    const linkedinHandle = 'in/kuzey-bilgin-66a7b3213';

    async function copyText(text: string, which: 'email' | 'linkedin') {
        try {
            await navigator.clipboard.writeText(text);
        } catch {
            const ta = document.createElement('textarea');
            ta.value = text;
            document.body.appendChild(ta);
            ta.select();
            document.execCommand('copy');
            ta.remove();
        }
        copied = which;
        window.setTimeout(() => {
            if (copied === which) copied = null;
        }, 1600);
    }

    let langScroller = $state<HTMLDivElement | null>(null);
    let pfpWrap = $state<HTMLDivElement | null>(null);
    let canScrollPrev = $state(false);
    let canScrollNext = $state(false);
    let langProgress = $state(0);

    function updateLangScrollState() {
        const el = langScroller;
        if (!el) return;
        canScrollPrev = el.scrollLeft > 4;
        canScrollNext = el.scrollLeft + el.clientWidth < el.scrollWidth - 4;
        const max = el.scrollWidth - el.clientWidth;
        langProgress = max > 0 ? Math.min(1, Math.max(0, el.scrollLeft / max)) : 0;
    }

    function scrollLangs(dir: 1 | -1) {
        const el = langScroller;
        if (!el) return;
        const tile = el.querySelector(':scope > a') as HTMLElement | null;
        const gap = 12;
        const step = tile ? tile.offsetWidth + gap : Math.round(el.clientWidth * 0.8);
        el.scrollBy({ left: dir * step, behavior: 'smooth' });
    }

    function handlePfpMove(e: MouseEvent) {
        const el = pfpWrap;
        if (!el) return;
        if (
            window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
            window.matchMedia('(hover: none)').matches
        )
            return;
        const rect = el.getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width - 0.5;
        const py = (e.clientY - rect.top) / rect.height - 0.5;
        const rotateY = px * 18;
        const rotateX = -py * 18;
        el.style.transition = 'transform 0.08s ease-out, box-shadow 0.3s ease-out';
        el.style.transform = `perspective(700px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.04, 1.04, 1.04)`;
    }

    function resetPfpTilt() {
        const el = pfpWrap;
        if (!el) return;
        el.style.transition = 'transform 0.5s ease-out, box-shadow 0.3s ease-out';
        el.style.transform = 'perspective(700px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    }

    $effect(() => {
        const el = langScroller;
        // Defer past first layout so scroll metrics are settled.
        const frame = requestAnimationFrame(() => updateLangScrollState());
        const onLoad = () => updateLangScrollState();
        window.addEventListener('load', onLoad);
        const ro =
            typeof ResizeObserver !== 'undefined' && el
                ? new ResizeObserver(() => updateLangScrollState())
                : null;
        if (el && ro) ro.observe(el);
        return () => {
            cancelAnimationFrame(frame);
            window.removeEventListener('load', onLoad);
            ro?.disconnect();
        };
    });

    function toggleMenu() {
        open = !open;
    }

    function toggleTheme() {
        darkMode = !darkMode;

        if (darkMode) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }

    function changeLanguage(code: Locale) {
        setLocale(code);
        langOpen = false;
    }

    // Prerendering is server-side, so the locale has to be registered
    // before the component tree renders.
    setupI18n();

    onMount(() => {
        restoreLocale();

        const stored = localStorage.getItem('theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (stored === 'dark' || (!stored && prefersDark)) {
            darkMode = true;
            document.documentElement.classList.add('dark');
        } else {
            darkMode = false;
            document.documentElement.classList.remove('dark');
        }

        const ids = ['profile', ...navLinks.map((l) => l.id)];
        const sections = ids
            .map((id) => document.getElementById(id))
            .filter((el): el is HTMLElement => el !== null);

        const observer = new IntersectionObserver(
            (entries) => {
                for (const entry of entries) {
                    if (entry.isIntersecting) {
                        activeSection = entry.target.id;
                    }
                }
            },
            { rootMargin: '-40% 0px -55% 0px', threshold: 0 },
        );

        sections.forEach((s) => observer.observe(s));

        const onHashChange = () => {
            const hash = window.location.hash.slice(1);
            if (hash) activeSection = hash;
        };
        window.addEventListener('hashchange', onHashChange);

        return () => {
            observer.disconnect();
            window.removeEventListener('hashchange', onHashChange);
        };
    });
</script>

<svelte:head>
    <title>Kuzey Bilgin — Fullstack Developer</title>
    <meta
        name="description"
        content="Mathematics major and Computer Science minor in Toronto, drawn to where the two fields overlap — cryptography, graph theory, and information theory. I build web apps, contribute to open source, and explore AI."
    />
    <link rel="canonical" href="https://kuzey.is-a.dev/" />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="Kuzey Bilgin" />
    <meta property="og:url" content="https://kuzey.is-a.dev/" />
    <meta property="og:title" content="Kuzey Bilgin — Fullstack Developer" />
    <meta
        property="og:description"
        content="Mathematics major and Computer Science minor in Toronto, drawn to where the two fields overlap — cryptography, graph theory, and information theory."
    />
    <meta property="og:image" content="https://kuzey.is-a.dev/profile-pic.png" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="Kuzey Bilgin — Fullstack Developer" />
    <meta
        name="twitter:description"
        content="Mathematics major and Computer Science minor in Toronto, drawn to where the two fields overlap — cryptography, graph theory, and information theory."
    />
    <meta name="twitter:image" content="https://kuzey.is-a.dev/profile-pic.png" />
</svelte:head>

<MouseGlow />

<!-- NAV WRAPPER -->
<header
    class="sticky top-0 z-40 w-full border-b border-outline/20 bg-background/80 backdrop-blur-md"
>
    <!-- DESKTOP NAV -->
    <nav class="hidden md:flex justify-between items-center px-10 py-4">
        <a
            href="#profile"
            class="font-bold text-xl rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >Kuzey Bilgin</a
        >

        <div class="relative flex items-center gap-6">
            <ul class="flex gap-5">
                {#each navLinks as link}
                    <li>
                        <a
                            href={`#${link.id}`}
                            aria-current={activeSection === link.id ? 'true' : undefined}
                            class={`rounded-full px-4 py-2 text-sm font-medium transition-colors duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                                activeSection === link.id
                                    ? 'bg-surface-variant text-on-surface'
                                    : 'text-on-surface-variant hover:bg-surface-variant hover:text-on-surface'
                            }`}
                        >
                            <T label={link.key} />
                        </a>
                    </li>
                {/each}
            </ul>

            <button
                type="button"
                onclick={toggleTheme}
                class="flex h-10 w-10 items-center justify-center rounded-full border border-outline/20 hover:bg-surface-variant transition-colors duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                aria-label="Toggle dark mode"
            >
                {#if darkMode}
                    <SunRegular size={18} />
                {:else}
                    <MoonRegular size={18} />
                {/if}
            </button>
            <button
                type="button"
                onclick={() => (langOpen = !langOpen)}
                class="flex h-10 w-10 items-center justify-center rounded-full border border-outline/20 hover:bg-surface-variant transition-colors duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                aria-label="Toggle language"
            >
                <EarthRegular size={18} />
            </button>

            <!-- DROPDOWN -->
            {#if langOpen}
                <div
                    class="absolute right-0 top-full z-50 mt-2 w-44 overflow-hidden rounded-2xl border border-outline/20 bg-white dark:bg-zinc-900 shadow-lg"
                >
                    {#each locales as lang}
                        <button
                            type="button"
                            class="w-full px-4 py-2 text-left text-sm text-gray-900 dark:text-gray-100 hover:bg-surface-variant transition-colors duration-300 ease-out flex items-center justify-between"
                            onclick={() => changeLanguage(lang.code)}
                        >
                            <span>{lang.label}</span>

                            {#if $locale === lang.code}
                                <CheckRegular size={16} />
                            {/if}
                        </button>
                    {/each}
                </div>
            {/if}
        </div>
    </nav>

    <!-- MOBILE NAV -->
    <nav class="md:hidden flex justify-between items-center px-6 py-4">
        <a
            href="#profile"
            class="font-bold text-xl rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >Kuzey Bilgin</a
        >

        <div class="flex items-center gap-3">
            <button
                type="button"
                onclick={toggleTheme}
                class="flex h-10 w-10 items-center justify-center rounded-full border border-outline/20 hover:bg-surface-variant transition-colors duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                aria-label="Toggle dark mode"
            >
                {#if darkMode}
                    <SunRegular size={18} />
                {:else}
                    <MoonRegular size={18} />
                {/if}
            </button>
            <button
                type="button"
                onclick={() => (langOpen = !langOpen)}
                class="flex h-10 w-10 items-center justify-center rounded-full border border-outline/20 hover:bg-surface-variant transition-colors duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                aria-label="Toggle language"
                aria-expanded={langOpen}
            >
                <EarthRegular size={18} />
            </button>

            <button
                type="button"
                onclick={toggleMenu}
                class="flex h-10 w-10 items-center justify-center rounded-full border border-outline/20 hover:bg-surface-variant transition-colors duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                aria-label="Toggle menu"
                aria-expanded={open}
            >
                {#if open}
                    <CloseRegular size={18} />
                {:else}
                    <MenuRegular size={18} />
                {/if}
            </button>
        </div>
    </nav>

    {#if langOpen}
        <div
            class="md:hidden mx-6 mb-4 rounded-2xl border border-outline/20 bg-surface shadow-lg p-2"
        >
            {#each locales as lang}
                <button
                    type="button"
                    class="text-left px-4 py-2 text-sm flex items-center justify-between w-full rounded-xl hover:bg-surface-variant transition-colors duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    onclick={() => changeLanguage(lang.code)}
                >
                    <span>{lang.label}</span>

                    {#if $locale === lang.code}
                        <CheckRegular size={16} />
                    {/if}
                </button>
            {/each}
        </div>
    {/if}

    <!-- MOBILE MENU -->
    {#if open}
        <div class="md:hidden flex flex-col gap-1 px-6 pb-6">
            {#each navLinks as link}
                <a
                    class={`text-lg py-2 px-4 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary transition-colors duration-300 ease-out ${
                        activeSection === link.id
                            ? 'bg-surface-variant text-on-surface'
                            : 'text-on-surface-variant'
                    }`}
                    href={`#${link.id}`}
                    onclick={toggleMenu}
                >
                    <T label={link.key} />
                </a>
            {/each}
        </div>
    {/if}
</header>

<!-- PROFILE -->
<section
    id="profile"
    class="min-h-[85vh] flex flex-col md:flex-row items-center justify-center gap-12 px-6 md:px-10 mb-12 md:mb-24"
>
    <!-- subtle background wrapper -->
    <div
        class="w-full max-w-4xl rounded-3xl bg-gray-200/40 dark:bg-zinc-800/60 border border-outline/20 px-6 md:px-10 py-10 md:py-16 flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12 shadow-sm"
    >
        <div
            class="pfp-wrap w-[240px] h-[240px] md:w-[300px] md:h-[300px]"
            role="presentation"
            bind:this={pfpWrap}
            onmousemove={handlePfpMove}
            onmouseleave={resetPfpTilt}
        >
            <div class="pfp-glow" aria-hidden="true"></div>
            <img
                src="/profile-pic.png"
                width="512"
                height="512"
                fetchpriority="high"
                class="relative z-[1] block h-full w-full rounded-full object-cover"
                alt="Portrait of Kuzey Bilgin"
            />
        </div>

        <!-- TEXT -->
        <div class="text-center md:text-left max-w-xl">
            <p class="text-lg font-medium tracking-wide text-gray-500 dark:text-gray-400">
                <T label="profile.greeting" />
            </p>

            <h1
                class="text-5xl md:text-6xl font-bold tracking-tight text-balance text-gray-900 dark:text-gray-50 leading-[1.05]"
            >
                <T label="profile.name" />
            </h1>

            <p class="text-xl text-gray-600 dark:text-gray-300 mt-3">
                <T label="profile.role" />
            </p>

            <!-- BUTTONS -->
            <div class="flex flex-wrap gap-4 md:gap-6 mt-8 justify-center md:justify-start">
                <button
                    type="button"
                    class="px-6 py-3 rounded-full bg-gray-200 dark:bg-zinc-800 text-gray-900 dark:text-gray-100 font-medium text-base hover:bg-gray-300 dark:hover:bg-zinc-700 transition-colors duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    onclick={() => window.open('/resume.pdf', '_blank')}
                >
                    <T label="profile.downloadCv" />
                </button>

                <button
                    type="button"
                    class="px-6 py-3 rounded-full bg-gray-900 dark:bg-white text-white dark:text-black font-medium text-base hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    onclick={() => (location.href = '#contact')}
                >
                    <T label="profile.contactInfo" />
                </button>
            </div>

            <!-- SOCIALS -->
            <div class="flex gap-6 mt-8 justify-center md:justify-start">
                {#each socials as s}
                    <button
                        type="button"
                        class="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10
                             hover:bg-surface-variant transition-colors duration-300 ease-out
                                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                        onclick={() => window.open(s.url, '_blank')}
                        aria-label={s.name}
                    >
                        <s.icon size={22} />
                    </button>
                {/each}
            </div>
        </div>
    </div>
</section>

<!-- ABOUT -->
<section id="about" class="px-6 py-16">
    <h2
        class="mb-10 md:mb-12 text-center text-balance text-3xl md:text-4xl font-semibold tracking-tight text-on-surface"
    >
        <T label="sections.about" />
    </h2>

    <div class="mx-auto flex max-w-5xl flex-col items-center gap-10 md:flex-row md:items-stretch">
        <!-- IMAGE -->
        <div
            class="relative h-72 w-72 shrink-0 overflow-hidden rounded-3xl border border-outline/20 bg-surface shadow-sm md:h-auto md:min-h-72"
        >
            <img
                src="/about-pic.png"
                width="1000"
                height="1000"
                loading="lazy"
                alt="Portrait of Kuzey Bilgin"
                class="h-full w-full object-cover"
            />
        </div>

        <!-- CONTENT -->
        <div class="flex w-full flex-1 flex-col gap-6">
            <!-- INFO CARDS -->
            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <!-- EXPERIENCE -->
                <div
                    class="flex items-start gap-4 rounded-2xl border border-outline/20 bg-surface p-4"
                >
                    <div
                        class="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10"
                    >
                        <BriefcaseRegular size={20} />
                    </div>

                    <div>
                        <h3 class="text-lg font-semibold text-on-surface">
                            <T label="sections.experience" />
                        </h3>
                        <p class="text-sm text-on-surface-variant">
                            <T label="experience.years" />
                        </p>
                    </div>
                </div>

                <!-- EDUCATION -->
                <div
                    class="flex items-start gap-4 rounded-2xl border border-outline/20 bg-surface p-4"
                >
                    <div
                        class="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10"
                    >
                        <MortarboardRegular size={20} />
                    </div>

                    <div>
                        <h3 class="text-lg font-semibold text-on-surface">
                            <T label="sections.education" />
                        </h3>
                        <p class="text-sm text-on-surface-variant">
                            <T label="experience.degree" />
                        </p>
                    </div>
                </div>
            </div>

            <!-- DESCRIPTION -->
            <div
                class="flex flex-1 flex-col justify-start rounded-2xl border border-outline/10 bg-surface-variant/20 p-5 md:p-6"
            >
                <p class="text-sm leading-relaxed text-on-surface-variant">
                    <T label="about.description" />
                </p>
            </div>
        </div>
    </div>
</section>

<!-- EXPERIENCE -->
<section id="experience" class="px-6 py-16">
    <h2
        class="mb-10 md:mb-12 text-center text-balance text-3xl md:text-4xl font-semibold tracking-tight text-on-surface"
    >
        <T label="sections.experience" />
    </h2>

    <div class="mx-auto grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-2">
        <!-- FRONTEND -->
        <article class="rounded-2xl border border-outline/20 bg-surface p-6 shadow-sm">
            <h3 class="mb-6 text-center text-xl font-semibold text-on-surface">
                <T label="experience.frontend" />
            </h3>

            <ul class="space-y-3">
                {#each frontendSkills as skill}
                    <li class="flex items-center gap-4 rounded-xl p-3">
                        <div
                            class="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10"
                        >
                            <CheckRegular size={20} />
                        </div>

                        <div class="text-left">
                            <p class="font-medium text-on-surface">
                                {skill.name}
                            </p>
                            <p class="text-sm text-on-surface-variant">
                                <T label={skill.levelKey} />
                            </p>
                        </div>
                    </li>
                {/each}
            </ul>
        </article>

        <!-- BACKEND -->
        <article class="rounded-2xl border border-outline/20 bg-surface p-6 shadow-sm">
            <h3 class="mb-6 text-center text-xl font-semibold text-on-surface">
                <T label="experience.backend" />
            </h3>

            <ul class="space-y-3">
                {#each backendSkills as skill}
                    <li class="flex items-center gap-4 rounded-xl p-3">
                        <div
                            class="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10"
                        >
                            <CheckRegular size={20} />
                        </div>

                        <div class="text-left">
                            <p class="font-medium text-on-surface">
                                {skill.name}
                            </p>
                            <p class="text-sm text-on-surface-variant">
                                <T label={skill.levelKey} />
                            </p>
                        </div>
                    </li>
                {/each}
            </ul>
        </article>
    </div>
</section>

<!-- LANGUAGES -->
<section id="languages" class="px-6 py-16">
    <h2
        class="mb-10 md:mb-12 text-center text-balance text-3xl md:text-4xl font-semibold tracking-tight text-on-surface"
    >
        <T label="sections.languages" />
    </h2>

    <!-- Mobile carousel -->
    <div class="mx-auto flex max-w-5xl items-center justify-center gap-3 md:hidden">
        <button
            type="button"
            onclick={() => scrollLangs(-1)}
            disabled={!canScrollPrev}
            aria-label="Scroll languages left"
            class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-outline/20 transition-colors duration-300 ease-out hover:bg-surface-variant disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent dark:disabled:hover:bg-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
            <LeftRegular size={20} />
        </button>

        <div
            bind:this={langScroller}
            onscroll={updateLangScrollState}
            class="flex flex-nowrap items-center gap-3 overflow-x-auto px-1 py-2 snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
            {#each languages as lang}
                <a
                    href={lang.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={lang.name}
                    class="flex h-24 w-24 shrink-0 snap-start flex-col items-center justify-center gap-1.5 rounded-2xl border border-outline/20 bg-surface p-2 shadow-sm transition duration-300 ease-out motion-safe:hover:-translate-y-1 hover:shadow-md hover:border-outline/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                    <img
                        src={lang.icon}
                        alt=""
                        aria-hidden="true"
                        loading="lazy"
                        width="48"
                        height="48"
                        class="h-12 w-12 object-contain"
                    />
                    <span class="max-w-full truncate text-xs font-medium text-on-surface-variant"
                        >{lang.name}</span
                    >
                </a>
            {/each}
        </div>

        <button
            type="button"
            onclick={() => scrollLangs(1)}
            disabled={!canScrollNext}
            aria-label="Scroll languages right"
            class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-outline/20 transition-colors duration-300 ease-out hover:bg-surface-variant disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent dark:disabled:hover:bg-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
            <RightRegular size={20} />
        </button>
    </div>
    <div class="mx-auto mt-3 max-w-5xl md:hidden" aria-hidden="true">
        <div class="mx-auto h-1 w-24 overflow-hidden rounded-full bg-surface-variant">
            <div
                class="h-full w-8 rounded-full bg-on-surface-variant transition-transform duration-300 ease-out"
                style={`transform: translateX(${Math.round(langProgress * 64)}px)`}
            ></div>
        </div>
    </div>

    <!-- Desktop grid: all 8 visible, no scroll -->
    <div class="mx-auto hidden max-w-5xl gap-3 md:grid md:grid-cols-4 lg:grid-cols-8">
        {#each languages as lang}
            <a
                href={lang.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={lang.name}
                class="flex aspect-square w-full flex-col items-center justify-center gap-1.5 rounded-2xl border border-outline/20 bg-surface p-2 shadow-sm transition duration-300 ease-out motion-safe:hover:-translate-y-1 hover:shadow-md hover:border-outline/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
                <img
                    src={lang.icon}
                    alt=""
                    aria-hidden="true"
                    loading="lazy"
                    width="48"
                    height="48"
                    class="h-12 w-12 object-contain md:h-14 md:w-14"
                />
                <span class="max-w-full truncate text-xs font-medium text-on-surface-variant"
                    >{lang.name}</span
                >
            </a>
        {/each}
    </div>
</section>

<!-- PROJECTS -->
<section id="projects" class="px-6 py-16">
    <h2
        class="mb-10 md:mb-12 text-center text-balance text-3xl md:text-4xl font-semibold tracking-tight text-on-surface"
    >
        <T label="sections.projects" />
    </h2>

    <div class="mx-auto grid max-w-5xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {#each projects as project}
            <article
                class="group flex flex-col overflow-hidden rounded-2xl border border-outline/20 bg-surface
               shadow-sm transition duration-300 ease-out motion-safe:hover:-translate-y-1 hover:shadow-md hover:border-outline/50"
            >
                <!-- Image -->
                <div class="relative h-44 w-full overflow-hidden bg-surface-variant">
                    <img
                        src={project.img}
                        width="1080"
                        height="1080"
                        loading="lazy"
                        alt={$_(project.titleKey)}
                        class="h-full w-full object-cover"
                    />
                </div>

                <!-- Content -->
                <div class="flex flex-1 flex-col p-5 text-center">
                    <h3 class="text-lg font-semibold text-on-surface">
                        <T label={project.titleKey} />
                    </h3>

                    <!-- Actions -->
                    <div class="mt-auto flex justify-center gap-3 pt-5">
                        <button
                            type="button"
                            class="rounded-full border border-outline/20 px-4 py-2 text-sm font-medium
                     text-on-surface-variant transition-colors duration-300 ease-out
                     hover:bg-surface-variant hover:text-on-surface
                     focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                            onclick={() => window.open(project.github, '_blank')}
                        >
                            GitHub
                        </button>

                        <button
                            type="button"
                            class="rounded-full bg-primary dark:bg-slate-200 px-4 py-2 text-sm font-medium text-white dark:text-slate-900 transition-colors duration-300 ease-out hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                            onclick={() => window.open(project.live, '_blank')}
                        >
                            <T label="projects.live" />
                        </button>
                    </div>
                </div>
            </article>
        {/each}
    </div>
</section>

<!-- CONTACT -->
<section id="contact" class="px-6 py-16 text-center">
    <h2
        class="mb-10 md:mb-12 text-balance text-3xl md:text-4xl font-semibold tracking-tight text-on-surface"
    >
        <T label="sections.contact" />
    </h2>

    <div class="mx-auto flex max-w-2xl flex-col gap-4 md:flex-row md:justify-center">
        <div
            class="group relative flex flex-1 items-center gap-4 rounded-2xl border border-outline/20 bg-surface px-5 py-4
             shadow-sm transition duration-300 ease-out motion-safe:hover:-translate-y-1 hover:shadow-md hover:border-outline/50
             focus-within:ring-2 focus-within:ring-primary"
        >
            <div
                class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10"
            >
                <MailRegular size={20} />
            </div>

            <a
                href={`mailto:${emailAddress}`}
                class="min-w-0 flex-1 text-left rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary
                 before:absolute before:inset-0 before:rounded-2xl before:content-['']"
            >
                <p class="text-sm text-on-surface-variant">
                    <T label="contact.email" />
                </p>
                <p
                    class="truncate font-medium text-on-surface group-hover:text-primary transition-colors duration-300 ease-out select-all"
                >
                    {emailAddress}
                </p>
            </a>

            <button
                type="button"
                onclick={(e) => {
                    e.stopPropagation();
                    copyText(emailAddress, 'email');
                }}
                aria-label={$_('contact.copyEmail')}
                title={$_('contact.copyEmail')}
                class="relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-on-surface-variant transition-colors duration-300 ease-out hover:bg-surface-variant hover:text-on-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
                <span
                    aria-hidden="true"
                    class={`pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 rounded-full bg-on-surface px-2.5 py-1 text-xs font-medium whitespace-nowrap text-surface shadow-md transition-all duration-200 ${
                        copied === 'email'
                            ? 'translate-y-0 opacity-100'
                            : 'pointer-events-none translate-y-1 opacity-0'
                    }`}
                >
                    <T label="contact.copied" />
                </span>
                {#if copied === 'email'}
                    <CheckRegular size={16} />
                {:else}
                    <CopyRegular size={16} />
                {/if}
            </button>
        </div>

        <div
            class="group relative flex flex-1 items-center gap-4 rounded-2xl border border-outline/20 bg-surface px-5 py-4
             shadow-sm transition duration-300 ease-out motion-safe:hover:-translate-y-1 hover:shadow-md hover:border-outline/50
             focus-within:ring-2 focus-within:ring-primary"
        >
            <div
                class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10"
            >
                <LinkedinFilled size={22} />
            </div>

            <a
                href={linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                class="min-w-0 flex-1 text-left rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary
                 before:absolute before:inset-0 before:rounded-2xl before:content-['']"
            >
                <p class="text-sm text-on-surface-variant">
                    <T label="contact.linkedin" />
                </p>
                <p
                    class="truncate font-medium text-on-surface group-hover:text-primary transition-colors duration-300 ease-out"
                >
                    {linkedinHandle}
                </p>
            </a>

            <button
                type="button"
                onclick={(e) => {
                    e.stopPropagation();
                    copyText(linkedinUrl, 'linkedin');
                }}
                aria-label={$_('contact.copyLink')}
                title={$_('contact.copyLink')}
                class="relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-on-surface-variant transition-colors duration-300 ease-out hover:bg-surface-variant hover:text-on-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
                <span
                    aria-hidden="true"
                    class={`pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 rounded-full bg-on-surface px-2.5 py-1 text-xs font-medium whitespace-nowrap text-surface shadow-md transition-all duration-200 ${
                        copied === 'linkedin'
                            ? 'translate-y-0 opacity-100'
                            : 'pointer-events-none translate-y-1 opacity-0'
                    }`}
                >
                    <T label="contact.copied" />
                </span>
                {#if copied === 'linkedin'}
                    <CheckRegular size={16} />
                {:else}
                    <CopyRegular size={16} />
                {/if}
            </button>
        </div>
    </div>

    <p class="mx-auto mt-6 max-w-2xl text-sm text-on-surface-variant">
        <T label="contact.location" />
    </p>

    <div aria-live="polite" role="status" class="sr-only">
        {#if copied}
            <T label="contact.copied" />
        {/if}
    </div>
</section>

<!-- FOOTER -->
<footer class="border-t border-outline/20 bg-surface-variant/20 py-12 text-center">
    <nav aria-label="Footer navigation">
        <ul class="mx-auto flex max-w-3xl flex-wrap justify-center gap-2 sm:gap-4">
            {#each navLinks as link}
                <li>
                    <a
                        href={`#${link.id}`}
                        class={`rounded-full px-4 py-2 text-sm font-medium transition-colors duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                            activeSection === link.id
                                ? 'bg-surface-variant text-on-surface'
                                : 'text-on-surface-variant hover:bg-surface-variant hover:text-on-surface'
                        }`}
                    >
                        <T label={link.key} />
                    </a>
                </li>
            {/each}
        </ul>
    </nav>

    <div class="mx-auto mt-8 max-w-3xl">
        <p class="text-sm text-on-surface-variant">
            <T label="footer.rights" />
        </p>
    </div>
</footer>

<style>
    section[id] {
        scroll-margin-top: 88px;
    }

    .pfp-wrap {
        position: relative;
        isolation: isolate;
        border-radius: 9999px;
        padding: 5px;
        transform-style: preserve-3d;
        will-change: transform;
        /* Brushed-metal base ring — always visible, no diffuse halo
           so it never muddies the yellow MouseGlow. */
        background: linear-gradient(
            145deg,
            #f4f4f6 0%,
            #c6c6cd 22%,
            #8e8e99 48%,
            #e2e2e7 72%,
            #a9a9b3 100%
        );
        box-shadow:
            0 1px 2px rgba(0, 0, 0, 0.12),
            inset 0 1px 1px rgba(255, 255, 255, 0.8);
        transition:
            transform 0.5s ease-out,
            box-shadow 0.3s ease-out;
    }

    :global(.dark) .pfp-wrap {
        background: linear-gradient(
            145deg,
            #43434b 0%,
            #6d6d78 22%,
            #232328 48%,
            #8b8b96 72%,
            #4a4a52 100%
        );
        box-shadow:
            0 1px 2px rgba(0, 0, 0, 0.5),
            inset 0 1px 1px rgba(255, 255, 255, 0.15);
    }

    .pfp-wrap img {
        display: block;
        border-radius: 9999px;
        transform: translateZ(0);
        transition: transform 0.5s ease-out;
    }

    .pfp-wrap:hover img,
    .pfp-wrap:focus-within img {
        transform: translateZ(30px);
    }

    /* Rotating sheen confined to the 5px ring (center is covered
       by the img at z-index 1). Crisp conic streaks, zero blur. */
    .pfp-glow {
        position: absolute;
        inset: 0;
        border-radius: 9999px;
        background: conic-gradient(
            from 210deg,
            transparent 0deg,
            #ffffff 18deg,
            transparent 42deg,
            transparent 138deg,
            rgba(255, 255, 255, 0.9) 162deg,
            transparent 186deg,
            transparent 278deg,
            #ffffff 302deg,
            transparent 326deg
        );
        opacity: 0;
        transition: opacity 0.35s ease-out;
        z-index: 0;
        pointer-events: none;
    }

    .pfp-wrap:hover .pfp-glow,
    .pfp-wrap:focus-within .pfp-glow {
        opacity: 1;
        animation: pfp-sheen 7s linear infinite;
    }

    .pfp-wrap:hover,
    .pfp-wrap:focus-within {
        box-shadow:
            0 0 0 1px rgba(140, 140, 150, 0.55),
            0 10px 30px rgba(0, 0, 0, 0.18);
    }

    :global(.dark) .pfp-wrap:hover,
    :global(.dark) .pfp-wrap:focus-within {
        box-shadow:
            0 0 0 1px rgba(200, 200, 210, 0.45),
            0 10px 30px rgba(0, 0, 0, 0.55);
    }

    @keyframes pfp-sheen {
        to {
            transform: rotate(360deg);
        }
    }

    @media (hover: none) {
        .pfp-glow {
            display: none;
        }
        .pfp-wrap {
            transform: none !important;
        }
        .pfp-wrap img {
            transform: none !important;
        }
    }

    @media (prefers-reduced-motion: reduce) {
        .pfp-wrap:hover .pfp-glow,
        .pfp-wrap:focus-within .pfp-glow {
            animation: none;
            opacity: 0.7;
        }
        .pfp-wrap,
        .pfp-glow,
        .pfp-wrap img {
            transition: none;
        }
        .pfp-wrap {
            transform: none !important;
        }
        .pfp-wrap img {
            transform: none !important;
        }
    }
</style>
