'use strict';

// DOM Elements
const paymentProducts = document.getElementById('paymentProducts');
const paymentTotal = document.getElementById('paymentTotal');
const paymentAmount = document.getElementById('paymentAmount');
const paymentForm = document.getElementById('paymentForm');
const submitPayment = document.getElementById('submitPayment');
const paymentModal = document.getElementById('paymentModal');
const downloadBtn = document.getElementById('downloadBtn');
const backToStore = document.getElementById('backToStore');
const methodTabs = document.querySelectorAll('.method-tab');
const methodContents = document.querySelectorAll('.method-content');
const copyUpiId = document.getElementById('copyUpiId');
const upiId = document.getElementById('upiId');
const applyCoupon = document.getElementById('applyCoupon');
const couponCode = document.getElementById('couponCode');
const orderIdNumber = document.getElementById('orderIdNumber');
const orderDateValue = document.getElementById('orderDateValue');
const orderAmountValue = document.getElementById('orderAmountValue');
const faqQuestions = document.querySelectorAll('.faq-question');

// Initialize cart from URL parameters
let cart = [];
let totalAmount = 0;

// Parse URL parameters
const urlParams = new URLSearchParams(window.location.search);
const cartParam = urlParams.get('cart');
const productParam = urlParams.get('product');

// Load cart or single product
if (cartParam) {
  cart = JSON.parse(decodeURIComponent(cartParam));
} else if (productParam) {
  const product = JSON.parse(decodeURIComponent(productParam));
  cart = [product];
}

// Calculate total
function calculateTotal() {
  totalAmount = cart.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
  paymentTotal.textContent = `₹${totalAmount.toFixed(2)}`;
  paymentAmount.textContent = `₹${totalAmount.toFixed(2)}`;
}

// Render cart items
function renderCartItems() {
  paymentProducts.innerHTML = '';
  
  if (cart.length === 0) {
    paymentProducts.innerHTML = '<p>No items in cart</p>';
    return;
  }
  
  cart.forEach(item => {
    const productElement = document.createElement('div');
    productElement.className = 'payment-product';
    productElement.innerHTML = `
      <img src="${item.image}" alt="${item.title}">
      <div class="payment-product-info">
        <h3>${item.title}</h3>
        <p>₹${item.price.toFixed(2)}</p>
      </div>
    `;
    paymentProducts.appendChild(productElement);
  });
  
  calculateTotal();
}

// Initialize payment page
function initPaymentPage() {
  renderCartItems();
  
  // Set current date for order
  const now = new Date();
  orderDateValue.textContent = now.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
  
  // Generate random order ID
  orderIdNumber.textContent = Math.floor(100000 + Math.random() * 900000);
}

// Payment method tabs
methodTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    const method = tab.dataset.method;
    
    // Update active tab
    methodTabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    
    // Show corresponding content
    methodContents.forEach(content => {
      content.classList.remove('active');
      if (content.dataset.method === method) {
        content.classList.add('active');
      }
    });
  });
});

// Copy UPI ID
copyUpiId.addEventListener('click', () => {
  navigator.clipboard.writeText(upiId.textContent).then(() => {
    const originalText = copyUpiId.innerHTML;
    copyUpiId.innerHTML = '<ion-icon name="checkmark-outline"></ion-icon> Copied';
    
    setTimeout(() => {
      copyUpiId.innerHTML = originalText;
    }, 2000);
  });
});

// Apply coupon code
applyCoupon.addEventListener('click', () => {
  const code = couponCode.value.trim();
  
  if (!code) return;
  
  // Simple coupon logic - in a real app, this would be validated server-side
  if (code.toUpperCase() === 'STOIC10') {
    totalAmount = totalAmount * 0.9; // 10% discount
    paymentTotal.textContent = `₹${totalAmount.toFixed(2)}`;
    paymentAmount.textContent = `₹${totalAmount.toFixed(2)}`;
    
    // Show discount applied message
    const discountMsg = document.createElement('div');
    discountMsg.textContent = '10% discount applied!';
    discountMsg.style.color = 'var(--accent)';
    discountMsg.style.marginTop = '10px';
    discountMsg.style.fontSize = 'var(--fs-8)';
    
    const couponGroup = applyCoupon.parentElement;
    if (!couponGroup.querySelector('.discount-msg')) {
      couponGroup.appendChild(discountMsg);
      discountMsg.className = 'discount-msg';
    }
  } else {
    alert('Invalid coupon code');
  }
});

// Form submission
paymentForm.addEventListener('submit', (e) => {
  e.preventDefault();
  
  // Validate form
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const phone = document.getElementById('phone').value;
  const deliveryEmail = document.getElementById('deliveryEmail').value;
  
  if (!name || !email || !phone || !deliveryEmail) {
    alert('Please fill all required fields');
    return;
  }
  
  // Show loading state
  submitPayment.disabled = true;
  submitPayment.innerHTML = '<span id="paymentBtnText">Processing...</span>';
  
  // Simulate payment processing
  setTimeout(() => {
    // In a real app, this would be an actual payment processing
    processPayment();
  }, 1500);
});

// Process payment
function processPayment() {
  // Show success modal
  paymentModal.style.display = 'flex';
  document.body.style.overflow = 'hidden';
  
  // Set order details
  orderAmountValue.textContent = `₹${totalAmount.toFixed(2)}`;
  
  // Reset form
  submitPayment.disabled = false;
  submitPayment.innerHTML = '<span id="paymentBtnText">Pay Now</span> <span id="paymentAmount">₹0.00</span>';
}

// Download product
downloadBtn.addEventListener('click', () => {
  // In a real app, this would download the actual product
  // For demo, we'll just show an alert
  alert('Your download will start now. Check your email for the download link.');
  
  // If there's a PDF, download it
  cart.forEach(item => {
    if (item.pdf) {
      const link = document.createElement('a');
      link.href = item.pdf;
      link.download = item.pdf.split('/').pop();
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  });
});

// Back to store
backToStore.addEventListener('click', () => {
  window.location.href = 'store.html';
});

// FAQ toggle
faqQuestions.forEach(question => {
  question.addEventListener('click', () => {
    question.classList.toggle('active');
  });
});

// Initialize page
document.addEventListener('DOMContentLoaded', initPaymentPage);