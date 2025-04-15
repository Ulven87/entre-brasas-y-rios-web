// Espera a que todo el contenido HTML esté cargado
document.addEventListener('DOMContentLoaded', function () {
  console.log('DOM Cargado. Iniciando script v25 (ScrollMagic).');

  // --- Selecciones Comunes ---
  // CORREGIDO: Selector más específico basado en el HTML real
  const navLinks = document.querySelectorAll(
    'header nav > ul > li > a[href^="#"]'
  );
  console.log(
    `Enlaces encontrados con 'header nav > ul > li > a[href^="#"]': ${navLinks.length}`
  );

  const mobileMenuButton = document.getElementById('mobile-menu-button');
  // Mantenemos el selector original de "La Base" para el menú móvil
  const navElement = document.querySelector('header nav');

  // --- Variables de Estado (Declaradas Correctamente - CORREGIDO) ---
  let currentlyActiveLink = null;
  let isScrollingAfterClick = false;
  let scrollTimeoutId = null;
  let isLinkClicked = false;

  // --- Código Scroll Suave (CON resaltado inmediato y bandera - CORREGIDO) ---
  if (navLinks.length > 0) {
    navLinks.forEach((link) => {
      link.addEventListener('click', function (e) {
        e.preventDefault();
        const clickedLink = this;
        const href = clickedLink.getAttribute('href');
        navLinks.forEach((lnk) => lnk.classList.remove('active-link'));
        clickedLink.classList.add('active-link');
        currentlyActiveLink = clickedLink;
        isScrollingAfterClick = true;
        isLinkClicked = true;
        if (scrollTimeoutId) {
          clearTimeout(scrollTimeoutId);
        }
        scrollTimeoutId = setTimeout(() => {
          isScrollingAfterClick = false;
          scrollTimeoutId = null;
          isLinkClicked = false;
        }, 1000);
        if (href === '#inicio') {
          const headerHeight = document.querySelector('header').offsetHeight;
          window.scrollTo({
            top: 0 - headerHeight,
            behavior: 'smooth',
          });
        } else {
          const targetId = href.substring(1);
          const targetElement = document.getElementById(targetId);
          if (targetElement) {
            targetElement.scrollIntoView({ behavior: 'smooth' });
          } else {
            console.warn(
              'Elemento target para scroll no encontrado:',
              targetId
            );
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
    console.warn(
      "ALERTA: No se encontraron enlaces de navegación con el selector 'header nav > ul > li > a[href^=\"#\"]'. Revisa la estructura HTML del header."
    );
  }
  // --- Fin Código Scroll Suave ---

  // --- CÓDIGO PARA MENÚ MÓVIL ---
  if (mobileMenuButton && navElement) {
    mobileMenuButton.addEventListener('click', function () {
      navElement.classList.toggle('mobile-nav-active');
      const isExpanded = navElement.classList.contains('mobile-nav-active');
      this.setAttribute('aria-expanded', isExpanded);
      this.setAttribute('aria-label', isExpanded ? 'Cerrar menú' : 'Abrir menú');
    });
  } else {
    if (!mobileMenuButton)
      console.error('Error Crítico: Botón de menú móvil no encontrado.');
    if (!navElement) console.error('Error Crítico: Elemento <nav> no encontrado.');
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
    contactForm.addEventListener('submit', function (e) {
      let isValid = true;
      errorNombre.textContent = '';
      errorEmail.textContent = '';
      errorMensaje.textContent = '';
      nombreInput.classList.remove('error');
      emailInput.classList.remove('error');
      mensajeInput.classList.remove('error');
      if (nombreInput.value.trim() === '') {
        errorNombre.textContent = 'Por favor, ingresa tu nombre.';
        nombreInput.classList.add('error');
        isValid = false;
      }
      if (emailInput.value.trim() === '') {
        errorEmail.textContent = 'Por favor, ingresa tu email.';
        emailInput.classList.add('error');
        isValid = false;
      } else if (!/\S+@\S+\.\S+/.test(emailInput.value)) {
        errorEmail.textContent = 'Por favor, ingresa un email válido.';
        emailInput.classList.add('error');
        isValid = false;
      }
      if (mensajeInput.value.trim() === '') {
        errorMensaje.textContent = 'Por favor, escribe tu mensaje o reserva.';
        mensajeInput.classList.add('error');
        isValid = false;
      }
      if (!isValid) {
        e.preventDefault();
      }
    });
  } else {
    console.error('Formulario no encontrado (ID: contact-form)');
  }
  // --- FIN CÓDIGO PARA VALIDACIÓN DE FORMULARIO ---

  // --- CÓDIGO PARA INICIALIZAR SWIPER ---
  const swiperContainer = document.querySelector('.gallery.swiper-container');
  if (swiperContainer) {
    try {
      const swiper = new Swiper('.gallery.swiper-container', {
        loop: true,
        pagination: { el: '.swiper-pagination', clickable: true },
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        },
        breakpoints: {
          640: { slidesPerView: 2, spaceBetween: 20 },
          1024: { slidesPerView: 3, spaceBetween: 30 },
        },
      });
    } catch (error) {
      console.error('Error al inicializar Swiper:', error);
    }
  }
  // --- FIN CÓDIGO PARA INICIALIZAR SWIPER ---

  // --- CÓDIGO PARA LINK ACTIVO POR SCROLL (CON ScrollMagic) ---
  // Inicializar el controlador de ScrollMagic
  const controller = new ScrollMagic.Controller();

  // Seleccionar las secciones y los enlaces de navegación
  const sections = document.querySelectorAll('main section[id]');

  // Crear una escena para cada sección
  sections.forEach((section) => {
    // Crear la escena
    const scene = new ScrollMagic.Scene({
      triggerElement: section, // El elemento que activa la escena
      triggerHook: 0.2, // Cuando el 20% del elemento sea visible
      duration: section.offsetHeight, //La duración de la escena es la altura del elemento
    })
      .addTo(controller) // Añadir la escena al controlador
      //.addIndicators() // Descomenta esta línea para ver las líneas de referencia
      .on('enter', () => {
        if (isLinkClicked) {
          return;
        }
        const id = section.getAttribute('id');
        const correspondingLink = document.querySelector(
          `header nav > ul > li > a[href="#${id}"]`
        );
        if (correspondingLink && correspondingLink !== currentlyActiveLink) {
          navLinks.forEach((link) => link.classList.remove('active-link'));
          correspondingLink.classList.add('active-link');
          currentlyActiveLink = correspondingLink;
        }
      });
  });
  const handleScrollTop = () => {
    if (isScrollingAfterClick || isLinkClicked) {
      return;
    }
    const inicioLink = document.querySelector(
      'header nav > ul > li > a[href="#inicio"]'
    );
    if (window.scrollY === 0 && inicioLink && inicioLink !== currentlyActiveLink) {
      navLinks.forEach((link) => link.classList.remove('active-link'));
      inicioLink.classList.add('active-link');
      currentlyActiveLink = inicioLink;
    }
  };
  handleScrollTop(); // Llama al cargar
  window.addEventListener('scroll', handleScrollTop, { passive: true });

  // --- FIN CÓDIGO PARA LINK ACTIVO POR SCROLL (CON ScrollMagic) ---

  // --- CÓDIGO PARA SCROLL AL INICIO DESDE EL LOGO ---
  const logo = document.querySelector('.header-logo'); // Selecciona el logo
  if (logo) {
    logo.addEventListener('click', function (e) {
      e.preventDefault(); // Evita el comportamiento por defecto
      const headerHeight = document.querySelector('header').offsetHeight;
      // Cambiar la URL a la raíz
      window.history.pushState(null, '', window.location.pathname.split('/')[1]? '/' : '/');
      // Hacer scroll al tope superior con la corrección del header
      window.scrollTo({
        top: 0 - headerHeight,
        behavior: 'smooth',
      });
    });
  }
  // --- FIN CÓDIGO PARA SCROLL AL INICIO DESDE EL LOGO ---

  // --- CÓDIGO PARA ACTUALIZAR EL AÑO EN EL FOOTER ---
  const currentYearSpan = document.getElementById('current-year');
  if (currentYearSpan) {
    currentYearSpan.textContent = new Date().getFullYear();
  } else {
    console.warn('Elemento para año no encontrado (ID: current-year)');
  }
  // --- FIN CÓDIGO PARA ACTUALIZAR EL AÑO ---

  console.log('Script v25 inicializado completamente.');
}); // Fin del addEventListener('DOMContentLoaded')
