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
    const form = element('#contact-form');
    const phone = element('#telefone');
    phone.addEventListener('input', () => {
        const digits = phone.value.replace(/\D/g, '').slice(0, 11);
        const area = digits.slice(0, 2);
        const boundary = digits.length > 10 ? 7 : 6;
        const first = digits.slice(2, boundary);
        const last = digits.slice(boundary);
        phone.value = (area ? '(' + area + ')' : '') + (first ? ' ' + first : '') + (last ? '-' + last : '');
    });
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
    const topbar = element('.topbar');
    const desktop = window.matchMedia('(min-width: 1001px)');
    let scheduled = false;
    const update = () => {
        const compact = header.classList.contains('is-compact');
        header.classList.toggle('is-compact', desktop.matches && window.scrollY > (compact ? 80 : 120));
        scheduled = false;
    };
    const measureTopbar = () => {
        header.style.setProperty('--topbar-height', topbar.getBoundingClientRect().height + 'px');
    };
    measureTopbar();
    if ('ResizeObserver' in window)
        new ResizeObserver(measureTopbar).observe(topbar);
    window.addEventListener('scroll', () => {
        if (!desktop.matches)
            return;
        if (!scheduled) {
            scheduled = true;
            window.requestAnimationFrame(update);
        }
    }, { passive: true });
    desktop.addEventListener('change', update);
    update();
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
    const groups = ['.solution-card', '.process-steps li', '.about-photo,.about-copy', '.contact-content>div,.contact-content>.button'];
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
configureContent();
initNavigation();
initContactForm();
initGallery();
initHashAlignment();
initCompactHeader();
initMotion();
