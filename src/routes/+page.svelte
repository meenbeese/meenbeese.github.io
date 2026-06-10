<script lang="ts">
    import { language } from '$lib/api/i18n';
    import { initI18n } from '$lib/api/bootstrap';
    import { onMount } from 'svelte';

    import Check from '@lucide/svelte/icons/check';
    import Globe from '@lucide/svelte/icons/globe';
    import Moon from '@lucide/svelte/icons/moon';
    import Sun from '@lucide/svelte/icons/sun';

    import MouseGlow from '$lib/components/MouseGlow.svelte';
    import T from '$lib/components/T.svelte';
    import { navLinks } from '$lib/data/nav';
    import { projects } from '$lib/data/projects';
    import { frontendSkills } from '$lib/data/skills';
    import { backendSkills } from '$lib/data/skills';
    import { languages } from '$lib/data/langs';
    import { socials } from '$lib/data/socials';

    let open = $state(false);
    let darkMode = $state(false);
    let langOpen = $state(false);

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

    function setLanguage(code: string) {
        language.set(code);
        localStorage.setItem('language', code);
        langOpen = false;
    }

    onMount(() => {
        initI18n();

        const savedTheme = localStorage.getItem('theme');
        const savedLang = localStorage.getItem('language');

        if (savedTheme === 'dark') {
            darkMode = true;
            document.documentElement.classList.add('dark');
        } else {
            darkMode = false;
            document.documentElement.classList.remove('dark');
        }

        if (savedLang) {
            language.set(savedLang);
        }
    });
</script>

<MouseGlow />

