// Espera a que todo el contenido HTML esté cargado
document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM Cargado. Iniciando script v18 (LaBase CorrectSelectorsFix).");

    // --- Selecciones Comunes ---
    // CORREGIDO: Selector más específico basado en el HTML real
    const navLinks = document.querySelectorAll('header nav > ul > li > a[href^="#"]');
    console.log(`Enlaces encontrados con 'header nav > ul > li > a[href^="#"]': ${navLinks.length}`);

    const mobileMenuButton = document.getElementById('mobile-menu-button');
    // Mantenemos el selector original de "La Base" para el menú móvil
    const navElement = document.querySelector('header nav');

    // --- Variables de Estado (Declaradas Correctamente - CORREGIDO) ---
    let currentlyActiveLink = null;
    let isScrollingAfterClick = false;
    let scrollTimeoutId = null;

    // --- Código Scroll Suave (CON resaltado inmediato y bandera - CORREGIDO) ---
    if (navLinks.length > 0) {
        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const clickedLink = this;
                const href = clickedLink.getAttribute('href');
                navLinks.forEach(lnk => lnk.classList.remove('active-link'));
                clickedLink.classList.add('active-link');
                currentlyActiveLink = clickedLink;
                isScrollingAfterClick = true;
                if (scrollTimeoutId) {
                    clearTimeout(scrollTimeoutId);
                }
                scrollTimeoutId = setTimeout(() => {
                    isScrollingAfterClick = false;
                    scrollTimeoutId = null;
                }, 1000); 
                if (href === '#inicio') {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                } else {
                    const targetId = href.substring(1);
                    const targetElement = document.getElementById(targetId);
                    if (targetElement) {
                        targetElement.scrollIntoView({ behavior: 'smooth' });
                    } else {
                         console.warn("Elemento target para scroll no encontrado:", targetId);
                    }
                }

                 if (navElement && navElement.classList.contains('mobile-nav-active')) {
                    navElement.classList.remove('mobile-nav-active');
                    if (mobileMenuButton) {
                        mobileMenuButton.setAttribute('aria-expanded', 'false');
                        mobileMenuButton.setAttribute('aria-label', 'Abrir menú');
                    }
                }
            });
        });
    } else {
         console.warn("ALERTA: No se encontraron enlaces de navegación con el selector 'header nav > ul > li > a[href^=\"#\"]'. Revisa la estructura HTML del header.");
    }
    // --- Fin Código Scroll Suave ---

    // --- CÓDIGO PARA MENÚ MÓVIL ---
    if (mobileMenuButton && navElement) {
        mobileMenuButton.addEventListener('click', function() {
            navElement.classList.toggle('mobile-nav-active');
            const isExpanded = navElement.classList.contains('mobile-nav-active');
            this.setAttribute('aria-expanded', isExpanded);
            this.setAttribute('aria-label', isExpanded ? 'Cerrar menú' : 'Abrir menú');
        });
    } else {
        if (!mobileMenuButton) console.error("Error Crítico: Botón de menú móvil no encontrado.");
        if (!navElement) console.error("Error Crítico: Elemento <nav> no encontrado.");
    }
    // --- FIN CÓDIGO PARA MENÚ MÓVIL ---

    // --- CÓDIGO PARA VALIDACIÓN DE FORMULARIO ---
    const contactForm = document.querySelector('form');
    const nombreInput = document.getElementById('nombre');
    const emailInput = document.getElementById('email');
    const mensajeInput = document.getElementById('mensaje');
    const errorNombre = document.getElementById('error-nombre');
    const errorEmail = document.getElementById('error-email');
    const errorMensaje = document.getElementById('error-mensaje');
    if (contactForm) {
      contactForm.addEventListener('submit', function(e) {
        let isValid = true;
        errorNombre.textContent = ''; errorEmail.textContent = ''; errorMensaje.textContent = '';
        nombreInput.classList.remove('error'); emailInput.classList.remove('error'); mensajeInput.classList.remove('error');
        if (nombreInput.value.trim() === '') { errorNombre.textContent = 'Por favor, ingresa tu nombre.'; nombreInput.classList.add('error'); isValid = false; }
        if (emailInput.value.trim() === '') { errorEmail.textContent = 'Por favor, ingresa tu email.'; emailInput.classList.add('error'); isValid = false; }
        else if (!/\S+@\S+\.\S+/.test(emailInput.value)) { errorEmail.textContent = 'Por favor, ingresa un email válido.'; emailInput.classList.add('error'); isValid = false; }
        if (mensajeInput.value.trim() === '') { errorMensaje.textContent = 'Por favor, escribe tu mensaje o reserva.'; mensajeInput.classList.add('error'); isValid = false; }
        if (!isValid) { e.preventDefault(); }
      });
    } else {
         console.error("Formulario no encontrado (ID: contact-form)");
    }
    // --- FIN CÓDIGO PARA VALIDACIÓN DE FORMULARIO ---

    // --- CÓDIGO PARA INICIALIZAR SWIPER ---
    const swiperContainer = document.querySelector('.gallery.swiper-container');
    if (swiperContainer) {
      try {
        const swiper = new Swiper('.gallery.swiper-container', {
          loop: true,
          pagination: { el: '.swiper-pagination', clickable: true, },
          navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev', },
           breakpoints: { 640: { slidesPerView: 2, spaceBetween: 20 }, 1024: { slidesPerView: 3, spaceBetween: 30 } }
        });
      } catch (error) { console.error("Error al inicializar Swiper:", error); }
    }
    // --- FIN CÓDIGO PARA INICIALIZAR SWIPER ---

    // --- CÓDIGO PARA LINK ACTIVO POR SCROLL ---
    const sections = document.querySelectorAll('main section[id]');
    if (sections.length > 0 && navLinks.length > 0) {
        const observerOptions = {
            root: null,
            rootMargin: '-130px 0px -30% 0px',
            threshold: 0.0
        };

        const observerCallback = (entries, observer) => {
            if (isScrollingAfterClick) {
                return;
            }

            let bestEntry = null;
            let maxIntersectionRatio = 0;
            let minDistanceFromTop = Infinity;

            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const currentIntersectionRatio = entry.intersectionRatio;
                    const rect = entry.target.getBoundingClientRect();
                    const distanceFromTop = Math.abs(rect.top);

                    if (currentIntersectionRatio > maxIntersectionRatio) {
                        maxIntersectionRatio = currentIntersectionRatio;
                        bestEntry = entry;
                        minDistanceFromTop = distanceFromTop;
                    } else if (currentIntersectionRatio === maxIntersectionRatio && distanceFromTop < minDistanceFromTop) {
                        bestEntry = entry;
                        minDistanceFromTop = distanceFromTop;
                    }
                }
            });

            if (bestEntry) {
                const id = bestEntry.target.getAttribute('id');
                const correspondingLink = document.querySelector(`header nav > ul > li > a[href="#${id}"]`);
                 if (correspondingLink && correspondingLink !== currentlyActiveLink) {
                    navLinks.forEach(link => link.classList.remove('active-link'));
                    correspondingLink.classList.add('active-link');
                    currentlyActiveLink = correspondingLink;
                }
            }
        };
        const observer = new IntersectionObserver(observerCallback, observerOptions);
        sections.forEach(section => observer.observe(section));

        const handleScrollTop = () => {
            if (isScrollingAfterClick) {
                return;
            }
            const inicioLink = document.querySelector('header nav > ul > li > a[href="#inicio"]');
            if (window.scrollY === 0 && inicioLink && inicioLink !== currentlyActiveLink) {
                navLinks.forEach(link => link.classList.remove('active-link'));
                inicioLink.classList.add('active-link');
                currentlyActiveLink = inicioLink;
            }
        };
        handleScrollTop(); // Llama al cargar
        window.addEventListener('scroll', handleScrollTop, { passive: true });
    } else {
        if (sections.length === 0) console.log("No se encontraron secciones con ID para observar.");
        if (navLinks.length === 0) console.log("ALERTA v18: No se encontraron enlaces de navegación con el selector corregido. Revisa HTML.");
    }
    // --- FIN CÓDIGO PARA LINK ACTIVO POR SCROLL ---

    // --- CÓDIGO PARA ACTUALIZAR EL AÑO EN EL FOOTER ---
    const currentYearSpan = document.getElementById('current-year');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    } else {
        console.warn("Elemento para año no encontrado (ID: current-year)");
    }
    // --- FIN CÓDIGO PARA ACTUALIZAR EL AÑO ---

    console.log("Script v18 inicializado completamente.");

}); // Fin del addEventListener('DOMContentLoaded')
