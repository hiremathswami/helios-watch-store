
/*=============== SHOW MENU ===============*/
const navMenu = document.getElementById('nav-menu'),
      navToggle = document.getElementById('nav-toggle'),
      navClose = document.getElementById('nav-close')

/* Menu show */
if(navToggle){
    navToggle.addEventListener('click', () =>{
        navMenu.classList.add('show-menu')
    })
}

/* Menu hidden */
if(navClose){
    navClose.addEventListener('click', () =>{
        navMenu.classList.remove('show-menu')
    })
}

/*=============== REMOVE MENU MOBILE ===============*/
const navLink = document.querySelectorAll('.nav__link')

const linkAction = () =>{
    const navMenu = document.getElementById('nav-menu')
    // When we click on each nav__link, we remove the show-menu class
    navMenu.classList.remove('show-menu')
}
navLink.forEach(n => n.addEventListener('click', linkAction))

/*=============== CHANGE BACKGROUND HEADER ===============*/
const scrollHeader = () =>{
    const header = document.getElementById('header')
    // Add a class if the bottom offset is greater than 50 of the viewport
    this.scrollY >= 50 ? header.classList.add('scroll-header') 
                       : header.classList.remove('scroll-header')
}
window.addEventListener('scroll', scrollHeader)

/*=============== TESTIMONIAL SWIPER ===============*/
let testimonialSwiper = new Swiper(".testimonial-swiper", {
    spaceBetween: 30,
    loop: 'true',

    navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
    },
});

/*=============== NEW SWIPER ===============*/
let newSwiper = new Swiper(".new-swiper", {
    spaceBetween: 24,
    loop: 'true',

    breakpoints: {
        576: {
          slidesPerView: 2,
        },
        768: {
          slidesPerView: 3,
        },
        1024: {
          slidesPerView: 4,
        },
    },
});

/*=============== SCROLL SECTIONS ACTIVE LINK ===============*/
const sections = document.querySelectorAll('section[id]')
    
const scrollActive = () =>{
  	const scrollDown = window.scrollY

	sections.forEach(current =>{
		const sectionHeight = current.offsetHeight,
			  sectionTop = current.offsetTop - 58,
			  sectionId = current.getAttribute('id'),
			  sectionsClass = document.querySelector('.nav__menu a[href*=' + sectionId + ']')

		if(scrollDown > sectionTop && scrollDown <= sectionTop + sectionHeight){
			sectionsClass.classList.add('active-link')
		}else{
			sectionsClass.classList.remove('active-link')
		}                                                    
	})
}
window.addEventListener('scroll', scrollActive)

/*=============== SHOW SCROLL UP ===============*/ 
const scrollUp = () =>{
	const scrollUp = document.getElementById('scroll-up')
    // When the scroll is higher than 350 viewport height, add the show-scroll class to the a tag with the scrollup class
	this.scrollY >= 350 ? scrollUp.classList.add('show-scroll')
						: scrollUp.classList.remove('show-scroll')
}
window.addEventListener('scroll', scrollUp)

/*=============== SHOW CART ===============*/
const cart = document.getElementById('cart'),
      cartShop = document.getElementById('cart-shop'),
      cartClose = document.getElementById('cart-close')

/*===== CART SHOW =====*/
/* Validate if constant exists */
if(cartShop){
    cartShop.addEventListener('click', () =>{
        cart.classList.add('show-cart')
    })
}

/*===== CART HIDDEN =====*/
/* Validate if constant exists */
if(cartClose){
    cartClose.addEventListener('click', () =>{
        cart.classList.remove('show-cart')
    })
}

/*=============== DARK LIGHT THEME ===============*/ 
const themeButton = document.getElementById('theme-button')
const darkTheme = 'dark-theme'
const iconTheme = 'bx-sun'

// Previously selected topic (if user selected)
const selectedTheme = localStorage.getItem('selected-theme')
const selectedIcon = localStorage.getItem('selected-icon')

// We obtain the current theme that the interface has by validating the dark-theme class
const getCurrentTheme = () => document.body.classList.contains(darkTheme) ? 'dark' : 'light'
const getCurrentIcon = () => themeButton.classList.contains(iconTheme) ? 'bx bx-moon' : 'bx bx-sun'

// We validate if the user previously chose a topic
if (selectedTheme) {
  // If the validation is fulfilled, we ask what the issue was to know if we activated or deactivated the dark
  document.body.classList[selectedTheme === 'dark' ? 'add' : 'remove'](darkTheme)
  themeButton.classList[selectedIcon === 'bx bx-moon' ? 'add' : 'remove'](iconTheme)
}

// Activate / deactivate the theme manually with the button
themeButton.addEventListener('click', () => {
    // Add or remove the dark / icon theme
    document.body.classList.toggle(darkTheme)
    themeButton.classList.toggle(iconTheme)
    // We save the theme and the current icon that the user chose
    localStorage.setItem('selected-theme', getCurrentTheme())
    localStorage.setItem('selected-icon', getCurrentIcon())
})

