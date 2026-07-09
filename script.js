// ===========================
// FIREBASE CONFIGURACIÓN
// ===========================
// REEMPLAZA estos valores con los de tu proyecto Firebase
// Firebase Console > Configuración del proyecto > Tus aplicaciones > Web
const firebaseConfig = {
    apiKey: "AIzaSyAs1VbxixHJxl58B3xLeemlkDsuEVTfWTs",
    authDomain: "authenticationpyp.firebaseapp.com",
    projectId: "authenticationpyp",
    storageBucket: "authenticationpyp.firebasestorage.app",
    messagingSenderId: "419339169064",
    appId: "1:419339169064:web:2b600685416be11866741d",
    measurementId: "G-81LVDTKB0F"
}

var auth = null
var db = null
if (typeof firebase !== 'undefined') {
    firebase.initializeApp(firebaseConfig)
    if (typeof firebase.auth === 'function') {
        auth = firebase.auth()
    }
    if (typeof firebase.firestore === 'function') {
        db = firebase.firestore()
    }
}

// ===========================
// PRODUCT DATA (fallback)
// ===========================
var productosCatalogo = {
    tornillos: [
        { id: 'fallback', img: 'img/tornillos.png', nombre: 'Perno Hexagonal 1/4 x 1', desc: 'Grado 2 - Rosca ordinaria', precio: 2500 },
        { id: 'fallback', img: 'img/tornillos.png', nombre: 'Perno Hexagonal 3/8 x 1-1/2', desc: 'Grado 5 - Rosca ordinaria', precio: 3200 },
        { id: 'fallback', img: 'img/tornillos.png', nombre: 'Perno Bristol 5/16 x 1', desc: 'Grado 5 - Rosca ordinaria', precio: 2800 },
        { id: 'fallback', img: 'img/tornillos.png', nombre: 'Tuerca Hexagonal 1/4', desc: 'Grado 2 - Rosca ordinaria', precio: 800 },
        { id: 'fallback', img: 'img/tornillotarjeta.png', nombre: 'Arandela Plana 1/4', desc: 'Acero al carbón', precio: 400 },
        { id: 'fallback', img: 'img/tornillos.png', nombre: 'Perno Carriaje 3/8 x 2', desc: 'Grado 2 - Rosca ordinaria', precio: 3500 }
    ],
    herramientas: [
        { id: 'fallback', img: 'img/taladro-de-mano.png', nombre: 'Destornillador Estrella 3/16 (3")', desc: 'Mango ergonómico - Punta magnética', precio: 4500 },
        { id: 'fallback', img: 'img/taladro-de-mano.png', nombre: 'Destornillador Pala 1/4 (5")', desc: 'Mango ergonómico - Punta magnética', precio: 5200 },
        { id: 'fallback', img: 'img/muestra.jpg', nombre: 'Llave Española 8"', desc: 'Acero al carbono - Cromado', precio: 6800 },
        { id: 'fallback', img: 'img/muestra.jpg', nombre: 'Llave Mixta 5/16', desc: 'Acero al cromo vanadio', precio: 4200 },
        { id: 'fallback', img: 'img/muestra.jpg', nombre: 'Pinza para Pines 6"', desc: 'Acero al carbono - Templado', precio: 7500 },
        { id: 'fallback', img: 'img/muestra.jpg', nombre: 'Llave de Tubo 12"', desc: 'Acero al carbono - Cromado', precio: 9000 }
    ],
    maquinaria: [
        { id: 'fallback', img: 'img/taladro.jpg', nombre: 'Pulidora DeWalt 4½" 700W', desc: 'Disco 4½" - Velocidad variable', precio: 45000 },
        { id: 'fallback', img: 'img/taladro.jpg', nombre: 'Pulidora Inco 4½" 600W', desc: 'Disco 4½" - Compacta', precio: 28000 },
        { id: 'fallback', img: 'img/taladro.jpg', nombre: 'Taladro DeWalt ⅜" 400W', desc: 'Mandril ⅜" - 400W - Cable', precio: 35000 },
        { id: 'fallback', img: 'img/taladro.jpg', nombre: 'Taladro Inalámbrico Inco ⅜"', desc: 'Mandril ⅜" - 18V - 2 Baterías', precio: 42000 },
        { id: 'fallback', img: 'img/taladro.jpg', nombre: 'Lijadora DeWalt', desc: 'Lijadora orbital - 400W', precio: 38000 },
        { id: 'fallback', img: 'img/taladro.jpg', nombre: 'Lijadora Inco', desc: 'Lijadora orbital - 300W', precio: 22000 }
    ],
    hogar: [
        { id: 'fallback', img: 'img/inversor.png', nombre: 'Hidrolavadora Inco 1200W', desc: '1200W - 110 bar - Incluye boquillas', precio: 65000 },
        { id: 'fallback', img: 'img/inversor.png', nombre: 'Hidrolavadora Black & Decker', desc: '1400W - 120 bar - Incluye boquillas', precio: 85000 },
        { id: 'fallback', img: 'img/inversor.png', nombre: 'Inversor Lincoln 160A', desc: '160A - Electrodo revestido', precio: 120000 },
        { id: 'fallback', img: 'img/inversor.png', nombre: 'Inversor Inverrr 160A', desc: '160A - Portátil', precio: 95000 },
        { id: 'fallback', img: 'img/inversor.png', nombre: 'Equipo TIG y MIG', desc: 'Dual voltaje - Incluye antorcha', precio: 180000 },
        { id: 'fallback', img: 'img/inversor.png', nombre: 'Hidrolavadora Wilker', desc: '1300W - 115 bar - Incluye boquillas', precio: 75000 }
    ]
}

