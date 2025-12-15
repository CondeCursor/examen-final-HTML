// =========================================================
// 1. CONFIGURACIÓN E INICIALIZACIÓN
// =========================================================

const API_URL = 'https://fakestoreapi.com/products';

// Elementos del DOM (Catálogo y Carrito)
const productList = document.getElementById('product-list');
const cartCountElement = document.getElementById('cart-count');
const cartBtn = document.getElementById('cart-btn');
const cartItemsContainer = document.getElementById('cart-items');
const cartTotalPriceElement = document.getElementById('cart-total-price');
const emptyCartMsg = document.getElementById('empty-cart-msg');
const checkoutBtn = document.querySelector('#cartModal .btn-success.w-100'); 
const loadingMsg = document.getElementById('loading-msg'); 

// Elementos del DOM (Formulario de Contacto)
const form = document.getElementById('contact-form');
const formStatus = document.getElementById('form-status');
const submitBtn = document.getElementById('submit-btn');

// Carrito (Carga persistente desde localStorage)
let cart = JSON.parse(localStorage.getItem('cartItems')) || [];
const cartModalElement = document.getElementById('cartModal');
const cartBootstrapModal = new bootstrap.Modal(cartModalElement);


// =========================================================
// 2. GESTIÓN DE LOCALSTORAGE (Persistencia)
// =========================================================

function saveCartToLocalStorage() {
    localStorage.setItem('cartItems', JSON.stringify(cart));
}


// =========================================================
// 3. CONEXIÓN CON API Y RENDERIZADO DE PRODUCTOS
// =========================================================

async function fetchAndRenderProducts() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const products = await response.json();
        
        // CORRECCIÓN: Vaciamos el contenedor productList. Esto resuelve el error de null.
        productList.innerHTML = ''; 
        
        products.forEach(product => {
            productList.appendChild(createProductCard(product));
        });
        
    } catch (error) {
        console.error('Error al obtener los productos:', error);
        productList.innerHTML = '<div class="col-12 alert alert-danger" role="alert">Error al cargar productos. Inténtelo más tarde.</div>';
    }
}

function createProductCard(product) {
    const colDiv = document.createElement('div');
    colDiv.className = 'col';

    const card = document.createElement('article');
    card.className = 'card h-100 shadow-sm';

    const roundedPrice = product.price.toFixed(2);
    
    // Traducción simple de categorías
    const categoryMap = {
        "men's clothing": "Ropa para Hombre",
        "women's clothing": "Ropa para Mujer",
        "jewelery": "Joyería y Accesorios",
        "electronics": "Electrónica"
    };
    const translatedCategory = categoryMap[product.category.toLowerCase()] || product.category;
    
    card.innerHTML = `
        <img src="${product.image}" class="card-img-top product-card-img" alt="Imagen del producto: ${product.title}" loading="lazy">
        <div class="card-body d-flex flex-column">
            <h5 class="card-title">${product.title.substring(0, 45)}...</h5>
            <p class="card-text text-muted">${translatedCategory}</p> 
            <div class="mt-auto">
                <p class="fs-4 fw-bold text-success">$${roundedPrice}</p>
                <button class="btn btn-primary btn-add-to-cart w-100" data-product-id="${product.id}" aria-label="Añadir ${product.title} al carrito">
                    Añadir al Carrito
                </button>
            </div>
        </div>
    `;
    
    const button = card.querySelector('.btn-add-to-cart');
    button.addEventListener('click', () => {
        addToCart({
            id: product.id,
            title: product.title,
            price: product.price
        });
    });

    colDiv.appendChild(card);
    return colDiv;
}


// =========================================================
// 4. LÓGICA DEL CARRITO (Añadir, Editar, Eliminar y Total Dinámico)
// =========================================================

function addToCart(product) {
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    saveCartToLocalStorage();
    updateCartView();
}

function modifyCartItem(productId, action) {
    const numProductId = parseInt(productId);
    const itemIndex = cart.findIndex(item => item.id === numProductId);

    if (itemIndex > -1) {
        if (action === 'increment') {
            cart[itemIndex].quantity++;
        } else if (action === 'decrement' && cart[itemIndex].quantity > 1) {
            cart[itemIndex].quantity--;
        } else if (action === 'remove' || (action === 'decrement' && cart[itemIndex].quantity === 1)) {
            cart.splice(itemIndex, 1);
        }
    }
    
    saveCartToLocalStorage();
    updateCartView();
}