/*=============== DYNAMIC CATALOG & DETAIL VIEW ===============*/
(async () => {
    const catalogGrid = document.getElementById('catalog-grid')
    const detailSection = document.getElementById('product-detail')
    const productsSection = document.getElementById('products')

    if (!catalogGrid || !detailSection || !productsSection) return

    let products = []
    try {
        const res = await fetch('products.json', { cache: 'no-store' })
        products = await res.json()
    } catch (e) {
        console.error('Failed to load products.json', e)
        return
    }

    const formatINR = (value) => {
        try {
            return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value)
        } catch (_) {
            return `₹${value}`
        }
    }

    const renderCatalog = () => {
        catalogGrid.innerHTML = ''
        products.forEach((p) => {
            const col = document.createElement('div')
            col.className = 'col-12 col-sm-6 col-lg-4'
            col.innerHTML = `
                <div class="products__card h-100 d-flex flex-column">
                    <img src="${p.images?.[0] || ''}" alt="${p.name}" class="products__img">
                    <div class="p-3 flex-grow-1 d-flex flex-column">
                        <div class="mb-1 text-muted" style="text-transform:uppercase; font-size:.85rem;">${p.brand || ''}</div>
                        <h3 class="products__title mb-1">${p.model || p.name}</h3>
                        <span class="products__price mb-3">${formatINR(p.price)}</span>
                        <div class="mt-auto">
                            <a class="button w-100 text-center" href="#product/${encodeURIComponent(p.id)}">View Details</a>
                        </div>
                    </div>
                </div>
            `
            catalogGrid.appendChild(col)
        })
    }

    const qs = (id) => document.getElementById(id)

    const renderDetail = (productId) => {
        const product = products.find(p => p.id === productId)
        if (!product) {
            window.location.hash = '#products'
            return
        }
        // Fill basic info
        qs('detail-title').textContent = `${product.brand || ''} ${product.model || product.name}`.trim()
        qs('detail-brand').textContent = product.brand ? `${product.brand}` : ''
        qs('detail-sku').textContent = product.sku ? `SKU: ${product.sku}` : ''
        qs('detail-price').textContent = formatINR(product.price)
        qs('detail-availability').textContent = product.availability || 'Available'
        qs('detail-description').textContent = product.description || ''

        // Features
        const featuresEl = qs('detail-features')
        featuresEl.innerHTML = ''
        ;(product.features || []).forEach(f => {
            const li = document.createElement('li')
            li.textContent = f
            featuresEl.appendChild(li)
        })

        // Specs
        const specsEl = qs('detail-specs')
        specsEl.innerHTML = ''
        const specs = product.specs || {}
        Object.keys(specs).forEach(k => {
            const row = document.createElement('div')
            row.className = 'd-flex justify-content-between border-bottom py-2'
            row.innerHTML = `<span class="text-muted">${k}</span><span class="ms-3">${specs[k]}</span>`
            specsEl.appendChild(row)
        })

        // Images
        const mainImg = qs('detail-main-img')
        const images = product.images && product.images.length ? product.images : ['assets/img/product1.png']
        mainImg.src = images[0]
        const thumbs = qs('detail-thumbs')
        thumbs.innerHTML = ''
        images.forEach((src, idx) => {
            const btn = document.createElement('button')
            btn.type = 'button'
            btn.className = 'p-0 border-0 bg-transparent'
            btn.innerHTML = `<img src="${src}" alt="thumb-${idx}" style="width:72px; height:72px; object-fit:contain; border:1px solid var(--border-color); background:#fff;">`
            btn.addEventListener('click', () => { mainImg.src = src })
            thumbs.appendChild(btn)
        })

        productsSection.style.display = 'none'
        detailSection.style.display = ''
    }

    const navigate = () => {
        const hash = window.location.hash || '#products'
        const match = hash.match(/^#product\/(.+)$/)
        if (match) {
            const productId = decodeURIComponent(match[1])
            renderDetail(productId)
        } else {
            detailSection.style.display = 'none'
            productsSection.style.display = ''
            renderCatalog()
            // Scroll to products when navigating back
            const productsAnchor = document.querySelector('a.nav__link[href="#products"]')
            if (productsAnchor) {
                // no-op; rely on hash default behavior
            }
        }
    }

    // Wire buttons
    const addCartBtn = document.getElementById('btn-add-cart')
    if (addCartBtn) addCartBtn.addEventListener('click', () => alert('Added to cart'))
    const wishlistBtn = document.getElementById('btn-wishlist')
    if (wishlistBtn) wishlistBtn.addEventListener('click', () => alert('Added to wishlist'))

    window.addEventListener('hashchange', navigate)
    navigate()
})()