<!-- NAV WRAPPER -->
<header class="w-full">
    <!-- DESKTOP NAV -->
    <nav class="hidden md:flex justify-between items-center px-10 py-6">
        <div class="font-bold text-xl">Kuzey Bilgin</div>

        <div class="flex items-center gap-8">
            <ul class="flex gap-8">
                {#each navLinks as link}
                    <li>
                        <a
                            class="hover:text-gray-500 transition"
                            href={`#${link.id}`}
                        >
                            <T label={link.label} />
                        </a>
                    </li>
                {/each}
            </ul>

            <button
                onclick={toggleTheme}
                class="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 hover:bg-gray-100 transition"
                aria-label="Toggle dark mode"
            >
                {#if darkMode}
                    <Sun size={18} />
                {:else}
                    <Moon size={18} />
                {/if}
            </button>
            <button
                onclick={() => (langOpen = !langOpen)}
                class="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 hover:bg-gray-100 transition"
                aria-label="Toggle language"
            >
                <Globe size={18} />
            </button>

            <!-- DROPDOWN -->
            {#if langOpen}
                <div
                    class="absolute right-10 top-20 z-50 w-56 rounded-xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 shadow-lg"
                >
                    {#each languages as lang}
                        <button
                            class="w-full px-4 py-2 text-left text-sm text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-zinc-800 transition flex items-center justify-between"
                            onclick={() => setLanguage(lang.code)}
                        >
                            <span>{lang.label}</span>

                            {#if $language === lang.code}
                                <Check size={16} />
                            {/if}
                        </button>
                    {/each}
                </div>
            {/if}
        </div>
    </nav>

    <!-- MOBILE NAV -->
    <nav class="md:hidden flex justify-between items-center px-6 py-6">
        <div class="font-bold text-xl">Kuzey Bilgin</div>

        <div class="flex items-center gap-3">
            <button
                onclick={toggleTheme}
                class="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 hover:bg-gray-100 transition"
                aria-label="Toggle dark mode"
            >
                {#if darkMode}
                    <Sun size={18} />
                {:else}
                    <Moon size={18} />
                {/if}
            </button>
            <button
                onclick={() => (langOpen = !langOpen)}
                class="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 hover:bg-gray-100 transition"
                aria-label="Toggle language"
            >
                <Globe size={18} />
            </button>

            {#if langOpen}
                <div class="px-6 pb-4 flex flex-col gap-2">
                    {#each languages as lang}
                        <button
                            class="text-left py-2 text-sm flex items-center justify-between w-full"
                            onclick={() => setLanguage(lang.code)}
                        >
                            <span>{lang.label}</span>

                            {#if $language === lang.code}
                                <Check size={16} />
                            {/if}
                        </button>
                    {/each}
                </div>
            {/if}

            <button onclick={toggleMenu} class="flex flex-col gap-1">
                <span class="w-6 h-0.5 bg-black"></span>
                <span class="w-6 h-0.5 bg-black"></span>
                <span class="w-6 h-0.5 bg-black"></span>
            </button>
        </div>
    </nav>

    <!-- MOBILE MENU -->
    {#if open}
        <div class="md:hidden flex flex-col gap-4 px-6 pb-6">
            {#each navLinks as link}
                <a
                    class="text-lg py-2"
                    href={`#${link.id}`}
                    onclick={toggleMenu}
                >
                    {link.label}
                </a>
            {/each}
        </div>
    {/if}
</header>

<!-- PROFILE -->
<section
    id="profile"
    class="min-h-[85vh] flex flex-col md:flex-row items-center justify-center gap-12 px-10 mb-24"
>
    <!-- subtle background wrapper -->
    <div class="w-full max-w-4xl rounded-3xl bg-gray-200/40 dark:bg-zinc-900/30 px-10 py-16 flex flex-col md:flex-row items-center justify-center gap-12">

        <div class="w-[240px] h-[240px] md:w-[300px] md:h-[300px]">
            <img
                src="/profile-pic.png"
                class="w-full h-full object-cover rounded-full border border-gray-200 shadow-md"
                alt="Profile picture"
            />
        </div>

        <!-- TEXT -->
        <div class="text-center md:text-left max-w-xl">
            <p class="text-2xl text-gray-500">
                <T label="Hello, I'm" />
            </p>

            <h1
                class="text-6xl md:text-7xl font-bold tracking-tight text-gray-900 leading-tight"
            >
                Kuzey
            </h1>

            <p class="text-2xl text-gray-600 mt-2">
                <T label="Fullstack Developer" />
            </p>

            <!-- BUTTONS -->
            <div class="flex gap-6 mt-8 justify-center md:justify-start">
                <button
                    class="px-6 py-3 rounded-full bg-gray-200 dark:bg-zinc-800 text-gray-900 dark:text-gray-100 font-medium text-lg hover:bg-gray-300 dark:hover:bg-zinc-700 transition"
                    onclick={() => window.open('/resume-example.pdf', '_blank')}
                >
                    <T label="Download CV" />
                </button>

                <button
                    class="px-6 py-3 rounded-full bg-gray-900 dark:bg-white text-white dark:text-black font-medium text-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition"
                    onclick={() => (location.href = '#contact')}
                >
                    <T label="Contact Info" />
                </button>
            </div>

            <!-- SOCIALS -->
            <div class="flex gap-6 mt-8 justify-center md:justify-start">
                {#each socials as s}
                    <button
                        class="w-12 h-12 flex items-center justify-center rounded-full bg-gray-100 dark:bg-zinc-800
                             hover:bg-gray-200 dark:hover:bg-zinc-700 transition
                               focus:outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-zinc-600"
                        onclick={() => window.open(s.url, '_blank')}
                    >
                        <img src={s.img} class="w-7 h-7" alt="social icon" />
                    </button>
                {/each}
            </div>

        </div>
    </div>
</section>

<!-- ABOUT -->
<section id="about" class="px-6 py-16">
    <h2
        class="mb-12 text-center text-4xl font-semibold tracking-tight text-on-surface"
    >
        <T label="About Me" />
    </h2>

    <div
        class="mx-auto flex max-w-5xl flex-col items-center gap-10 md:flex-row md:items-start"
    >
        <!-- IMAGE -->
        <div
            class="relative h-72 w-72 overflow-hidden rounded-3xl border border-outline/20 bg-surface shadow-sm"
        >
            <img
                src="/about-pic.png"
                alt="About me image"
                class="h-full w-full object-cover"
            />
        </div>

        <!-- CONTENT -->
        <div class="flex-1 space-y-6">
            <!-- INFO CARDS -->
            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <!-- EXPERIENCE -->
                <div
                    class="flex items-start gap-4 rounded-2xl border border-outline/20 bg-surface p-4"
                >
                    <div
                        class="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10"
                    >
                        <img
                            src="/experience.png"
                            class="h-5 w-5"
                            alt="experience icon"
                        />
                    </div>

                    <div>
                        <h3 class="font-semibold text-on-surface">
                            Experience
                        </h3>
                        <p class="text-sm text-on-surface-variant">
                            2+ years Frontend Development
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
                        <img
                            src="/education.png"
                            class="h-5 w-5"
                            alt="education icon"
                        />
                    </div>

                    <div>
                        <h3 class="font-semibold text-on-surface">Education</h3>
                        <p class="text-sm text-on-surface-variant">
                            Bachelor of Science
                        </p>
                    </div>
                </div>
            </div>

            <!-- DESCRIPTION -->
            <div
                class="rounded-2xl border border-outline/10 bg-surface-variant/20 p-5"
            >
                <p class="text-sm leading-relaxed text-on-surface-variant">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Quisquam, quos, doloremque voluptatem asperiores
                    reprehenderit saepe nulla pariatur eligendi tempora.
                </p>
            </div>
        </div>
    </div>
</section>

<!-- EXPERIENCE -->
<section id="experience" class="px-6 py-16">
    <h2
        class="mb-12 text-center text-4xl font-semibold tracking-tight text-on-surface"
    >
        <T label="Experience" />
    </h2>

    <div class="mx-auto grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-2">
        <!-- FRONTEND -->
        <article
            class="rounded-2xl border border-outline/20 bg-surface p-6 shadow-sm transition hover:shadow-md"
        >
            <h3 class="mb-6 text-center text-xl font-semibold text-on-surface">
                <T label="Frontend Development" />
            </h3>

            <ul class="space-y-3">
                {#each frontendSkills as skill}
                    <li
                        class="group flex items-center gap-4 rounded-xl p-3 transition
                   hover:bg-surface-variant/40"
                    >
                        <div
                            class="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10"
                        >
                            <img
                                src="/checkmark.png"
                                class="h-4 w-4"
                                alt="check"
                            />
                        </div>

                        <div class="text-left">
                            <p
                                class="font-medium text-on-surface group-hover:text-primary transition"
                            >
                                {skill.name}
                            </p>
                            <p class="text-sm text-on-surface-variant">
                                {skill.level}
                            </p>
                        </div>
                    </li>
                {/each}
            </ul>
        </article>

        <!-- BACKEND -->
        <article
            class="rounded-2xl border border-outline/20 bg-surface p-6 shadow-sm transition hover:shadow-md"
        >
            <h3 class="mb-6 text-center text-xl font-semibold text-on-surface">
                <T label="Backend Development" />
            </h3>

            <ul class="space-y-3">
                {#each backendSkills as skill}
                    <li
                        class="group flex items-center gap-4 rounded-xl p-3 transition
                   hover:bg-surface-variant/40"
                    >
                        <div
                            class="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10"
                        >
                            <img
                                src="/checkmark.png"
                                class="h-4 w-4"
                                alt="check"
                            />
                        </div>

                        <div class="text-left">
                            <p
                                class="font-medium text-on-surface group-hover:text-primary transition"
                            >
                                {skill.name}
                            </p>
                            <p class="text-sm text-on-surface-variant">
                                {skill.level}
                            </p>
                        </div>
                    </li>
                {/each}
            </ul>
        </article>
    </div>
</section>

<!-- PROJECTS -->
<section id="projects" class="px-6 py-16">
    <h2
        class="mb-12 text-center text-4xl font-semibold tracking-tight text-on-surface"
    >
        <T label="Projects" />
    </h2>

    <div
        class="mx-auto grid max-w-6xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
    >
        {#each projects as project}
            <article
                class="group flex flex-col overflow-hidden rounded-2xl border border-outline/20 bg-surface
               transition hover:shadow-lg hover:border-outline/40"
            >
                <!-- Image -->
                <div
                    class="relative h-44 w-full overflow-hidden bg-surface-variant"
                >
                    <img
                        src={project.img}
                        alt={project.title}
                        class="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                    />
                </div>

                <!-- Content -->
                <div class="flex flex-1 flex-col p-5 text-center">
                    <h3 class="text-lg font-semibold text-on-surface">
                        {project.title}
                    </h3>

                    <!-- Actions -->
                    <div class="mt-auto flex justify-center gap-3 pt-5">
                        <button
                            class="rounded-full border border-outline/30 px-4 py-2 text-sm font-medium
                     text-on-surface-variant transition
                     hover:bg-surface-variant hover:text-on-surface
                     focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                            onclick={() =>
                                window.open(project.github, '_blank')}
                        >
                            GitHub
                        </button>

                        <button
                            class="rounded-full bg-primary dark:bg-slate-200 px-4 py-2 text-sm font-medium text-white dark:text-slate-900"
                            onclick={() => window.open(project.live, '_blank')}
                        >
                            <T label="Live" />
                        </button>
                    </div>
                </div>
            </article>
        {/each}
    </div>
</section>

<!-- CONTACT -->
<section id="contact" class="px-6 py-16 text-center">
    <h2 class="mb-10 text-4xl font-semibold tracking-tight text-on-surface">
        <T label="Contact Me" />
    </h2>

    <div
        class="mx-auto flex max-w-2xl flex-col gap-4 md:flex-row md:justify-center"
    >
        <a
            href="mailto:kuzeybilgin@proton.me"
            class="group flex items-center gap-4 rounded-xl border border-outline/20 bg-surface px-5 py-4
             transition hover:shadow-md hover:border-outline/40
             focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
            <div
                class="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10"
            >
                <img src="/email.png" class="h-5 w-5" alt="Email icon" />
            </div>

            <div class="text-left">
                <p class="text-sm text-on-surface-variant">Email</p>
                <p
                    class="font-medium text-on-surface group-hover:text-primary transition"
                >
                    <T label="Email Me" />
                </p>
            </div>
        </a>

        <a
            href="https://www.linkedin.com"
            class="group flex items-center gap-4 rounded-xl border border-outline/20 bg-surface px-5 py-4
             transition hover:shadow-md hover:border-outline/40
             focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
            <div
                class="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10"
            >
                <img src="/linkedin.png" class="h-5 w-5" alt="LinkedIn icon" />
            </div>

            <div class="text-left">
                <p class="text-sm text-on-surface-variant">LinkedIn</p>
                <p
                    class="font-medium text-on-surface group-hover:text-primary transition"
                >
                    <T label="My LinkedIn" />
                </p>
            </div>
        </a>
    </div>
</section>

<!-- FOOTER -->
<footer class="border-t bg-surface-variant/20 py-12 text-center">
    <nav aria-label="Footer navigation">
        <ul
            class="mx-auto flex max-w-3xl flex-wrap justify-center gap-2 sm:gap-4"
        >
            {#each navLinks as link}
                <li>
                    <a
                        href={`#${link.id}`}
                        class="rounded-full px-4 py-2 text-sm font-medium text-on-surface-variant transition
                   hover:bg-surface-variant hover:text-on-surface
                   focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    >
                        <T label={link.label} />
                    </a>
                </li>
            {/each}
        </ul>
    </nav>

    <div class="mx-auto mt-8 max-w-3xl">
        <div class="h-px w-full bg-outline/20 mb-6"></div>

        <p class="text-sm text-on-surface-variant">
            © 2026 Kuzey Bilgin. All rights reserved.
        </p>
    </div>
</footer>
