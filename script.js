// Espera a que todo el contenido HTML esté cargado
document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM Cargado. Iniciando script v18 (LaBase CorrectSelectorsFix).");

    // --- Selecciones Comunes ---
    // CORREGIDO: Selector más específico basado en el HTML real
    const navLinks = document.querySelectorAll('header nav > ul > li > a[href^="#"]');
    console.log(`Enlaces encontrados con 'header nav > ul > li > a[href^="#"]': ${navLinks.length}`); // Verifica si ahora encuentra 4

    const mobileMenuButton = document.getElementById('mobile-menu-button');
    // Mantenemos el selector original de "La Base" para el menú móvil
    const navElement = document.querySelector('header nav'); // Renombrado para claridad

    // --- Variables de Estado (Declaradas Correctamente - CORREGIDO) ---
    let currentlyActiveLink = null;
    let isScrollingAfterClick = false; // Bandera para scroll post-click
    let scrollTimeoutId = null; // ID del timeout

    // --- Código Scroll Suave (CON resaltado inmediato y bandera - CORREGIDO) ---
    if (navLinks.length > 0) {
        // Usa navLinks definido arriba
        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const clickedLink = this;
                const href = clickedLink.getAttribute('href');
                // console.log("Click en enlace:", href, "- Aplicando clase activa.");

                // --- Manejo INMEDIATO de active-link al hacer CLICK (AÑADIDO) ---
                navLinks.forEach(lnk => lnk.classList.remove('active-link'));
                clickedLink.classList.add('active-link');
                currentlyActiveLink = clickedLink;
                // --- Fin Manejo INMEDIATO ---

                // --- INICIO: Manejo de Bandera para Scroll Post-Click (AÑADIDO Y COMPLETO) ---
                isScrollingAfterClick = true;
                if (scrollTimeoutId) {
                    clearTimeout(scrollTimeoutId);
                }
                scrollTimeoutId = setTimeout(() => {
                    isScrollingAfterClick = false;
                    scrollTimeoutId = null;
                    // console.log("Timeout de scroll post-click finalizado.");
                }, 1000); // 1 segundo
                // --- FIN: Manejo de Bandera ---

                // Scroll suave (lógica original tuya)
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

                 // Cerrar menú móvil si está activo (usa navElement de tu versión base)
                 // NOTA: Asume que el CSS oculta el UL basado en la clase en NAV
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
         // Si este warning aparece ahora, el nuevo selector también falló.
         console.warn("ALERTA: No se encontraron enlaces de navegación con el selector 'header nav > ul > li > a[href^=\"#\"]'. Revisa la estructura HTML del header.");
    }
    // --- Fin Código Scroll Suave ---


    // --- CÓDIGO PARA MENÚ MÓVIL (Selector Original de "La Base") ---
    // Usa navElement definido arriba
    if (mobileMenuButton && navElement) {
        // console.log("Adjuntando listener al botón del menú móvil (v18)."); // Log opcional
        mobileMenuButton.addEventListener('click', function() {
            // console.log("¡Botón de menú móvil clickeado! (v18)"); // Log opcional
            navElement.classList.toggle('mobile-nav-active'); // Usa navElement
            const isExpanded = navElement.classList.contains('mobile-nav-active'); // Usa navElement
            this.setAttribute('aria-expanded', isExpanded);
            this.setAttribute('aria-label', isExpanded ? 'Cerrar menú' : 'Abrir menú');
        });
    } else {
        if (!mobileMenuButton) console.error("Error Crítico: Botón de menú móvil no encontrado.");
        // Mantenemos el log original de "La Base"
        if (!navElement) console.error("Error Crítico: Elemento <nav> no encontrado.");
    }
    // --- FIN CÓDIGO PARA MENÚ MÓVIL ---

    // --- CÓDIGO PARA VALIDACIÓN DE FORMULARIO (Tu código original) ---
    //const contactForm = document.getElementById('contact-form');
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

    // --- CÓDIGO PARA INICIALIZAR SWIPER (Tu código original) ---
    const swiperContainer = document.querySelector('.gallery.swiper-container');
    if (swiperContainer) {
      try {
        const swiper = new Swiper('.gallery.swiper-container', {
          loop: true,
          pagination: { el: '.swiper-pagination', clickable: true, },
          navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev', },
           breakpoints: { 640: { slidesPerView: 2, spaceBetween: 20 }, 1024: { slidesPerView: 3, spaceBetween: 30 } } // Añadido de versiones anteriores
        });
      } catch (error) { console.error("Error al inicializar Swiper:", error); }
    }
    // --- FIN CÓDIGO PARA INICIALIZAR SWIPER ---

    // --- CÓDIGO PARA LINK ACTIVO POR SCROLL (Variables Corregidas v18) ---
    const sections = document.querySelectorAll('main section[id]');

    // Usa navLinks definido arriba
    if (sections.length > 0 && navLinks.length > 0) {

        const observerOptions = {
            root: null,
            // Mantenemos el rootMargin fijo de tu versión base
            rootMargin: '-130px 0px -30% 0px',
            threshold: 0.0 // Mantenemos 0.0 para detectar cualquier intersección
        };

        const observerCallback = (entries, observer) => {
            // Usa la bandera definida y actualizada arriba (CORREGIDO)
            if (isScrollingAfterClick) {
                return; // Ignora si estamos scrolleando por click reciente
            }

            let bestEntry = null;
            let maxIntersectionRatio = 0;
            let minDistanceFromTop = Infinity;

            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const currentIntersectionRatio = entry.intersectionRatio;
                    // Calcular la distancia al top del viewport.
                    const rect = entry.target.getBoundingClientRect();
                    const distanceFromTop = Math.abs(rect.top);

                    if (currentIntersectionRatio > 0.5) { // Solo consideramos secciones con más del 50% visible
                      
                        if (currentIntersectionRatio > maxIntersectionRatio) {
                            // Si hay una mayor interseccion
                            maxIntersectionRatio = currentIntersectionRatio;
                            bestEntry = entry;
                            minDistanceFromTop = distanceFromTop;
                        } else if (currentIntersectionRatio === maxIntersectionRatio && distanceFromTop < minDistanceFromTop) {
                            // si hay la misma interseccion, priorizar la que esta mas cerca del top
                            bestEntry = entry;
                            minDistanceFromTop = distanceFromTop;
                        }
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

        // --- Función para manejar scroll cerca del tope (CON chequeo de bandera) ---
        const handleScrollTop = () => {
            // Usa la bandera definida y actualizada arriba (CORREGIDO)
            if (isScrollingAfterClick) {
                return; // Ignora si estamos scrolleando por click reciente
            }

            // Usa navLinks y currentlyActiveLink definidos arriba (CORREGIDO)
            const inicioLink = document.querySelector('header nav > ul > li > a[href="#inicio"]'); // Selector corregido
            if (window.scrollY < 100 && inicioLink && inicioLink !== currentlyActiveLink) {
                navLinks.forEach(link => link.classList.remove('active-link'));
                inicioLink.classList.add('active-link');
                currentlyActiveLink = inicioLink;
            }
        };

        // --- Estado Inicial Simplificado ---
        handleScrollTop(); // Llama al cargar

        // Listener para scroll
        window.addEventListener('scroll', handleScrollTop, { passive: true });

    } else {
        // Mensajes si faltan secciones o links (ahora con el selector corregido)
        if (sections.length === 0) console.log("No se encontraron secciones con ID para observar.");
        if (navLinks.length === 0) console.log("ALERTA v18: No se encontraron enlaces de navegación con el selector corregido. Revisa HTML.");
    }
    // --- FIN CÓDIGO PARA LINK ACTIVO POR SCROLL ---

    // --- CÓDIGO PARA ACTUALIZAR EL AÑO EN EL FOOTER (AÑADIDO) ---
    const currentYearSpan = document.getElementById('current-year');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    } else {
        console.warn("Elemento para año no encontrado (ID: current-year)");
    }
    // --- FIN CÓDIGO PARA ACTUALIZAR EL AÑO ---

    console.log("Script v18 inicializado completamente.");

}); // Fin del addEventListener('DOMContentLoaded')