function updateCartView() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCountElement.textContent = totalItems;

    cartItemsContainer.innerHTML = ''; 
    let totalPrice = 0;

    if (cart.length === 0) {
        if (emptyCartMsg) emptyCartMsg.style.display = 'block';
        checkoutBtn.disabled = true; 
    } else {
        if (emptyCartMsg) emptyCartMsg.style.display = 'none';
        checkoutBtn.disabled = false; 
        
        cart.forEach(item => {
            const itemPrice = item.price * item.quantity;
            totalPrice += itemPrice;

            const itemElement = document.createElement('div');
            itemElement.className = 'cart-item-row';
            itemElement.innerHTML = `
                <div class="cart-item-info">
                    ${item.title} 
                    <span class="d-block text-muted small">Precio unitario: $${item.price.toFixed(2)}</span>
                </div>
                <div class="cart-item-controls">
                    <button class="btn btn-sm btn-outline-secondary me-1 decrement-btn" data-id="${item.id}" aria-label="Disminuir cantidad de ${item.title}">-</button>
                    <span class="fw-bold me-2">${item.quantity}</span>
                    <span class="fw-bold me-3 text-primary">$${itemPrice.toFixed(2)}</span>
                    <button class="btn btn-sm btn-outline-secondary me-3 increment-btn" data-id="${item.id}" aria-label="Aumentar cantidad de ${item.title}">+</button>
                    <button class="btn btn-sm btn-danger remove-btn" data-id="${item.id}" aria-label="Eliminar ${item.title} del carrito"><i class="fas fa-times"></i></button>
                </div>
            `;
            cartItemsContainer.appendChild(itemElement);
        });
    }
    cartTotalPriceElement.textContent = totalPrice.toFixed(2);

    // Conectar Event Listeners para la Edición
    document.querySelectorAll('.increment-btn').forEach(button => {
        button.addEventListener('click', (e) => modifyCartItem(e.currentTarget.dataset.id, 'increment'));
    });
    document.querySelectorAll('.decrement-btn').forEach(button => {
        button.addEventListener('click', (e) => modifyCartItem(e.currentTarget.dataset.id, 'decrement'));
    });
    document.querySelectorAll('.remove-btn').forEach(button => {
        button.addEventListener('click', (e) => modifyCartItem(e.currentTarget.dataset.id, 'remove'));
    });
}


// =========================================================
// 5. FUNCIÓN DE FINALIZAR COMPRA (SIMULADOR)
// =========================================================

function finishCheckout() {
    if (cart.length === 0) {
        alert("Tu carrito está vacío. Añade productos para finalizar la compra.");
        return;
    }

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    alert(`¡Compra Finalizada con éxito!\nTotal Pagado: $${total.toFixed(2)}\nGracias por tu compra en TiendaTech.`);

    cart = [];
    saveCartToLocalStorage();
    
    updateCartView();
    cartBootstrapModal.hide(); 
}


// =========================================================
// 6. FORMULARIO DE CONTACTO (Validación y Formspree)
// =========================================================

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showValidationError(inputElement, message) {
    inputElement.classList.add('is-invalid');
    const errorDiv = document.createElement('div');
    errorDiv.className = 'invalid-feedback';
    errorDiv.textContent = message;
    inputElement.parentNode.insertBefore(errorDiv, inputElement.nextSibling);
}

function validateForm() {
    let isValid = true;
    document.querySelectorAll('.is-invalid').forEach(el => el.classList.remove('is-invalid'));
    document.querySelectorAll('.invalid-feedback').forEach(el => el.remove());

    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const messageInput = document.getElementById('message');

    if (nameInput.value.trim() === '') {
        showValidationError(nameInput, 'El nombre es obligatorio.');
        isValid = false;
    }
    if (emailInput.value.trim() === '' || !isValidEmail(emailInput.value.trim())) {
        showValidationError(emailInput, 'Introduce un formato de correo válido.');
        isValid = false;
    }
    if (messageInput.value.trim() === '') {
        showValidationError(messageInput, 'El mensaje no puede estar vacío.');
        isValid = false;
    }

    return isValid;
}

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
        formStatus.innerHTML = '<div class="alert alert-warning" role="alert">Por favor, corrige los errores.</div>';
        return;
    }
    
    const formUrl = form.action; 
    const data = new FormData(form);

    submitBtn.disabled = true;
    submitBtn.textContent = 'Enviando...';
    formStatus.innerHTML = '';

    try {
        const response = await fetch(formUrl, {
            method: 'POST',
            body: data,
            headers: { 'Accept': 'application/json' }
        });

        if (response.ok) {
            formStatus.innerHTML = '<div class="alert alert-success" role="alert">¡Mensaje enviado con éxito!</div>';
            form.reset(); 
        } else {
            formStatus.innerHTML = '<div class="alert alert-danger" role="alert">Error al enviar el formulario.</div>';
        }
    } catch (error) {
        formStatus.innerHTML = '<div class="alert alert-danger" role="alert">Error de red. Inténtelo más tarde.</div>';
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Enviar Mensaje';
    }
});


// =========================================================
// 7. EVENTO DE INICIALIZACIÓN PRINCIPAL (DOMContentLoaded)
// =========================================================

document.addEventListener('DOMContentLoaded', () => {
    // 1. Cargar productos y carrito
    fetchAndRenderProducts(); 
    updateCartView(); 

    // 2. Conectar botón de carrito para mostrar modal
    cartBtn.addEventListener('click', () => {
        cartBootstrapModal.show();
    });
    
    // 3. Conectar botón de checkout (Finalizar Compra)
    checkoutBtn.addEventListener('click', finishCheckout);
});