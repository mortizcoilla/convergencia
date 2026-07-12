/* Convergencia — App v1.0 */
'use strict';

// Datos de productos
const productos = [
  {
    id: "etapa-3-lectura",
    titulo: "Etapa 3: Método Global de Lectura",
    slug: "etapa-3-metodo-global",
    area: "lenguaje",
    nivel: "kinder",
    precio: 4500,
    descripcionCorta: "Composición de palabras con sílabas, recortar y pegar.",
    descripcionLarga: "Método global de lectura adaptado para niños con NEE. Incluye reconocimiento de sílabas inicial, medial y final, sopa de sílabas y actividades de composición progresiva.",
    habilidad: "Reconocimiento visual de palabras y descomposición silábica",
    paraQuien: "Niños de 5-7 años en etapa inicial de lectura. Especialmente útil para quienes procesan mejor la información de forma global antes que analítica.",
    comoUsar: "Imprime, recorta las sílabas de la última página y úsalas para formar las palabras. Una palabra por sesión al principio.",
    paginas: 32,
    formato: "PDF A4",
    imagen: "assets/images/productos/etapa-3.webp",
    muestra: "assets/samples/etapa-3-muestra.pdf",
    nuevo: true,
    bestseller: false,
    gratis: false
  },
  {
    id: "manitos-trazado",
    titulo: "Manitos a la Obra: Trazado",
    slug: "manitos-trazado",
    area: "grafomotricidad",
    nivel: "prekinder",
    precio: 3500,
    descripcionCorta: "Trazado de líneas, caminos, vocales y números 0-10.",
    descripcionLarga: "Desarrollo de motricidad fina mediante trazado guiado. Incluye líneas rectas, curvas, caminos con personajes, vocales y números del 0 al 10.",
    habilidad: "Control grafomotor y coordinación visomotriz",
    paraQuien: "Niños de 4-5 años en etapa preescolar. Ideal para transición Kinder.",
    comoUsar: "Imprime y usa lápiz grueso o crayón. Una hoja por día máximo para no fatigar.",
    paginas: 28,
    formato: "PDF A4",
    imagen: "assets/images/productos/manitos-trazado.webp",
    muestra: "assets/samples/manitos-muestra.pdf",
    nuevo: false,
    bestseller: true,
    gratis: false
  },
  {
    id: "logico-matematico-1",
    titulo: "Soy Lógico y Matemático 1",
    slug: "logico-matematico-1",
    area: "matematicas",
    nivel: "kinder",
    precio: 4500,
    descripcionCorta: "Números 0-9, conteo, comparación, adición y sustracción.",
    descripcionLarga: "Matemáticas desde lo concreto. Incluye conteo, comparación de cantidades, composición y descomposición, adición y sustracción con recta numérica, y problemas contextualizados.",
    habilidad: "Comprensión numérica y operaciones básicas",
    paraQuien: "Niños de 5-7 años. Trabaja desde el reconocimiento numérico hasta operaciones simples con comprensión conceptual.",
    comoUsar: "Sigue el orden de las páginas. Cada unidad dura 1-2 semanas según el ritmo del niño.",
    paginas: 45,
    formato: "PDF A4",
    imagen: "assets/images/productos/logico-matematico-1.webp",
    muestra: "assets/samples/logico-matematico-muestra.pdf",
    nuevo: false,
    bestseller: true,
    gratis: false
  },
  {
    id: "comprension-lectora-1",
    titulo: "Comprensión Lectora 1",
    slug: "comprension-lectora-1",
    area: "lenguaje",
    nivel: "1-basico",
    precio: 4500,
    descripcionCorta: "Lectura de frases cortas con comprensión literal e inferencial.",
    descripcionLarga: "Primera aproximación a la comprensión lectora. Frases cortas, preguntas de localización, inferencia simple y conexión con experiencias previas.",
    habilidad: "Comprensión literal e inferencial de textos breves",
    paraQuien: "Niños de 6-7 años que ya reconocen palabras sueltas y necesitan pasar a la lectura en contexto.",
    comoUsar: "Una página por sesión. Lee en voz alta primero, luego el niño lee solo y responde.",
    paginas: 30,
    formato: "PDF A4",
    imagen: "assets/images/productos/comprension-1.webp",
    muestra: "assets/samples/comprension-1-muestra.pdf",
    nuevo: true,
    bestseller: false,
    gratis: false
  },
  {
    id: "secuencias-didacticas",
    titulo: "Secuencias Didácticas: Ciencias",
    slug: "secuencias-ciencias",
    area: "ciencias",
    nivel: "1-basico",
    precio: 5500,
    descripcionCorta: "Seres vivos, materia y energía. Secuencias completas listas para usar.",
    descripcionLarga: "Secuencias didácticas completas para Ciencias Naturales. Incluye objetivos de aprendizaje, actividades guiadas, evaluación formativa y recursos complementarios.",
    habilidad: "Investigación científica básica y comprensión del entorno natural",
    paraQuien: "Docentes de 1° básico que necesitan planificaciones listas para implementar.",
    comoUsar: "Sigue la secuencia propuesta o adapta según el ritmo de tu curso. Incluye rúbricas de evaluación.",
    paginas: 40,
    formato: "PDF A4",
    imagen: "assets/images/productos/secuencias-ciencias.webp",
    muestra: "assets/samples/secuencias-ciencias-muestra.pdf",
    nuevo: true,
    bestseller: false,
    gratis: false
  },
  {
    id: "kit-transicion",
    titulo: "Kit Transición: Kinder Completo",
    slug: "kit-transicion",
    area: "kit",
    nivel: "prekinder",
    precio: 10000,
    precioOriginal: 13000,
    descripcionCorta: "Manitos a la Obra + Etapa 1 y 2 de Lectura. Todo el año.",
    descripcionLarga: "Kit progresivo que cubre todo el año de transición. Incluye grafomotricidad, reconocimiento de vocales, sílabas abiertas y primeras palabras. Ahorra 20% comprando el kit.",
    habilidad: "Grafomotricidad, reconocimiento fonológico y primeras lecturas",
    paraQuien: "Padres y docentes de sala de 4 años que quieren una ruta de aprendizaje completa y coherente.",
    comoUsar: "Sigue el orden sugerido en la guía de uso incluida. 15-20 minutos diarios.",
    paginas: 85,
    formato: "PDF A4 (3 archivos)",
    imagen: "assets/images/productos/kit-transicion.webp",
    muestra: "assets/samples/kit-transicion-muestra.pdf",
    nuevo: false,
    bestseller: true,
    gratis: false
  }
];