// ===========================
// LOAD PRODUCTS FROM FIRESTORE
// ===========================
function cargarProductosDesdeFirebase(callback) {
    if (!db) {
        if (callback) callback()
        return
    }
    db.collection('inventario').get().then(function (snapshot) {
        if (snapshot.empty) {
            if (callback) callback()
            return
        }
        var dataPorCategoria = {}
        snapshot.forEach(function (doc) {
            var p = doc.data()
            p.id = doc.id
            if (!p.img) p.img = 'img/muestra.jpg'
            var cat = p.categoria || 'tornillos'
            if (!dataPorCategoria[cat]) dataPorCategoria[cat] = []
            dataPorCategoria[cat].push(p)
        })
        for (var cat in dataPorCategoria) {
            dataPorCategoria[cat].sort(function (a, b) { return a.nombre.localeCompare(b.nombre) })
            if (dataPorCategoria[cat].length > 0) {
                productosCatalogo[cat] = dataPorCategoria[cat]
            }
        }
        if (callback) callback()
    }).catch(function () {
        if (callback) callback()
    })
}

// ===========================
// DOM Ready
// ===========================
document.addEventListener('DOMContentLoaded', function () {

    // === Hero Carousel ===
    var carousel = document.getElementById('hero-carousel')
    var slides = carousel ? carousel.querySelectorAll('.carousel-slide') : []
    var currentSlide = 0
    var autoplayInterval = null

    if (slides.length > 0) {
        function goToSlide(index) {
            slides.forEach(function (s, i) {
                s.classList.toggle('active', i === index)
            })
            currentSlide = index
        }

        function nextSlide() {
            goToSlide((currentSlide + 1) % slides.length)
        }

        function prevSlide() {
            goToSlide((currentSlide - 1 + slides.length) % slides.length)
        }

        function startAutoplay() {
            stopAutoplay()
            autoplayInterval = setInterval(nextSlide, 5000)
        }

        function stopAutoplay() {
            if (autoplayInterval) {
                clearInterval(autoplayInterval)
                autoplayInterval = null
            }
        }

        var prevBtn = document.getElementById('carousel-prev')
        var nextBtn = document.getElementById('carousel-next')

        if (prevBtn) prevBtn.addEventListener('click', function () { stopAutoplay(); prevSlide(); startAutoplay() })
        if (nextBtn) nextBtn.addEventListener('click', function () { stopAutoplay(); nextSlide(); startAutoplay() })

        startAutoplay()
    }

    // === Product Grid (index) ===
    function renderProductGrid() {
        for (var cat in productosCatalogo) {
            var grid = document.getElementById('grid-' + cat)
            if (!grid) continue
            var html = ''
            productosCatalogo[cat].forEach(function (p, idx) {
                html += '<div class="prod-card" data-cat="' + cat + '" data-idx="' + idx + '">' +
                    '<img src="' + p.img + '" alt="' + p.nombre + '" loading="lazy">' +
                    '<span class="prod-name">' + p.nombre + '</span>' +
                    '</div>'
            })
            grid.innerHTML = html
        }
    }

    renderProductGrid()

    // === Catálogo Page ===
    var catContent = document.getElementById('cat-page-content')

    function renderCatalogoPage() {
        if (!catContent) return
        var catLabels = {
            tornillos: { nombre: 'Tornillería', icono: 'img/tornillo.png' },
            herramientas: { nombre: 'Herramientas', icono: 'img/taladro-de-mano.png' },
            maquinaria: { nombre: 'Maquinaria', icono: 'img/taladro.png' },
            hogar: { nombre: 'Hogar y Construcción', icono: 'img/tornillotarjeta.png' }
        }
        var html = ''
        for (var cat in productosCatalogo) {
            var info = catLabels[cat] || { nombre: cat, icono: '' }
            html += '<h2 id="cat-' + cat + '"><img src="' + info.icono + '" style="width:24px;height:24px;object-fit:contain;"> ' + info.nombre + ' <span class="count">(' + productosCatalogo[cat].length + ')</span></h2>'
            html += '<div class="cat-page-grid">'
            productosCatalogo[cat].forEach(function (p, idx) {
                html += '<div class="cat-page-item" data-cat="' + cat + '" data-idx="' + idx + '">' +
                    '<img src="' + p.img + '" alt="' + p.nombre + '" loading="lazy">' +
                    '<div class="prod-name">' + p.nombre + '</div>' +
                    '<div class="prod-desc">' + p.desc + '</div>' +
                    '<div class="prod-price">$' + p.precio.toLocaleString('es-CO') + '</div>' +
                    '</div>'
            })
            html += '</div>'
        }
        catContent.innerHTML = html
    }

    renderCatalogoPage()

    // If Firestore available, load from there and re-render
    cargarProductosDesdeFirebase(function () {
        renderProductGrid()
        renderCatalogoPage()
    })

    // === Product Modal ===
    var modal = document.getElementById('prod-modal')
    var modalImg = document.getElementById('modal-img')
    var modalTitle = document.getElementById('modal-title')
    var modalDesc = document.getElementById('modal-desc')
    var modalPrice = document.getElementById('modal-price')
    var modalClose = document.getElementById('prod-modal-close')
    var modalOrder = document.getElementById('modal-order')

    document.addEventListener('click', function (e) {
        var card = e.target.closest('.prod-card, .cat-page-item')
        if (!card) return
        var cat = card.getAttribute('data-cat')
        var idx = parseInt(card.getAttribute('data-idx'))
        var prod = productosCatalogo[cat][idx]
        if (!prod) return

        modalImg.src = prod.img
        modalImg.alt = prod.nombre
        modalTitle.textContent = prod.nombre
        modalDesc.textContent = prod.desc
        modalPrice.textContent = '$' + prod.precio.toLocaleString('es-CO')
        modal.classList.add('show')
    })

    if (modalClose) {
        modalClose.addEventListener('click', function () {
            modal.classList.remove('show')
        })
    }

    if (modal) {
        modal.addEventListener('click', function (e) {
            if (e.target === modal) modal.classList.remove('show')
        })
    }

    // === Cart ===
    var cart = []
    var whatsappNumber = '573134140072' // Cambiar por número real

    function addToCart(nombre, precio) {
        var idx = cart.findIndex(function (i) { return i.nombre === nombre })
        if (idx !== -1) {
            cart[idx].cant += 1
        } else {
            cart.push({ nombre: nombre, precio: precio, cant: 1 })
        }
        renderCart()
    }

    function removeFromCart(nombre) {
        cart = cart.filter(function (i) { return i.nombre !== nombre })
        renderCart()
    }

    function renderCart() {
        var container = document.getElementById('cart-items')
        var footer = document.getElementById('cart-footer')
        var badge = document.getElementById('cart-badge')
        var totalEl = document.getElementById('cart-total')

        var total = 0
        var count = 0
        var html = ''

        cart.forEach(function (item) {
            total += item.precio * item.cant
            count += item.cant
            html += '<div class="cart-item">' +
                '<div class="cart-item-name">' + item.nombre + (item.cant > 1 ? ' <small style="color:#888;">x' + item.cant + '</small>' : '') + '</div>' +
                '<div style="display:flex;align-items:center;gap:0.5rem;">' +
                '<span class="cart-item-price">$' + (item.precio * item.cant).toLocaleString('es-CO') + '</span>' +
                '<button class="cart-item-remove" data-nombre="' + item.nombre + '">✕</button>' +
                '</div></div>'
        })

        if (cart.length === 0) {
            html = '<div class="cart-empty">El carrito está vacío.</div>'
            if (footer) footer.style.display = 'none'
        } else {
            if (footer) footer.style.display = 'grid'
        }

        if (container) container.innerHTML = html
        if (badge) badge.textContent = count
        if (totalEl) totalEl.textContent = 'Total: $' + total.toLocaleString('es-CO')

        container.querySelectorAll('.cart-item-remove').forEach(function (btn) {
            btn.addEventListener('click', function () {
                removeFromCart(this.getAttribute('data-nombre'))
            })
        })
    }

    if (modalOrder) {
        modalOrder.addEventListener('click', function () {
            var nombre = modalTitle.textContent
            var precioTexto = modalPrice.textContent.replace(/[^0-9]/g, '')
            var precio = parseFloat(precioTexto)
            if (!nombre || !precio) return
            addToCart(nombre, precio)
            mostrarToast('✓ ' + nombre + ' agregado al carrito')
            modal.classList.remove('show')
        })
    }

    // Cart FAB
    var cartFab = document.getElementById('cart-fab')
    var cartDrawer = document.getElementById('cart-drawer')
    var cartOverlay = document.getElementById('cart-overlay')
    var cartClose = document.getElementById('cart-close')
    var cartOrder = document.getElementById('cart-order')

    function openCart() {
        if (cartDrawer) cartDrawer.classList.add('show')
        if (cartOverlay) cartOverlay.classList.add('show')
    }

    function closeCart() {
        if (cartDrawer) cartDrawer.classList.remove('show')
        if (cartOverlay) cartOverlay.classList.remove('show')
    }

    if (cartFab) cartFab.addEventListener('click', openCart)
    if (cartClose) cartClose.addEventListener('click', closeCart)
    if (cartOverlay) cartOverlay.addEventListener('click', closeCart)

    if (cartOrder) {
        cartOrder.addEventListener('click', function () {
            if (cart.length === 0) { mostrarToast('El carrito está vacío.'); return }

            var msg = '*Pedido PYP Tornillos y Herramientas*%0A%0A'
            var total = 0
            cart.forEach(function (item) {
                var subtotal = item.precio * item.cant
                total += subtotal
                msg += '• ' + item.nombre + (item.cant > 1 ? ' x' + item.cant : '') + ' - $' + subtotal.toLocaleString('es-CO') + '%0A'
            })
            msg += '%0A*Total: $' + total.toLocaleString('es-CO') + '*%0A%0A'
            msg += '_Gracias por tu compra!_'

            closeCart()
            window.open('https://wa.me/' + whatsappNumber + '?text=' + msg, '_blank')
        })
    }

    // === Menu Overlay (Hamburguesa) ===
    var menuBtn = document.getElementById('menu-btn')
    var menuOverlay = document.getElementById('menu-overlay')
    var menuClose = document.getElementById('menu-close')

    if (menuBtn && menuOverlay) {
        menuBtn.addEventListener('click', function (e) {
            e.preventDefault()
            menuOverlay.classList.add('active')
        })
    }

    if (menuClose && menuOverlay) {
        menuClose.addEventListener('click', function () {
            menuOverlay.classList.remove('active')
        })
    }

    if (menuOverlay) {
        menuOverlay.addEventListener('click', function (e) {
            if (e.target === menuOverlay) {
                menuOverlay.classList.remove('active')
            }
        })
    }

    // === Search Overlay ===
    var searchToggle = document.getElementById('search-toggle')
    var searchOverlay = document.getElementById('search-overlay')
    var searchClose = document.getElementById('search-close')
    var searchInput = document.getElementById('search-input-mobile')

    if (searchToggle && searchOverlay) {
        searchToggle.addEventListener('click', function (e) {
            e.preventDefault()
            searchOverlay.classList.toggle('active')
            if (searchOverlay.classList.contains('active') && searchInput) {
                searchInput.focus()
            }
        })
    }

    if (searchClose && searchOverlay) {
        searchClose.addEventListener('click', function () {
            searchOverlay.classList.remove('active')
        })
    }

    if (searchOverlay) {
        searchOverlay.addEventListener('click', function (e) {
            if (e.target === searchOverlay) {
                searchOverlay.classList.remove('active')
            }
        })
    }

    // === WhatsApp Link ===
    var whatsappLink = document.getElementById('whatsapp-link')
    if (whatsappLink) {
        whatsappLink.addEventListener('click', function (e) {
            var phone = '573134140072'
            var message = encodeURIComponent('Hola, quiero información sobre sus productos.')
            this.href = 'https://wa.me/' + phone + '?text=' + message
        })
    }

    // === Order Buttons ===
    var orderButtons = document.querySelectorAll('.btn')
    orderButtons.forEach(function (btn) {
        btn.addEventListener('click', function (e) {
            if (btn.id === 'modal-order') return
            if (btn.tagName === 'A') return
            mostrarToast('Producto agregado al carrito (demostración).')
        })
    })

    // ===========================
    // FIREBASE AUTH
    // ===========================
    var form = document.getElementById('auth-form')
    var emailInput = document.getElementById('auth-email')
    var passInput = document.getElementById('auth-password')
    var confirmGroup = document.getElementById('confirm-group')
    var confirmInput = document.getElementById('auth-confirm')
    var submitBtn = document.getElementById('auth-submit')
    var formTitle = document.getElementById('form-title')
    var toggleLink = document.getElementById('toggle-link')
    var resetLink = document.getElementById('reset-link')
    var errorDiv = document.getElementById('error-message')

    if (!form) return

    var isRegistering = false

    toggleLink.addEventListener('click', function (e) {
        e.preventDefault()
        isRegistering = !isRegistering
        if (isRegistering) {
            formTitle.textContent = 'Crear Cuenta'
            submitBtn.textContent = 'Registrarse'
            confirmGroup.style.display = 'block'
            toggleLink.textContent = '¿Ya tienes cuenta? Inicia sesión'
        } else {
            formTitle.textContent = 'Iniciar Sesión'
            submitBtn.textContent = 'Ingresar'
            confirmGroup.style.display = 'none'
            toggleLink.textContent = '¿No tienes cuenta? Regístrate'
        }
        errorDiv.textContent = ''
    })

    resetLink.addEventListener('click', function (e) {
        e.preventDefault()
        var email = emailInput.value.trim()
        if (!email) {
            mostrarError('Ingresa tu correo electrónico primero.')
            return
        }
        auth.sendPasswordResetEmail(email)
            .then(function () {
                mostrarToast('Correo de recuperación enviado. Revisa tu bandeja de entrada.')
            })
            .catch(function (error) {
                mostrarError(obtenerMensajeError(error.code))
            })
    })

    form.addEventListener('submit', function (e) {
        e.preventDefault()
        errorDiv.textContent = ''

        var email = emailInput.value.trim()
        var password = passInput.value

        if (!email || !password) {
            mostrarError('Completa todos los campos.')
            return
        }

        if (isRegistering) {
            var confirm = confirmInput.value
            if (password !== confirm) {
                mostrarError('Las contraseñas no coinciden.')
                return
            }
            if (password.length < 6) {
                mostrarError('La contraseña debe tener al menos 6 caracteres.')
                return
            }
            submitBtn.disabled = true
            submitBtn.textContent = 'Registrando...'

            auth.createUserWithEmailAndPassword(email, password)
                .then(function (userCredential) {
                    mostrarToast('Cuenta creada exitosamente. Bienvenido.')
                    setTimeout(function () {
                        window.location.href = 'inicio.html'
                    }, 1500)
                })
                .catch(function (error) {
                    mostrarError(obtenerMensajeError(error.code))
                    submitBtn.disabled = false
                    submitBtn.textContent = 'Registrarse'
                })
        } else {
            submitBtn.disabled = true
            submitBtn.textContent = 'Ingresando...'

            auth.signInWithEmailAndPassword(email, password)
                .then(function (userCredential) {
                    mostrarToast('Inicio de sesión exitoso.')
                    setTimeout(function () {
                        window.location.href = 'inicio.html'
                    }, 1000)
                })
                .catch(function (error) {
                    mostrarError(obtenerMensajeError(error.code))
                    submitBtn.disabled = false
                    submitBtn.textContent = 'Ingresar'
                })
        }
    })

    // ===========================
    // UI Helper Functions
    // ===========================
    function mostrarError(msg) {
        if (errorDiv) {
            errorDiv.textContent = msg
            errorDiv.style.display = 'block'
        }
    }

    function mostrarToast(msg) {
        var toast = document.getElementById('toast')
        if (!toast) return
        toast.textContent = msg
        toast.classList.add('show')
        setTimeout(function () {
            toast.classList.remove('show')
        }, 3000)
    }

    function obtenerMensajeError(code) {
        var mensajes = {
            'auth/user-not-found': 'No existe una cuenta con este correo.',
            'auth/wrong-password': 'Contraseña incorrecta.',
            'auth/invalid-credential': 'Credenciales inválidas. Verifica tus datos.',
            'auth/email-already-in-use': 'Este correo ya está registrado.',
            'auth/weak-password': 'La contraseña debe tener al menos 6 caracteres.',
            'auth/invalid-email': 'El formato del correo no es válido.',
            'auth/too-many-requests': 'Demasiados intentos. Intenta más tarde.',
            'auth/network-request-failed': 'Error de conexión. Verifica tu internet.'
        }
        return mensajes[code] || 'Error: ' + code
    }
})
