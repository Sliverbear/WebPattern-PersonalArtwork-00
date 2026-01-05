// Mobile Menu Toggle
document.addEventListener('DOMContentLoaded', () => {
    const mobileMenuButton = document.querySelector('.mobile-menu-button');
    const mobileMenu = document.querySelector('.mobile-menu');

    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
    }

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!mobileMenu.contains(e.target) && !mobileMenuButton.contains(e.target)) {
            mobileMenu.classList.add('hidden');
        }
    });
});

// Image Gallery
class ImageGallery {
    constructor() {
        this.currentIndex = 0;
        this.images = [];
        this.modal = null;
        this.modalContent = null;
        this.modalTitle = null;
        this.modalDesc = null;
        this.closeButton = null;
        this.init();
    }

    init() {
        // Create modal structure
        this.createModal();
        
        // Load featured works
        this.loadFeaturedWorks();
        
        // Add keyboard navigation
        this.addKeyboardNavigation();
    }

    createModal() {
        this.modal = document.createElement('div');
        this.modal.className = 'gallery-modal hidden fixed inset-0 z-50 overflow-auto';
        this.modal.innerHTML = `
            <div class="fixed inset-0 bg-black bg-opacity-75 transition-opacity"></div>
            <div class="fixed inset-0 z-10 flex items-center justify-center p-4">
                <div class="relative bg-gray-900 rounded-lg shadow-xl max-w-5xl w-full mx-auto">
                    <!-- Close button -->
                    <button class="gallery-modal-close absolute -top-4 -right-4 bg-gray-800 text-white w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-600 z-20">
                        <span class="sr-only">Close</span>
                        <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>

                    <!-- Image container -->
                    <div class="relative">
                        <div class="flex items-center justify-center min-h-[200px] max-h-[80vh]">
                            <img src="" alt="Gallery Image" class="max-w-full max-h-[70vh] object-contain">
                        </div>
                        
                        <!-- Image info -->
                        <div class="p-4 bg-gray-900">
                            <h3 class="modal-title text-xl font-semibold text-white mb-2"></h3>
                            <p class="modal-desc text-gray-300"></p>
                        </div>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(this.modal);

        // Get modal elements
        this.modalContent = this.modal.querySelector('img');
        this.modalTitle = this.modal.querySelector('.modal-title');
        this.modalDesc = this.modal.querySelector('.modal-desc');
        this.closeButton = this.modal.querySelector('.gallery-modal-close');

        // Add event listeners
        this.closeButton.addEventListener('click', () => this.closeModal());
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) this.closeModal();
        });

        console.log('Modal created with elements:', {
            modalContent: !!this.modalContent,
            modalTitle: !!this.modalTitle,
            modalDesc: !!this.modalDesc,
            closeButton: !!this.closeButton
        });
    }

    loadFeaturedWorks() {
        console.log('Loading featured works...');
        // Sample featured works data - can be replaced with dynamic data from a backend
        this.images = [
            {
                id: 1,
                title: 'Abstract Harmony',
                image: 'images/artwork1.jpg',
                description: 'A contemporary piece exploring color and form',
                category: 'digital'
            },
            {
                id: 2,
                title: 'Urban Landscape',
                image: 'images/artwork2.jpg',
                description: 'Cityscape interpretation in mixed media',
                category: 'mixed'
            },
            {
                id: 3,
                title: 'Natural Elements',
                image: 'images/artwork3.jpg',
                description: 'Organic forms in digital art',
                category: 'digital'
            },
            {
                id: 4,
                title: 'Digital Dreams',
                image: 'images/artwork4.jpg',
                description: 'Digital art exploration',
                category: 'digital'
            },
            {
                id: 5,
                title: 'Modern Expression',
                image: 'images/artwork5.jpg',
                description: 'Contemporary abstract expression',
                category: 'traditional'
            }
            // Add more artwork entries as needed
        ];

        console.log('Images array loaded:', this.images);

        // Initialize filtering
        this.initializeFiltering();

        // Render all works initially
        this.renderArtworks('all');
    }

    initializeFiltering() {
        console.log('Initializing filtering...');
        const filterButtons = document.querySelectorAll('.filter-btn');
        console.log('Found filter buttons:', filterButtons.length);
        
        filterButtons.forEach(button => {
            console.log('Setting up filter button:', button.dataset.filter);
            button.addEventListener('click', () => {
                console.log('Filter button clicked:', button.dataset.filter);
                // Remove active class from all buttons
                filterButtons.forEach(btn => btn.classList.remove('active', 'bg-blue-600'));
                // Add active class to clicked button
                button.classList.add('active', 'bg-blue-600');
                // Filter artworks
                this.renderArtworks(button.dataset.filter);
            });
        });
    }

    renderArtworks(filter) {
        console.log('Rendering artworks with filter:', filter);
        const portfolioGrid = document.getElementById('portfolio-grid');
        if (!portfolioGrid) {
            console.error('Portfolio grid element not found!');
            return;
        }

        // Clear existing content
        portfolioGrid.innerHTML = '';

        // Filter and render artworks
        const filteredImages = filter === 'all' 
            ? this.images 
            : this.images.filter(img => img.category === filter);

        console.log('Filtered images:', filteredImages);

        // Show message if no artworks in category
        if (filteredImages.length === 0) {
            console.log('No artworks found for category:', filter);
            portfolioGrid.innerHTML = `
                <div class="col-span-full text-center text-gray-400 py-8">
                    No artworks found in this category.
                </div>
            `;
            return;
        }

        // Render filtered artworks
        filteredImages.forEach((work, index) => {
            const card = this.createArtCard(work, this.images.indexOf(work));
            portfolioGrid.appendChild(card);
        });
        console.log('Finished rendering artworks');
    }

    createArtCard(work, index) {
        const card = document.createElement('div');
        card.className = 'art-card animate-fade-in';
        
        // Create image element first to add error handling
        const img = document.createElement('img');
        img.src = work.image;
        img.alt = work.title;
        img.className = 'cursor-pointer w-full h-64 object-cover';
        
        // Add error handling
        img.onerror = () => {
            console.error('Failed to load image:', work.image);
            img.src = 'images/placeholder.jpg';
            img.onerror = null;
        };
        
        // Add load event to verify successful loading
        img.onload = () => {
            console.log('Successfully loaded image:', work.image);
        };
        
        const content = document.createElement('div');
        content.className = 'art-card-content';
        content.innerHTML = `
            <h3 class="art-card-title">${work.title}</h3>
            <p class="art-card-description">${work.description}</p>
            <span class="text-sm text-gray-400 mt-2 capitalize">${work.category}</span>
        `;
        
        card.appendChild(img);
        card.appendChild(content);

        // Add click event to open modal
        img.addEventListener('click', () => {
            if (img.src.includes('placeholder.jpg')) {
                console.warn('Original image failed to load:', work.image);
            }
            this.openModal(index);
        });

        return card;
    }

    openModal(index) {
        this.currentIndex = index;
        this.updateModalImage();
        this.modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }

    updateModalImage() {
        console.log('Updating modal image. Current index:', this.currentIndex);
        const currentImage = this.images[this.currentIndex];
        
        if (!currentImage) {
            console.error('No image found at index:', this.currentIndex);
            return;
        }

        console.log('Loading image:', currentImage.image);
        
        // Show loading state
        this.modalContent.style.opacity = '0.3';
        this.modalContent.src = '';
        this.modalTitle.textContent = 'Loading...';
        this.modalDesc.textContent = '';
        
        // Create a temporary image to verify loading
        const tempImage = new Image();
        tempImage.onload = () => {
            console.log('Image loaded successfully:', currentImage.image);
            
            // Update image with a fade-in effect
            this.modalContent.src = currentImage.image;
            this.modalContent.alt = currentImage.title;
            this.modalContent.style.opacity = '1';
            this.modalContent.style.transition = 'opacity 0.3s ease-in-out';
            
            // Update title and description
            this.modalTitle.textContent = currentImage.title;
            this.modalDesc.textContent = currentImage.description;
        };
        
        tempImage.onerror = () => {
            console.error('Failed to load image:', currentImage.image);
            this.modalContent.src = 'images/placeholder.jpg';
            this.modalContent.alt = 'Image failed to load';
            this.modalContent.style.opacity = '1';
            this.modalTitle.textContent = 'Error Loading Image';
            this.modalDesc.textContent = 'The image could not be loaded. Please try again later.';
        };
        
        // Start loading the image
        tempImage.src = currentImage.image;
    }

    closeModal() {
        this.modal.classList.add('hidden');
        document.body.style.overflow = '';
    }

    addKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            if (!this.modal.classList.contains('hidden')) {
                if (e.key === 'Escape') this.closeModal();
            }
        });
    }
}

// Lazy Loading for Images
class LazyLoader {
    constructor() {
        this.images = document.querySelectorAll('img[data-src]');
        this.imageObserver = new IntersectionObserver(this.handleIntersection.bind(this));
        this.init();
    }

    init() {
        this.images.forEach(img => this.imageObserver.observe(img));
    }

    handleIntersection(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                this.imageObserver.unobserve(img);
            }
        });
    }
}

// Debounce function for form validation
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Enhanced Form Validation with Debouncing
class FormValidator {
    constructor(formId) {
        this.form = document.getElementById(formId);
        if (this.form) {
            this.init();
        }
    }

    init() {
        // Debounce the validation
        const debouncedValidate = debounce(this.validateForm.bind(this), 300);
        
        // Add input event listeners for real-time validation
        this.form.querySelectorAll('input, textarea').forEach(input => {
            input.addEventListener('input', debouncedValidate);
        });

        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            if (this.validateForm()) {
                this.submitForm();
            }
        });
    }

    validateForm() {
        let isValid = true;
        const email = this.form.querySelector('input[type="email"]');
        const message = this.form.querySelector('textarea');

        // Email validation
        if (email && !this.isValidEmail(email.value)) {
            this.showError(email, 'Please enter a valid email address');
            isValid = false;
        } else {
            this.removeError(email);
        }

        // Message validation
        if (message && message.value.trim().length < 10) {
            this.showError(message, 'Message must be at least 10 characters long');
            isValid = false;
        } else {
            this.removeError(message);
        }

        return isValid;
    }

    isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    showError(element, message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'form-error';
        errorDiv.textContent = message;
        element.parentNode.appendChild(errorDiv);
        element.classList.add('border-red-500');
    }

    removeError(element) {
        const errorDiv = element.parentNode.querySelector('.form-error');
        if (errorDiv) {
            errorDiv.remove();
        }
        element.classList.remove('border-red-500');
    }

    submitForm() {
        // Here you would typically send the form data to a server
        const formData = new FormData(this.form);
        console.log('Form submitted:', Object.fromEntries(formData));
        
        // Show success message
        const successMessage = document.createElement('div');
        successMessage.className = 'text-green-500 mt-4';
        successMessage.textContent = 'Thank you for your message! We will get back to you soon.';
        this.form.appendChild(successMessage);
        
        // Reset form
        this.form.reset();
        
        // Remove success message after 5 seconds
        setTimeout(() => {
            successMessage.remove();
        }, 5000);
    }
}

// Accessibility Improvements
class AccessibilityEnhancer {
    constructor() {
        this.init();
    }

    init() {
        this.addSkipToMainContent();
        this.addAriaLabels();
        this.enhanceKeyboardNavigation();
    }

    addSkipToMainContent() {
        const skipLink = document.createElement('a');
        skipLink.href = '#main-content';
        skipLink.className = 'sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 focus:bg-white focus:text-black focus:p-4 focus:z-50';
        skipLink.textContent = 'Skip to main content';
        document.body.insertBefore(skipLink, document.body.firstChild);
    }

    addAriaLabels() {
        // Add ARIA labels to navigation
        const nav = document.querySelector('nav');
        if (nav) {
            nav.setAttribute('aria-label', 'Main navigation');
        }

        // Add ARIA labels to forms
        document.querySelectorAll('form').forEach(form => {
            if (!form.getAttribute('aria-label')) {
                form.setAttribute('aria-label', 'Contact form');
            }
        });

        // Add ARIA labels to buttons
        document.querySelectorAll('button').forEach(button => {
            if (!button.getAttribute('aria-label')) {
                button.setAttribute('aria-label', button.textContent.trim());
            }
        });
    }

    enhanceKeyboardNavigation() {
        // Add focus styles to interactive elements
        document.querySelectorAll('a, button, input, textarea').forEach(element => {
            element.addEventListener('focus', () => {
                element.classList.add('ring-2', 'ring-blue-500', 'outline-none');
            });
            element.addEventListener('blur', () => {
                element.classList.remove('ring-2', 'ring-blue-500', 'outline-none');
            });
        });
    }
}

// Initialize components
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM Content Loaded');
    console.log('Current path:', window.location.pathname);
    console.log('Document title:', document.title);
    console.log('H1 content:', document.querySelector('h1')?.textContent);
    
    // Initialize image gallery if we're on the portfolio page
    const isPortfolioPage = window.location.pathname.includes('portfolio.html') || 
                           document.title.includes('Portfolio') ||
                           document.querySelector('h1')?.textContent.includes('Portfolio');
    
    console.log('Is portfolio page?', isPortfolioPage);
    
    if (isPortfolioPage) {
        console.log('Portfolio page detected, initializing ImageGallery');
        const portfolioGrid = document.getElementById('portfolio-grid');
        console.log('Portfolio grid element found:', !!portfolioGrid);
        if (portfolioGrid) {
            console.log('Portfolio grid element:', portfolioGrid);
        }
        const gallery = new ImageGallery();
        console.log('Gallery initialized:', !!gallery);
        console.log('Number of images loaded:', gallery.images.length);
    } else {
        console.error('Not on portfolio page');
    }
    
    // Initialize form validation only on contact page
    if (window.location.pathname.includes('contact.html')) {
        new FormValidator('contact-form');
    }
    
    // Initialize lazy loading
    new LazyLoader();
    
    // Initialize accessibility enhancements
    new AccessibilityEnhancer();
}); 