// Utilidades
const $ = (selector, context = document) => context.querySelector(selector);
const $$ = (selector, context = document) => Array.from(context.querySelectorAll(selector));
const formatPrice = (value) => `$${Number(value).toLocaleString('es-CL')}`;
const debounce = (fn, delay) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
};

// Navegación
function initNavigation() {
  const header = $('.header');
  const toggle = $('.menu-toggle');
  const nav = $('.header__nav');
  const close = $('.nav__close');

  if (header) {
    const onScroll = () => {
      header.classList.toggle('header--scrolled', window.scrollY > 10);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  if (toggle && nav) {
    const open = () => {
      nav.classList.add('header__nav--open');
      toggle.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
    };
    const closeNav = () => {
      nav.classList.remove('header__nav--open');
      toggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    };
    toggle.addEventListener('click', open);
    if (close) close.addEventListener('click', closeNav);
    $$('.nav__link', nav).forEach(link => link.addEventListener('click', closeNav));
  }
}

// Carrito
const CART_KEY = 'convergencia_cart';
let carrito = [];

function loadCart() {
  try {
    carrito = JSON.parse(localStorage.getItem(CART_KEY)) || [];
  } catch {
    carrito = [];
  }
}

function saveCart() {
  localStorage.setItem(CART_KEY, JSON.stringify(carrito));
}

function updateCartCount() {
  const count = carrito.reduce((sum, item) => sum + item.cantidad, 0);
  $$('.cart-count').forEach(el => {
    el.textContent = count;
    el.hidden = count === 0;
  });
}

function addToCart(productId) {
  const producto = productos.find(p => p.id === productId);
  if (!producto) return;
  const existing = carrito.find(item => item.id === productId);
  if (existing) {
    existing.cantidad += 1;
  } else {
    carrito.push({ id: producto.id, titulo: producto.titulo, precio: producto.precio, imagen: producto.imagen, cantidad: 1 });
  }
  saveCart();
  updateCartCount();
  openCart();
}

function removeFromCart(productId) {
  carrito = carrito.filter(item => item.id !== productId);
  saveCart();
  updateCartCount();
  renderCart();
}

function updateQuantity(productId, cantidad) {
  const item = carrito.find(i => i.id === productId);
  if (!item) return;
  const qty = parseInt(cantidad, 10);
  if (qty < 1) return removeFromCart(productId);
  item.cantidad = qty;
  saveCart();
  updateCartCount();
  renderCart();
}

function getCartTotal() {
  return carrito.reduce((sum, item) => sum + item.precio * item.cantidad, 0);
}

function renderCart() {
  const list = $('.cart-modal__items');
  if (!list) return;

  if (carrito.length === 0) {
    list.innerHTML = `
      <div class="cart-modal__empty">
        <p>Tu carrito está vacío.</p>
        <a href="tienda.html" class="btn btn-primary mt-md">Ver materiales</a>
      </div>
    `;
  } else {
    list.innerHTML = carrito.map(item => `
      <div class="cart-item" data-id="${item.id}">
        <div class="cart-item__img placeholder" role="img" aria-label="${item.titulo}">${item.titulo}</div>
        <div class="cart-item__info">
          <p class="cart-item__title">${item.titulo}</p>
          <p class="cart-item__price">${formatPrice(item.precio)}</p>
          <div class="cart-item__actions">
            <input type="number" class="cart-item__qty" value="${item.cantidad}" min="1" aria-label="Cantidad">
            <button class="cart-item__remove" type="button">Eliminar</button>
          </div>
        </div>
      </div>
    `).join('');
  }

  const totalEl = $('.cart-modal__total span:last-child');
  if (totalEl) totalEl.textContent = formatPrice(getCartTotal());

  $$('.cart-item__qty', list).forEach(input => {
    input.addEventListener('change', (e) => {
      const id = e.target.closest('.cart-item').dataset.id;
      updateQuantity(id, e.target.value);
    });
  });

  $$('.cart-item__remove', list).forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = e.target.closest('.cart-item').dataset.id;
      removeFromCart(id);
    });
  });
}

