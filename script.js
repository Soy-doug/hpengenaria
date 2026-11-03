"use strict";
const siteContent = {
    contacts: {
        henrik: { name: 'Henrik', phone: '5591991130303', display: '(91) 99113-0303' },
        kadja: { name: 'Kadja', phone: '5591991131368', display: '(91) 99113-1368' }
    },
    email: 'hpengenharia2019@gmail.com',
    instagram: 'https://www.instagram.com/hp__engenharia/',
    location: 'Pacajá / PA'
};
function element(selector) {
    const result = document.querySelector(selector);
    if (!result)
        throw new Error('Elemento obrigatório ausente: ' + selector);
    return result;
}
function whatsappUrl(message, phone = siteContent.contacts.henrik.phone) {
    return 'https://wa.me/' + phone + '?text=' + encodeURIComponent(message);
}
function configureContent() {
    document.querySelectorAll('[data-whatsapp-message]').forEach(link => {
        link.href = whatsappUrl(link.dataset.whatsappMessage ?? '');
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
    });
    document.querySelectorAll('[data-contact]').forEach(link => {
        const key = link.dataset.contact;
        const contact = siteContent.contacts[key];
        if (!contact) {
            link.hidden = true;
            return;
        }
        link.href = 'https://wa.me/' + contact.phone;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
    });
    document.querySelectorAll('[data-email]').forEach(link => {
        if (!siteContent.email) {
            link.hidden = true;
            return;
        }
        link.href = 'mailto:' + siteContent.email;
        const text = link.querySelector('span');
        if (text)
            text.textContent = siteContent.email;
    });
    document.querySelectorAll('[data-social="instagram"]').forEach(link => {
        if (!siteContent.instagram) {
            link.hidden = true;
            return;
        }
        link.href = siteContent.instagram;
    });
    element('#current-year').textContent = String(new Date().getFullYear());
}
function initNavigation() {
    const button = element('#menu-toggle');
    const navigation = element('#site-nav');
    const label = element('#menu-label');
    const main = element('#conteudo');
    const footer = element('.site-footer');
    const setOpen = (open, restoreFocus = false) => {
        button.setAttribute('aria-expanded', String(open));
        label.textContent = open ? 'Fechar menu' : 'Abrir menu';
        navigation.classList.toggle('is-open', open);
        document.body.classList.toggle('menu-open', open);
        main.inert = open;
        footer.inert = open;
        if (restoreFocus)
            button.focus();
    };
    button.addEventListener('click', () => {
        const open = button.getAttribute('aria-expanded') !== 'true';
        setOpen(open);
        if (open)
            navigation.querySelector('a')?.focus();
    });
    navigation.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => setOpen(false));
    });
    document.addEventListener('keydown', event => {
        if (button.getAttribute('aria-expanded') !== 'true')
            return;
        if (event.key === 'Escape') {
            event.preventDefault();
            setOpen(false, true);
        }
        if (event.key !== 'Tab')
            return;
        const links = Array.from(navigation.querySelectorAll('a'));
        const last = links.at(-1);
        if (event.shiftKey && document.activeElement === links[0]) {
            event.preventDefault();
            button.focus();
        }
        else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            button.focus();
        }
        else if (event.shiftKey && document.activeElement === button) {
            event.preventDefault();
            last?.focus();
        }
        else if (!event.shiftKey && document.activeElement === button) {
            event.preventDefault();
            links[0]?.focus();
        }
    });
    window.addEventListener('resize', () => { if (window.innerWidth > 1000)
        setOpen(false); });
}
function initContactForm() {
    const form = document.querySelector('#contact-form');
    if (!form)
        return;
    const phone = form.querySelector('#telefone');
    if (phone) {
        phone.addEventListener('input', () => {
            const digits = phone.value.replace(/\D/g, '').slice(0, 11);
            const area = digits.slice(0, 2);
            const boundary = digits.length > 10 ? 7 : 6;
            const first = digits.slice(2, boundary);
            const last = digits.slice(boundary);
            phone.value = (area ? '(' + area + ')' : '') + (first ? ' ' + first : '') + (last ? '-' + last : '');
        });
    }
    form.addEventListener('submit', event => {
        event.preventDefault();
        if (!form.reportValidity())
            return;
        const data = new FormData(form);
        const text = 'Olá! Meu nome é ' + String(data.get('nome') ?? '').trim() +
            '. Meu telefone é ' + String(data.get('telefone') ?? '').trim() +
            '.\n\nPreciso de ajuda com: ' + String(data.get('mensagem') ?? '').trim();
        window.open(whatsappUrl(text), '_blank', 'noopener,noreferrer');
    });
}
function initGallery() {
    const track = element('#gallery-track');
    const items = Array.from(track.querySelectorAll('[data-gallery-image]'));
    const previous = element('#gallery-prev');
    const next = element('#gallery-next');
    const dialog = element('#gallery-dialog');
    const image = element('#gallery-full-image');
    const caption = element('#gallery-caption');
    const close = element('#gallery-close');
    let currentIndex = 0;
    let returnFocus;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const showImage = (index) => {
        currentIndex = (index + items.length) % items.length;
        const item = items[currentIndex];
        image.src = item.dataset.galleryImage ?? '';
        image.alt = item.querySelector('img')?.alt ?? '';
        caption.textContent = (item.dataset.caption ?? '') + ' · ' + (currentIndex + 1) + ' de ' + items.length;
    };
    items.forEach((item, index) => item.addEventListener('click', () => {
        returnFocus = item;
        showImage(index);
        dialog.showModal();
        document.body.classList.add('dialog-open');
        close.focus();
    }));
    close.addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', event => {
        if (event.target !== dialog)
            return;
        const rect = dialog.getBoundingClientRect();
        if (event.clientX < rect.left || event.clientX > rect.right ||
            event.clientY < rect.top || event.clientY > rect.bottom)
            dialog.close();
    });
    dialog.addEventListener('close', () => {
        document.body.classList.remove('dialog-open');
        returnFocus?.focus();
    });
    const browse = (direction) => showImage(currentIndex + direction);
    element('#dialog-prev').addEventListener('click', () => browse(-1));
    element('#dialog-next').addEventListener('click', () => browse(1));
    dialog.addEventListener('keydown', event => {
        if (event.key === 'ArrowLeft') {
            event.preventDefault();
            browse(-1);
        }
        if (event.key === 'ArrowRight') {
            event.preventDefault();
            browse(1);
        }
    });
    const updateControls = () => {
        previous.disabled = track.scrollLeft <= 2;
        next.disabled = track.scrollLeft + track.clientWidth >= track.scrollWidth - 2;
    };
    const scrollGallery = (direction) => {
        const itemWidth = items[0]?.getBoundingClientRect().width ?? track.clientWidth;
        track.scrollBy({ left: direction * (itemWidth + 12), behavior: reduceMotion.matches ? 'instant' : 'smooth' });
    };
    previous.addEventListener('click', () => scrollGallery(-1));
    next.addEventListener('click', () => scrollGallery(1));
    track.addEventListener('keydown', event => {
        if (event.target !== track)
            return;
        if (event.key === 'ArrowLeft') {
            event.preventDefault();
            scrollGallery(-1);
        }
        if (event.key === 'ArrowRight') {
            event.preventDefault();
            scrollGallery(1);
        }
    });
    track.addEventListener('scroll', updateControls, { passive: true });
    window.addEventListener('resize', updateControls);
    updateControls();
}
function initHashAlignment() {
    const align = () => {
        if (!window.location.hash)
            return;
        let id;
        try {
            id = decodeURIComponent(window.location.hash.slice(1));
        }
        catch {
            return;
        }
        document.getElementById(id)?.scrollIntoView({ block: 'start', behavior: 'instant' });
    };
    window.addEventListener('load', () => { void document.fonts.ready.then(align); });
}
function initCompactHeader() {
    const header = element('.site-header');
    const topbar = header.querySelector('.topbar');
    let scheduled = false;
    const update = () => {
        header.classList.toggle('is-compact', window.scrollY > 40);
        scheduled = false;
    };
    const measureTopbar = () => {
        if (topbar) {
            header.style.setProperty('--topbar-height', `${topbar.getBoundingClientRect().height}px`);
        }
    };
    measureTopbar();
    if (topbar && 'ResizeObserver' in window)
        new ResizeObserver(measureTopbar).observe(topbar);
    window.addEventListener('scroll', () => {
        if (!scheduled) {
            scheduled = true;
            window.requestAnimationFrame(update);
        }
    }, { passive: true });
    update();
}
function initFloatingWhatsapp() {
    const btn = document.getElementById('floating-whatsapp');
    const footer = document.querySelector('.site-footer');
    if (!btn || !footer || !('IntersectionObserver' in window))
        return;
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            btn.classList.toggle('is-hidden', entry.isIntersecting);
        });
    }, { threshold: 0.05 });
    observer.observe(footer);
}
const HERO_BASE_TITLE = 'Soluções técnicas para';
const HERO_COMPLEMENTS = [
    'quem vive e produz no campo.',
    'a regularização da sua propriedade.',
    'licenciamento e gestão ambiental.',
    'produzir mais e melhor no campo.',
    'assistência técnica rural contínua.',
    'o planejamento da sua fazenda.',
    'o sucesso do seu negócio rural.',
];
function initHeroTitleAnimation() {
    const title = document.getElementById('hero-title');
    const rotatorText = title?.querySelector('.hero-rotator-text');
    if (!title || !rotatorText)
        return;
    const titleEl = title;
    const textEl = rotatorText;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let currentIndex = 0;
    let timerId = null;
    let isTransitioning = false;
    let isPaused = false;
    const HOLD_MS = 4600;
    const EXIT_MS = 450;
    const ENTER_MS = 500;
    function stopTimer() {
        if (timerId !== null) {
            window.clearTimeout(timerId);
            timerId = null;
        }
    }
    function scheduleNext() {
        stopTimer();
        if (reducedMotion.matches || document.hidden || isPaused)
            return;
        timerId = window.setTimeout(nextPhrase, HOLD_MS);
    }
    function nextPhrase() {
        if (reducedMotion.matches || document.hidden || isPaused || isTransitioning)
            return;
        isTransitioning = true;
        textEl.classList.remove('is-entering', 'is-pre-enter');
        textEl.classList.add('is-exiting');
        window.setTimeout(() => {
            currentIndex = (currentIndex + 1) % HERO_COMPLEMENTS.length;
            const complement = HERO_COMPLEMENTS[currentIndex];
            textEl.textContent = complement;
            titleEl.setAttribute('aria-label', `${HERO_BASE_TITLE} ${complement}`);
            textEl.classList.remove('is-exiting');
            textEl.classList.add('is-pre-enter');
            void textEl.offsetHeight;
            textEl.classList.remove('is-pre-enter');
            textEl.classList.add('is-entering');
            window.setTimeout(() => {
                textEl.classList.remove('is-entering');
                isTransitioning = false;
                scheduleNext();
            }, ENTER_MS);
        }, EXIT_MS);
    }
    titleEl.addEventListener('mouseenter', () => {
        isPaused = true;
        stopTimer();
    });
    titleEl.addEventListener('mouseleave', () => {
        isPaused = false;
        if (!isTransitioning) {
            scheduleNext();
        }
    });
    titleEl.addEventListener('focusin', () => {
        isPaused = true;
        stopTimer();
    });
    titleEl.addEventListener('focusout', () => {
        isPaused = false;
        if (!isTransitioning) {
            scheduleNext();
        }
    });
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            stopTimer();
        }
        else if (!isPaused) {
            scheduleNext();
        }
    });
    reducedMotion.addEventListener('change', () => {
        if (reducedMotion.matches) {
            stopTimer();
            currentIndex = 0;
            textEl.textContent = HERO_COMPLEMENTS[0];
            titleEl.setAttribute('aria-label', `${HERO_BASE_TITLE} ${HERO_COMPLEMENTS[0]}`);
            textEl.className = 'hero-rotator-text';
        }
        else {
            scheduleNext();
        }
    });
    scheduleNext();
}
function initMotion() {
    if (!('IntersectionObserver' in window) || !('animate' in HTMLElement.prototype))
        return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const lowCapacity = navigator.hardwareConcurrency > 0 && navigator.hardwareConcurrency <= 2;
    const active = new Map();
    const seen = new WeakSet();
    const enter = (target, delay = 0, distance = 20, duration = 900) => {
        if (seen.has(target))
            return;
        seen.add(target);
        if (reduced.matches || lowCapacity || target.contains(document.activeElement))
            return;
        const animation = target.animate([
            { opacity: 0, transform: `translateY(${distance}px)` },
            { opacity: 1, transform: 'translateY(0)' }
        ], { duration, delay, easing: 'cubic-bezier(.25,.6,.3,1)', fill: 'backwards' });
        active.set(target, animation);
        const cleanup = () => { active.delete(target); };
        animation.onfinish = cleanup;
        animation.oncancel = cleanup;
    };
    if (!window.location.hash) {
        document.querySelectorAll('.hero h1,.hero-lead,.hero-actions').forEach((target, index) => {
            const rect = target.getBoundingClientRect();
            if (rect.height && rect.top < window.innerHeight && rect.bottom > 0)
                enter(target, Math.min(index * 90, 180), 16, 1000);
        });
    }
    const groups = ['.solutions-heading', '.process-steps li', '.about-photo,.about-copy', '.contact-content>div,.contact-content>.button'];
    const delays = new Map();
    groups.forEach(selector => document.querySelectorAll(selector).forEach((target, index) => delays.set(target, index * 120)));
    let remaining = delays.size;
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (!entry.isIntersecting)
                return;
            const target = entry.target;
            enter(target, delays.get(target) ?? 0);
            observer.unobserve(target);
            remaining -= 1;
        });
        if (!remaining)
            observer.disconnect();
    }, { threshold: 0.1 });
    delays.forEach((_, target) => observer.observe(target));
    const stop = () => {
        observer.disconnect();
        active.forEach(animation => animation.cancel());
        active.clear();
    };
    reduced.addEventListener('change', () => { if (reduced.matches)
        stop(); });
    document.addEventListener('focusin', event => {
        active.forEach((animation, target) => {
            if (event.target instanceof Node && target.contains(event.target))
                animation.cancel();
        });
    });
    if (reduced.matches || lowCapacity)
        stop();
}
function initCardDeckSolutions() {
    const anchor = document.getElementById('solutions-anchor');
    const stage = document.getElementById('solutions-stage');
    const viewport = document.getElementById('deck-viewport');
    const track = document.getElementById('deck-track');
    const rangeText = document.getElementById('deck-card-range');
    const btnPrev = document.getElementById('deck-prev-btn');
    const btnNext = document.getElementById('deck-next-btn');
    const pagination = document.getElementById('deck-pagination');
    if (!anchor || !stage || !viewport || !track)
        return;
    const anchorEl = anchor;
    const stageEl = stage;
    const viewportEl = viewport;
    const trackEl = track;
    const rangeTextEl = rangeText;
    const paginationEl = pagination;
    const cards = Array.from(trackEl.querySelectorAll('.solution-card'));
    const totalCards = cards.length;
    if (totalCards === 0)
        return;
    const CARDS_PER_VIEW = 4;
    const MAX_STEP = Math.max(0, totalCards - CARDS_PER_VIEW);
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let currentStep = 0;
    let isMobile = window.innerWidth <= 960;
    let scheduled = false;
    const dots = [];
    if (paginationEl) {
        paginationEl.innerHTML = '';
        for (let i = 0; i <= MAX_STEP; i++) {
            const dot = document.createElement('button');
            dot.type = 'button';
            dot.className = 'deck-dot' + (i === 0 ? ' is-active' : '');
            dot.setAttribute('aria-label', `Ver serviços ${i + 1} a ${i + 4}`);
            dot.addEventListener('click', () => {
                goToStep(i);
                syncScrollPosition(i);
            });
            paginationEl.appendChild(dot);
            dots.push(dot);
        }
    }
    function syncScrollPosition(step) {
        if (isMobile || reducedMotion.matches)
            return;
        const maxScroll = anchorEl.offsetHeight - window.innerHeight;
        if (maxScroll <= 0)
            return;
        const anchorTop = anchorEl.getBoundingClientRect().top + window.scrollY;
        const targetScrollY = anchorTop + (step / MAX_STEP) * maxScroll;
        window.scrollTo({ top: targetScrollY, behavior: 'smooth' });
    }
    function goToStep(step, animateDeal = true) {
        currentStep = Math.max(0, Math.min(MAX_STEP, step));
        if (isMobile) {
            dots.forEach((dot, idx) => dot.classList.toggle('is-active', idx === currentStep));
            return;
        }
        const gap = 24;
        const cardWidth = (viewportEl.clientWidth - (CARDS_PER_VIEW - 1) * gap) / CARDS_PER_VIEW;
        const shift = currentStep * (cardWidth + gap);
        trackEl.style.transform = `translateX(-${shift}px)`;
        cards.forEach((card, idx) => {
            if (idx < currentStep) {
                card.classList.add('is-discarded');
                card.classList.remove('is-dealt');
            }
            else if (idx >= currentStep && idx < currentStep + CARDS_PER_VIEW) {
                card.classList.remove('is-discarded');
                if (idx === currentStep + CARDS_PER_VIEW - 1 && animateDeal) {
                    card.classList.remove('is-dealt');
                    void card.offsetWidth;
                    card.classList.add('is-dealt');
                }
                else {
                    card.classList.remove('is-dealt');
                }
            }
            else {
                card.classList.remove('is-discarded', 'is-dealt');
            }
        });
        if (rangeTextEl) {
            const deckLabel = document.querySelector('.deck-label');
            if (isMobile) {
                if (deckLabel)
                    deckLabel.textContent = 'Serviço';
                rangeTextEl.textContent = `${String(currentStep + 1).padStart(2, '0')}`;
            }
            else {
                if (deckLabel)
                    deckLabel.textContent = 'Serviços';
                const startNum = String(currentStep + 1).padStart(2, '0');
                const endNum = String(currentStep + CARDS_PER_VIEW).padStart(2, '0');
                rangeTextEl.textContent = `${startNum}–${endNum}`;
            }
        }
        if (btnPrev)
            btnPrev.disabled = currentStep === 0;
        if (btnNext)
            btnNext.disabled = currentStep === MAX_STEP;
        dots.forEach((dot, idx) => dot.classList.toggle('is-active', idx === currentStep));
    }
    function recalculateLayout() {
        isMobile = window.innerWidth <= 960;
        if (isMobile || reducedMotion.matches) {
            anchorEl.style.height = '';
            trackEl.style.transform = '';
            cards.forEach(card => card.classList.remove('is-discarded', 'is-dealt'));
            return;
        }
        const scrollRange = (MAX_STEP + 1) * 400;
        anchorEl.style.height = `${window.innerHeight + scrollRange}px`;
        goToStep(currentStep, false);
    }
    function onWindowScroll() {
        if (isMobile || reducedMotion.matches)
            return;
        const rect = anchorEl.getBoundingClientRect();
        const scrollInside = -rect.top;
        const maxScroll = anchorEl.offsetHeight - window.innerHeight;
        if (maxScroll <= 0)
            return;
        if (scrollInside >= 0 && scrollInside <= maxScroll) {
            const progress = scrollInside / maxScroll;
            const targetStep = Math.min(MAX_STEP, Math.max(0, Math.floor(progress * (MAX_STEP + 0.99))));
            if (targetStep !== currentStep) {
                goToStep(targetStep, true);
            }
        }
        else if (scrollInside < 0 && currentStep !== 0) {
            goToStep(0, false);
        }
        else if (scrollInside > maxScroll && currentStep !== MAX_STEP) {
            goToStep(MAX_STEP, false);
        }
    }
    if (btnNext) {
        btnNext.addEventListener('click', () => {
            if (isMobile) {
                const cardWidth = cards[0]?.offsetWidth ?? 300;
                viewportEl.scrollBy({ left: cardWidth + 16, behavior: 'smooth' });
            }
            else if (currentStep < MAX_STEP) {
                const next = currentStep + 1;
                goToStep(next, true);
                syncScrollPosition(next);
            }
        });
    }
    if (btnPrev) {
        btnPrev.addEventListener('click', () => {
            if (isMobile) {
                const cardWidth = cards[0]?.offsetWidth ?? 300;
                viewportEl.scrollBy({ left: -(cardWidth + 16), behavior: 'smooth' });
            }
            else if (currentStep > 0) {
                const prev = currentStep - 1;
                goToStep(prev, false);
                syncScrollPosition(prev);
            }
        });
    }
    viewportEl.addEventListener('scroll', () => {
        if (!isMobile)
            return;
        const cardWidth = (cards[0]?.offsetWidth ?? 300) + 16;
        const active = Math.min(totalCards - 1, Math.max(0, Math.round(viewportEl.scrollLeft / cardWidth)));
        if (rangeTextEl)
            rangeTextEl.textContent = `${String(active + 1).padStart(2, '0')}`;
        const maxLeft = viewportEl.scrollWidth - viewportEl.clientWidth;
        if (btnPrev)
            btnPrev.disabled = viewportEl.scrollLeft <= 8;
        if (btnNext)
            btnNext.disabled = viewportEl.scrollLeft >= maxLeft - 8;
    }, { passive: true });
    window.addEventListener('scroll', () => {
        if (!isMobile && !reducedMotion.matches) {
            if (!scheduled) {
                scheduled = true;
                window.requestAnimationFrame(() => {
                    onWindowScroll();
                    scheduled = false;
                });
            }
        }
    }, { passive: true });
    window.addEventListener('resize', recalculateLayout);
    recalculateLayout();
    goToStep(0, false);
}
configureContent();
initNavigation();
initContactForm();
initGallery();
initHashAlignment();
initCompactHeader();
initFloatingWhatsapp();
initHeroTitleAnimation();
initCardDeckSolutions();
initMotion();
