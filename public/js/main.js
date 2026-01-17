// main.js - handles Read More and modal + Add to Cart via fetch
document.addEventListener('DOMContentLoaded', function() {
  // Read more toggle
  document.querySelectorAll('[data-toggle="readmore"]').forEach(btn => {
    btn.addEventListener('click', function(e) {
      const id = this.dataset.target;
      const p = document.getElementById(id);
      if(!p) return;
      p.classList.toggle('line-clamp-3');
      this.textContent = p.classList.contains('line-clamp-3') ? 'Read More' : 'Read Less';
    });
  });

  // Modal open (fills content)
  const modal = document.getElementById('product-modal');
  const modalContent = document.getElementById('product-modal-content');
  function openModal(product) {
    if(!modal) return;
    modalContent.querySelector('.pm-title').textContent = product.name;
    modalContent.querySelector('.pm-image').src = product.image || '/images/default.png';
    modalContent.querySelector('.pm-desc').textContent = product.description || '';
    modalContent.querySelector('.pm-price').textContent = (product.price!==undefined) ? ('₹' + product.price) : '';
    modalContent.querySelector('input[name="productId"]').value = product._id;
    modal.classList.remove('hidden');
    document.body.classList.add('overflow-hidden');
  }
  function closeModal() {
    if(!modal) return;
    modal.classList.add('hidden');
    document.body.classList.remove('overflow-hidden');
  }

  document.querySelectorAll('[data-open-modal]').forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      const raw = this.dataset.product;
      try {
        const product = JSON.parse(raw);
        openModal(product);
      } catch(err) { console.error(err); }
    });
  });

  document.querySelectorAll('[data-close-modal]').forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      closeModal();
    });
  });

  // Close when clicking overlay
  const overlay = document.getElementById('product-modal');
  if(overlay) {
    overlay.addEventListener('click', function(e) {
      if(e.target === overlay) closeModal();
    });
  }

  // Add to cart via AJAX from modal form
  const modalForm = document.getElementById('modal-add-cart-form');
  if(modalForm){
    modalForm.addEventListener('submit', async function(e){
      e.preventDefault();
      const fd = new FormData(modalForm);
      const body = new URLSearchParams();
      for(const pair of fd.entries()) body.append(pair[0], pair[1]);
      try {
        const res = await fetch('/cart/add', { method: 'POST', body: body });
        if(res.redirected){
          window.location = res.url;
        } else {
          window.location = '/cart';
        }
      } catch(err){ console.error(err); window.location = '/cart'; }
    });
  }
});