function openCart() {
  const modal = $('.cart-modal');
  if (!modal) return;
  renderCart();
  modal.classList.add('cart-modal--open');
  document.body.style.overflow = 'hidden';
}

function closeCart() {
  const modal = $('.cart-modal');
  if (!modal) return;
  modal.classList.remove('cart-modal--open');
  document.body.style.overflow = '';
}

function initCart() {
  loadCart();
  updateCartCount();

  const modal = $('.cart-modal');
  if (!modal) return;

  $('.cart-btn')?.addEventListener('click', (e) => {
    e.preventDefault();
    openCart();
  });
  $('.cart-modal__overlay')?.addEventListener('click', closeCart);
  $('.cart-modal__close')?.addEventListener('click', closeCart);
  $('.cart-modal__checkout')?.addEventListener('click', checkoutWhatsApp);
}

function checkoutWhatsApp() {
  if (carrito.length === 0) return;
  const numero = '56900000000'; // placeholder
  const lineas = carrito.map(item => `- ${item.cantidad}x ${item.titulo} (${formatPrice(item.precio)} c/u)`).join('%0A');
  const total = formatPrice(getCartTotal());
  const mensaje = `Hola, quiero comprar los siguientes materiales:%0A%0A${lineas}%0A%0ATotal: ${total}`;
  window.open(`https://wa.me/${numero}?text=${mensaje}`, '_blank');
}

// Tienda
function getBadgeClass(area) {
  const map = {
    lenguaje: 'badge--lenguaje',
    matematicas: 'badge--matematicas',
    grafomotricidad: 'badge--grafomotricidad',
    ciencias: 'badge--ciencias',
    sociedad: 'badge--sociedad',
    kit: 'badge--kit'
  };
  return map[area] || 'badge--kit';
}

function renderProductos(lista) {
  const grid = $('.productos__grid');
  if (!grid) return;

  grid.innerHTML = lista.map(p => `
    <article class="card producto" data-id="${p.id}">
      <div class="card__image placeholder" role="img" aria-label="${p.titulo}">${p.titulo}</div>
      <div class="card__body">
        <div class="producto__badges">
          <span class="badge ${getBadgeClass(p.area)}">${p.area}</span>
          <span class="badge badge--kit">${p.nivel}</span>
          ${p.nuevo ? '<span class="badge badge--lenguaje">Nuevo</span>' : ''}
          ${p.bestseller ? '<span class="badge badge--matematicas">Bestseller</span>' : ''}
        </div>
        <h3 class="card__title">${p.titulo}</h3>
        <p class="card__text">${p.descripcionCorta}</p>
        <div class="card__footer">
          <div>
            <span class="producto__precio">${formatPrice(p.precio)}</span>
            ${p.precioOriginal ? `<span class="producto__precio-original">${formatPrice(p.precioOriginal)}</span>` : ''}
          </div>
        </div>
        <button class="btn btn-primary btn--sm producto__cta" type="button" data-id="${p.id}">Añadir al carrito</button>
      </div>
    </article>
  `).join('');

  $$('.producto__cta', grid).forEach(btn => {
    btn.addEventListener('click', () => addToCart(btn.dataset.id));
  });

  const resultados = $('.resultados');
  if (resultados) resultados.textContent = `${lista.length} material${lista.length !== 1 ? 'es' : ''}`;
}

