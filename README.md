# PYP Tornillos y Herramientas 🛠️

E-commerce para la venta de tornillería, herramientas, maquinaria y equipos para el hogar y la construcción.

## 🚀 Demo

[Ver proyecto](https://sevenstark.github.io/E-commercePyP)

## ✨ Características

- **Catálogo de productos** por categorías: tornillos, herramientas, maquinaria, hogar
- **Autenticación** con Firebase Auth (registro e inicio de sesión)
- **Gestión de empresas proveedoras** y sus productos con precios
- **Comparativa de precios** automática entre empresas para un mismo producto
- **Cálculo de IVA (19%)** incluido en los precios
- **Diseño responsive** optimizado para móvil y escritorio
- **Busqueda** de productos con autocomplete

## 🛠️ Tecnologías

- **Frontend:** HTML5, CSS3, JavaScript (vanilla)
- **Backend:** Firebase Firestore (base de datos NoSQL)
- **Autenticación:** Firebase Auth
- **Hosting:** GitHub Pages

## 📁 Estructura

```
├── index.html          # Página principal (catálogo)
├── login.html          # Inicio de sesión / registro
├── inicio.html         # Dashboard (empresas, productos, comparativa)
├── styles.css          # Estilos globales
├── script.js           # Lógica principal
├── img/                # Recursos gráficos
└── .gitignore
```

## 🔐 Seguridad

El proyecto usa **Firebase Security Rules** para proteger los datos:
- Solo usuarios autenticados pueden leer/escribir en Firestore
- Las credenciales de Firebase (`apiKey`, `authDomain`) no son secretas — la seguridad real está en las reglas de acceso

## 📦 Instalación local

```bash
git clone https://github.com/SevenStark/E-commercePyP.git
cd E-commercePyP
```

Abre `index.html` en tu navegador o usa **Live Server** de VS Code.

## 📄 Licencia

Todos los derechos reservados © 2026 PYP Tornillos y Herramientas.
