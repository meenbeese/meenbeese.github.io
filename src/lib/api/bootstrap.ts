import { language, translatePage } from '$lib/api/i18n';
import { navLinks } from '$lib/data/nav';
import { projects } from '$lib/data/projects';
import { frontendSkills, backendSkills } from '$lib/data/skills';
import { socials } from '$lib/data/socials';

const labels = [
    ...navLinks.map((l) => l.label),
    ...projects.map((p) => p.title),
    ...frontendSkills.map((s) => s.name),
    ...backendSkills.map((s) => s.name),
    ...socials.map((s) => s.name),

    // static UI strings
    "Hello, I'm",
    'Fullstack Developer',
    'Contact Info',
    'About Me',
    'Experience',
    'Projects',
    'Contact Me',
    'Download CV',
    'Email Me',
    'My LinkedIn',
];

export function initI18n() {
    language.subscribe((lang) => {
        translatePage(labels);
    });
}