function initTienda() {
  if (!$('.tienda-layout')) return;

  renderProductos(productos);

  const filtros = {
    area: new Set(),
    nivel: new Set(),
    formato: new Set()
  };

  $$('.filtros__option input').forEach(input => {
    input.addEventListener('change', () => {
      const group = input.name;
      const value = input.value;
      if (input.checked) filtros[group].add(value);
      else filtros[group].delete(value);
      aplicarFiltros();
    });
  });

  const buscarInput = $('.buscar-input');
  if (buscarInput) {
    buscarInput.addEventListener('input', debounce(aplicarFiltros, 250));
  }

  const ordenSelect = $('.ordenar-select');
  if (ordenSelect) {
    ordenSelect.addEventListener('change', aplicarFiltros);
  }

  function aplicarFiltros() {
    let lista = productos.filter(p => {
      if (filtros.area.size && !filtros.area.has(p.area)) return false;
      if (filtros.nivel.size && !filtros.nivel.has(p.nivel)) return false;
      if (filtros.formato.size) {
        const fmt = p.gratis ? 'gratuito' : (p.area === 'kit' ? 'kit-progresivo' : 'pdf-individual');
        if (!filtros.formato.has(fmt)) return false;
      }
      if (buscarInput?.value.trim()) {
        const q = buscarInput.value.toLowerCase();
        return p.titulo.toLowerCase().includes(q) || p.descripcionCorta.toLowerCase().includes(q);
      }
      return true;
    });

    const orden = ordenSelect?.value || 'relevancia';
    switch (orden) {
      case 'nuevos': lista = lista.filter(p => p.nuevo).concat(lista.filter(p => !p.nuevo)); break;
      case 'precio-menor': lista.sort((a, b) => a.precio - b.precio); break;
      case 'precio-mayor': lista.sort((a, b) => b.precio - a.precio); break;
    }

    renderProductos(lista);
  }

  const filtrosToggle = $('.filtros__toggle');
  const filtrosEl = $('.filtros');
  if (filtrosToggle && filtrosEl) {
    filtrosToggle.addEventListener('click', () => {
      filtrosEl.classList.toggle('filtros--open');
      const open = filtrosEl.classList.contains('filtros--open');
      filtrosToggle.setAttribute('aria-expanded', String(open));
    });
  }
}

// Formulario de contacto
function initFormulario() {
  const form = $('.contacto-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let valid = true;

    const campos = [
      { name: 'nombre', min: 2 },
      { name: 'email', type: 'email' },
      { name: 'mensaje', min: 10 }
    ];

    campos.forEach(({ name, min, type }) => {
      const group = form.querySelector(`[name="${name}"]`).closest('.form-group');
      const val = form.querySelector(`[name="${name}"]`).value.trim();
      let error = false;

      if (min && val.length < min) error = true;
      if (type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) error = true;

      group.classList.toggle('form-group--error', error);
      valid = valid && !error;
    });

    if (valid) {
      const btn = form.querySelector('button[type="submit"]');
      const original = btn.textContent;
      btn.textContent = 'Mensaje enviado';
      btn.disabled = true;
      setTimeout(() => {
        form.reset();
        btn.textContent = original;
        btn.disabled = false;
      }, 2000);
    }
  });

  // Contador de caracteres
  const textarea = form.querySelector('textarea');
  const counter = $('.char-counter');
  if (textarea && counter) {
    textarea.addEventListener('input', () => {
      counter.textContent = `${textarea.value.length} caracteres`;
    });
  }
}

// Lazy loading
function initLazyLoad() {
  if (!('IntersectionObserver' in window)) return;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        if (img.dataset.src) {
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
        }
        observer.unobserve(img);
      }
    });
  }, { rootMargin: '100px' });

  $$('img[data-src]').forEach(img => observer.observe(img));
}

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initCart();
  initTienda();
  initFormulario();
  initLazyLoad();
});
