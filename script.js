// Define prices for each drink and size
const prices = {
    'Latte': { 'TALL': 3.5, 'GRANDE': 4.0, 'VENTI': 4.5 },
    'Caramel Frappuccino': { 'TALL': 4.5, 'GRANDE': 5.0, 'VENTI': 5.5 },
    'Chocolate Milkshake': { 'TALL': 4.0, 'GRANDE': 4.5, 'VENTI': 5.0 },
    'Strawberry Lemon Refresher': { 'TALL': 4.0, 'GRANDE': 4.5, 'VENTI': 5.0 },
};

// Initialize cart object to store items and total cost
let cart = {
    items: [],
    total: 0,
};

// Load cart data from localStorage
function loadCart() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
    }
}

// Save cart data to localStorage
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Function to add item to cart based on drink and size
function addToCart(drink, size) {
    const price = prices[drink][size]; // Get the price for the selected drink and size
    // Check if item already exists in cart
    const existingItemIndex = cart.items.findIndex(item => item.drink === drink && item.size === size);
    if (existingItemIndex !== -1) {
        cart.items[existingItemIndex].quantity += 1; // Increase quantity if item exists
    } else {
        cart.items.push({ drink, size, price, quantity: 1 }); // Add new item to cart
    }
    cart.total += price; // Update total cost
    updateCartTotal(); // Update displayed total in the basket
    updateCartModal(); // Update cart modal content
    saveCart(); // Save cart data to localStorage
}

// Function to update the total cost displayed in the basket
function updateCartTotal() {
    const cartTotalElement = document.getElementById('cart-total');
    if (cartTotalElement) {
        cartTotalElement.innerText = cart.total.toFixed(2); // Display total with two decimal places
    }
}

// Function to toggle cart modal visibility
function toggleCart() {
    const modal = document.getElementById('cart-modal');
    if (modal) {
        modal.style.display = modal.style.display === 'block' ? 'none' : 'block';
        if (modal.style.display === 'block') {
            updateCartModal(); // Update cart modal content when modal is displayed
        }
    }
}

// Function to update the cart modal content
function updateCartModal() {
    const modal = document.getElementById('cart-modal');
    const cartItemsContainer = document.getElementById('cart-items');
    const modalCartTotalElement = document.getElementById('modal-cart-total');

    // Clear existing items in the modal
    if (cartItemsContainer) {
        cartItemsContainer.innerHTML = '';
    }

    // Populate the modal with current items in the cart
    cart.items.forEach((item, index) => {
        const itemElement = document.createElement('div');
        itemElement.classList.add('cart-item');

        const itemImage = document.createElement('img');
        itemImage.src = `images/${item.drink.toLowerCase().replace(/\s+/g, '-')}.jpg`; // Corrected image path
        itemImage.alt = item.drink;
        itemImage.classList.add('cart-item-image');

        const itemDetails = document.createElement('div');
        itemDetails.classList.add('cart-item-details');

        const itemName = document.createElement('p');
        itemName.textContent = `${item.drink} - ${item.size}`;
        itemName.classList.add('cart-item-name');

        const itemPrice = document.createElement('p');
        itemPrice.textContent = `$${item.price.toFixed(2)}`;
        itemPrice.classList.add('cart-item-price');

        const itemQuantity = document.createElement('input');
        itemQuantity.type = 'number';
        itemQuantity.value = item.quantity;
        itemQuantity.min = '1';
        itemQuantity.classList.add('cart-item-quantity');
        itemQuantity.addEventListener('change', (event) => updateCartItemQuantity(index, event.target.value));

        const removeButton = document.createElement('button');
        removeButton.textContent = 'Remove';
        removeButton.classList.add('cart-item-remove');
        removeButton.addEventListener('click', () => removeCartItem(index));

        itemDetails.appendChild(itemName);
        itemDetails.appendChild(itemPrice);
        itemDetails.appendChild(itemQuantity);
        itemDetails.appendChild(removeButton);

        itemElement.appendChild(itemImage);
        itemElement.appendChild(itemDetails);

        cartItemsContainer.appendChild(itemElement);
    });

    // Update total cost in the modal
    if (modalCartTotalElement) {
        modalCartTotalElement.innerText = cart.total.toFixed(2);
    }

    // Display or hide the modal based on cart items
    if (cart.items.length > 0) {
        modal.style.display = 'block';
    } else {
        modal.style.display = 'none';
    }
}

// Function to update quantity of a cart item
function updateCartItemQuantity(index, quantity) {
    const parsedQuantity = parseInt(quantity);
    if (parsedQuantity > 0) {
        const item = cart.items[index];
        cart.total -= item.price * item.quantity; // Subtract the old total for this item
        item.quantity = parsedQuantity;
        cart.total += item.price * item.quantity; // Add the new total for this item
        updateCartTotal();
        updateCartModal();
        saveCart(); // Save cart data to localStorage
    }
}

// Function to remove item from cart
function removeCartItem(index) {
    const removedItem = cart.items.splice(index, 1)[0];
    cart.total -= removedItem.price * removedItem.quantity;
    updateCartTotal();
    updateCartModal();
    saveCart(); // Save cart data to localStorage
}

// Close the cart modal if the user clicks outside of it
window.onclick = function(event) {
    const modal = document.getElementById('cart-modal');
    if (event.target === modal) {
        toggleCart();
    }
};

// Close the cart modal if the user presses the Escape key
document.onkeydown = function(event) {
    if (event.key === 'Escape') {
        toggleCart();
    }
};

// Update initial display
loadCart(); // Load cart data from localStorage on page load
updateCartTotal();
updateCartModal();

// Function to show payment options
function showPaymentOptions() {
    const paymentOptions = document.createElement('div');
    paymentOptions.innerHTML = `
        <h3>Select Payment Method</h3>
        <label><input type="radio" name="payment-method" value="credit-card"> Credit Card</label><br>
        <label><input type="radio" name="payment-method" value="upi"> UPI</label><br>
        <label><input type="radio" name="payment-method" value="cash-on-delivery"> Cash on Delivery</label><br>
        <button onclick="processPayment()">Proceed to Payment</button>
    `;
    document.querySelector('.modal-content').appendChild(paymentOptions);
    document.getElementById('buy-now-button').style.display = 'none'; // Hide the Buy Now button
}

// Function to process selected payment method
function processPayment() {
    const selectedMethod = document.querySelector('input[name="payment-method"]:checked');
    if (selectedMethod) {
        const paymentMethod = selectedMethod.value;
        switch (paymentMethod) {
            case 'credit-card':
                alert('Redirecting to Credit Card Payment Gateway...');
                break;
            case 'upi':
                alert('Redirecting to UPI Payment...');
                break;
            case 'cash-on-delivery':
                alert('Cash on Delivery selected. Your order will be delivered soon!');
                break;
            default:
                alert('Please select a payment method.');
                return;
        }
        toggleCart(); // Close the cart modal after processing payment
    } else {
        alert('Please select a payment method.');
    }
}
