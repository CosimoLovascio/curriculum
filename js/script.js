document.addEventListener('DOMContentLoaded', () => {
    
    // Static text translations
    const staticTranslations = {
        it: {
            hero_name: "Cosimo Lovascio",
            hero_subtitle: "Curriculum",
            nav_name: "Cosimo Lovascio",
            nav_curriculum: "Curriculum",
            nav_blog: "Blog",
            contact_title: "Contatti",
            download_cv: "Download CV",
            skills_title: "Skills",
            skills_technical: "Hard Skill",
            skills_linguistic: "Lingue",
            skill_lang_it: "Italiano",
            skill_lang_en: "Inglese",
            sections_nav_title: "Sezioni",
            sections_nav_about: "About",
            sections_nav_experience: "Esperienza Lavorativa",
            sections_nav_language: "Lingue",
            sections_nav_skills: "Skills",
            sections_nav_articles: "Articoli",
            sections_nav_education: "Formazione",
            last_update: "Ultimo Aggiornamento: Agosto 2025",
            cv_path: "./assets/CV_Cosimo_Lovascio_IT.pdf"
        },
        en: {
            hero_name: "Cosimo Lovascio",
            hero_subtitle: "Curriculum",
            nav_name: "Cosimo Lovascio",
            nav_curriculum: "Curriculum",
            nav_blog: "Blog",
            contact_title: "Contacts",
            download_cv: "Download CV",
            skills_title: "Skills",
            skills_technical: "Hard Skills",
            skills_linguistic: "Languages",
            skill_lang_it: "Italian",
            skill_lang_en: "English",
            sections_nav_title: "Sections",
            sections_nav_about: "About",
            sections_nav_experience: "Work Experience",
            sections_nav_language: "Languages",
            sections_nav_skills: "Skills",
            sections_nav_articles: "Articles",
            sections_nav_education: "Education",
            last_update: "Last Update: August 2025",
            cv_path: "./assets/CV_Cosimo_Lovascio_EN.pdf"
        }
    };
    
    // --- CONTENT LOADING ---
    async function loadMarkdown(lang, section) {
        try {
            const response = await fetch(`./content/${lang}/${section}.md`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const markdown = await response.text();
            const html = marked.parse(markdown);
            document.getElementById(`${section}-content`).innerHTML = html;
        } catch (error) {
            console.error(`Could not load markdown for section ${section}:`, error);
            document.getElementById(`${section}-content`).innerHTML = `<p>Error loading content.</p>`;
        }
    }

    async function setLanguage(lang) {
        if (!staticTranslations[lang]) return;
        
        // Update static text
        document.documentElement.lang = lang;
        document.getElementById('current-lang').textContent = lang.toUpperCase();
        
        document.querySelectorAll('[data-static-lang]').forEach(el => {
            const key = el.getAttribute('data-static-lang');
            if (staticTranslations[lang][key]) {
                el.textContent = staticTranslations[lang][key];
            }
        });
        
        // Update CV download link
        document.getElementById('download-cv-btn').href = staticTranslations[lang].cv_path;

        // Load dynamic markdown content
        await Promise.all([
            loadMarkdown(lang, 'about'),
            loadMarkdown(lang, 'experience'),
            loadMarkdown(lang, 'education'),
            loadMarkdown(lang, 'skills'),
            loadMarkdown(lang, 'footer'),
            loadMarkdown(lang, 'articles'),
        ]);
    }

    // --- INITIALIZATION ---
    let currentLang = 'it';
    document.querySelectorAll('.lang-switcher').forEach(switcher => {
        switcher.addEventListener('click', (e) => {
            e.preventDefault();
            const lang = switcher.getAttribute('data-lang-code');
            setLanguage(lang);
        });
    });

    // --- THEME TOGGLE (code is unchanged) ---
    const themeToggleBtn = document.getElementById('theme-toggle');
    const darkIcon = document.getElementById('theme-toggle-dark-icon');
    const lightIcon = document.getElementById('theme-toggle-light-icon');

    function applyTheme(theme) {
        if (theme === 'dark') {
            document.documentElement.setAttribute('data-theme', 'dark');
            darkIcon.classList.remove('hidden');
            lightIcon.classList.add('hidden');
        } else {
            document.documentElement.setAttribute('data-theme', 'light');
            lightIcon.classList.remove('hidden');
            darkIcon.classList.add('hidden');
        }
    }

    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme) {
        applyTheme(savedTheme);
    } else {
        applyTheme(systemPrefersDark ? 'dark' : 'light');
    }

    themeToggleBtn.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        localStorage.setItem('theme', newTheme);
        applyTheme(newTheme);
    });

    // --- STICKY NAV & SCROLL (code is unchanged) ---
    const mainNav = document.getElementById('main-nav');
    const heroSection = document.querySelector('.hero-section');
    
    if (mainNav && heroSection) {
        const navObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) {
                    mainNav.classList.add('visible');
                } else {
                    mainNav.classList.remove('visible');
                }
            });
        }, { threshold: 0.1 });
        navObserver.observe(heroSection);
    }
    
    const sections = document.querySelectorAll('section[id]');
    const sectionNavLinks = document.querySelectorAll('#section-nav a');

    if (sections.length > 0 && sectionNavLinks.length > 0) {
        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');
                    sectionNavLinks.forEach(link => {
                        link.classList.remove('font-bold', 'text-blue-700');
                        if (link.getAttribute('href') === `#${id}`) {
                            link.classList.add('font-bold', 'text-blue-700');
                        }
                    });
                }
            });
        }, { rootMargin: '-10% 0px -50% 0px' });
        sections.forEach(section => sectionObserver.observe(section));
    }
    
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if(targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
    
    // Initialize page
    setLanguage('en');
});
