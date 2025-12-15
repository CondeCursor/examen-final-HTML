# 🛍️ TiendaTech: E-Commerce Dinámico (Proyecto Final)

Este proyecto implementa una tienda online completamente funcional y dinámica, cumpliendo con todos los requisitos de un proyecto final web. La aplicación consume datos de una API REST, ofrece un carrito de compras persistente y garantiza un diseño adaptable a cualquier dispositivo.

## 🌟 Características Implementadas

El proyecto está construido sobre una arquitectura robusta que incluye:

### I. Estructura y Diseño (HTML / CSS)
* **HTML Semántico:** Uso de etiquetas (`<header>`, `<main>`, `<nav>`, `<footer>`, `<article>`) para mejor SEO y Accesibilidad (A11Y).
* **Diseño Responsivo:** Implementado con **Bootstrap 5**, **Flexbox** y **CSS Grid** (en la sección de Reseñas) para la adaptación fluida a móviles, tablets y escritorios.
* **Estilos Profesionales:** Integración de **Google Fonts** (`Roboto`) y uso de propiedades avanzadas de `background` (degradados).

### II. Funcionalidad Dinámica (JavaScript)
* **Consumo de API REST:** Utiliza `fetch()` para obtener y renderizar el catálogo de productos de la **Fake Store API** en forma de tarjetas atractivas.
* **Carrito de Compras Persistente:**
    * Los productos se añaden al carrito desde las tarjetas.
    * El estado del carrito (ítems y cantidades) se guarda usando **`localStorage`** para mantener la persistencia entre sesiones.
    * Funciones para **editar cantidades**, **eliminar productos** y actualizar el **total dinámico** en tiempo real.
    * Contador dinámico en la barra de navegación.
* **Manipulación del DOM:** Funciones específicas para actualizar la interfaz (renderizado de productos, lista del carrito, mensajes de error/éxito).

### III. Formulario y Validación
* **Formulario de Contacto Funcional:** El formulario utiliza **Formspree** para simular el envío de datos a un servidor.
* **Validación del DOM:** Implementación de funciones JavaScript para validar campos requeridos (Nombre, Mensaje) y el formato del **Correo Electrónico** antes del envío.

### IV. Calidad y Auditoría (SEO & A11Y)
* **SEO Básico:** Uso de metaetiquetas clave (`description`, `keywords`, `title`).
* **Accesibilidad (A11Y):** Uso de atributos `alt` en todas las imágenes dinámicas y estáticas, y atributos `aria-label` en botones importantes para la navegación con lectores de pantalla.

## 🛠️ Estructura del Proyecto