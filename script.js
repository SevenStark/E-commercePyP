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

firebase.initializeApp(firebaseConfig)
const auth = firebase.auth()

// ===========================
// DOM Ready
// ===========================
document.addEventListener('DOMContentLoaded', function () {

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
            var phone = 'XXXXXXXXXX'
            var message = encodeURIComponent('Hola, quiero información sobre sus productos.')
            this.href = 'https://wa.me/' + phone + '?text=' + message
        })
    }

    // === Order Buttons ===
    var orderButtons = document.querySelectorAll('.btn')
    orderButtons.forEach(function (btn) {
        btn.addEventListener('click', function () {
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
