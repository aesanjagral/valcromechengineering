// Animation and Drag & Drop functionality

document.addEventListener('DOMContentLoaded', function() {
    
    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animateElements = document.querySelectorAll('.feature-card, .product-card, .industry-card');
    animateElements.forEach(el => {
        el.classList.add('animate-on-scroll');
        observer.observe(el);
    });

    // Counter animation for stats
    function animateCounters() {
        const counters = document.querySelectorAll('.stat h3');
        
        counters.forEach(counter => {
            const finalNumber = parseInt(counter.textContent.replace(/\D/g, ''));
            const duration = 2000;
            const increment = finalNumber / (duration / 16);
            let current = 0;
            
            const updateCounter = () => {
                current += increment;
                if (current >= finalNumber) {
                    counter.textContent = counter.textContent.replace(/\d+/, finalNumber);
                } else {
                    counter.textContent = counter.textContent.replace(/\d+/, Math.floor(current));
                    requestAnimationFrame(updateCounter);
                }
            };
            
            updateCounter();
        });
    }

    // Trigger counter animation when stats section is visible
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounters();
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    const statsSection = document.querySelector('.hero-stats');
    if (statsSection) {
        statsObserver.observe(statsSection);
    }

    // Parallax effect for hero section
    function handleParallax() {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.hero::before');
        
        parallaxElements.forEach(element => {
            const speed = 0.5;
            element.style.transform = `translateY(${scrolled * speed}px)`;
        });
    }

    window.addEventListener('scroll', handleParallax);

    // Image hover effects
    const productImages = document.querySelectorAll('.product-image img');
    productImages.forEach(img => {
        img.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.05)';
        });
        
        img.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    });

    // Drag and Drop functionality for images folder
    setupImageDragAndDrop();

    function setupImageDragAndDrop() {
        // Create drag and drop area in the images folder
        createImageUploadArea();
        
        // Prevent default drag behaviors on the entire page
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            document.addEventListener(eventName, preventDefaults, false);
        });

        function preventDefaults(e) {
            e.preventDefault();
            e.stopPropagation();
        }

        // Highlight drop area when item is dragged over it
        ['dragenter', 'dragover'].forEach(eventName => {
            document.addEventListener(eventName, highlight, false);
        });

        ['dragleave', 'drop'].forEach(eventName => {
            document.addEventListener(eventName, unhighlight, false);
        });

        function highlight(e) {
            const dropArea = document.querySelector('.image-drop-area');
            if (dropArea && (dropArea.contains(e.target) || e.target === dropArea)) {
                dropArea.classList.add('drag-highlight');
            }
        }

        function unhighlight(e) {
            const dropArea = document.querySelector('.image-drop-area');
            if (dropArea) {
                dropArea.classList.remove('drag-highlight');
            }
        }

        // Handle dropped files
        document.addEventListener('drop', handleDrop, false);

        function handleDrop(e) {
            const dropArea = document.querySelector('.image-drop-area');
            if (!dropArea || (!dropArea.contains(e.target) && e.target !== dropArea)) {
                return;
            }

            const dt = e.dataTransfer;
            const files = dt.files;

            handleFiles(files);
        }

        function handleFiles(files) {
            [...files].forEach(handleFile);
        }

        function handleFile(file) {
            if (!file.type.startsWith('image/')) {
                showNotification('Please upload only image files', 'error');
                return;
            }

            const maxSize = 5 * 1024 * 1024; // 5MB
            if (file.size > maxSize) {
                showNotification('Image size should be less than 5MB', 'error');
                return;
            }

            // Create preview
            const reader = new FileReader();
            reader.onload = function(e) {
                createImagePreview(file, e.target.result);
            };
            reader.readAsDataURL(file);

            // Simulate upload (in real implementation, you'd send to server)
            simulateUpload(file);
        }

        function createImagePreview(file, src) {
            const previewContainer = document.querySelector('.image-previews');
            
            const previewElement = document.createElement('div');
            previewElement.className = 'image-preview';
            previewElement.innerHTML = `
                <img src="${src}" alt="${file.name}">
                <div class="image-info">
                    <h4>${file.name}</h4>
                    <p>${formatFileSize(file.size)}</p>
                    <div class="image-actions">
                        <button class="btn-copy" onclick="copyImagePath('${file.name}')">
                            <i class="fas fa-copy"></i> Copy Path
                        </button>
                        <button class="btn-delete" onclick="deleteImage(this)">
                            <i class="fas fa-trash"></i> Delete
                        </button>
                    </div>
                    <div class="upload-progress">
                        <div class="progress-bar"></div>
                    </div>
                </div>
            `;

            previewContainer.appendChild(previewElement);

            // Animate in
            setTimeout(() => {
                previewElement.classList.add('loaded');
            }, 100);
        }

        function simulateUpload(file) {
            const progressBar = document.querySelector('.image-preview:last-child .progress-bar');
            let progress = 0;
            
            const interval = setInterval(() => {
                progress += Math.random() * 10;
                progressBar.style.width = Math.min(progress, 100) + '%';
                
                if (progress >= 100) {
                    clearInterval(interval);
                    setTimeout(() => {
                        progressBar.parentElement.style.opacity = '0';
                        showNotification(`${file.name} uploaded successfully!`, 'success');
                    }, 500);
                }
            }, 100);
        }

        function formatFileSize(bytes) {
            if (bytes === 0) return '0 Bytes';
            const k = 1024;
            const sizes = ['Bytes', 'KB', 'MB', 'GB'];
            const i = Math.floor(Math.log(bytes) / Math.log(k));
            return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
        }
    }

    function createImageUploadArea() {
        // Check if we're on a page that should have the image upload area
        const shouldShowUpload = window.location.pathname.includes('admin') || 
                                window.location.search.includes('manage=images') ||
                                document.querySelector('.admin-panel');

        if (!shouldShowUpload) {
            // Create WhatsApp floating button for customer support
            createWhatsAppButton();
            return;
        }

        const imageSection = document.createElement('section');
        imageSection.className = 'image-management';
        imageSection.innerHTML = `
            <div class="container">
                <div class="section-header">
                    <h2>Image Management</h2>
                    <p>Drag and drop images here to upload them to your website</p>
                </div>
                
                <div class="image-drop-area">
                    <div class="drop-content">
                        <i class="fas fa-cloud-upload-alt"></i>
                        <h3>Drag & Drop Images Here</h3>
                        <p>or <button class="btn-browse">Browse Files</button></p>
                        <small>Supports: JPG, PNG, GIF, WebP (Max 5MB each)</small>
                    </div>
                    <input type="file" class="file-input" multiple accept="image/*" style="display: none;">
                </div>
                
                <div class="image-previews"></div>
                
                <div class="image-usage-guide">
                    <h3>How to Use Images</h3>
                    <div class="usage-examples">
                        <div class="usage-item">
                            <h4>In HTML:</h4>
                            <code>&lt;img src="images/your-image.jpg" alt="Description"&gt;</code>
                        </div>
                        <div class="usage-item">
                            <h4>In CSS:</h4>
                            <code>background-image: url('images/your-image.jpg');</code>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Insert after header or at the beginning of main content
        const main = document.querySelector('main') || document.body;
        const firstSection = main.querySelector('section');
        if (firstSection) {
            main.insertBefore(imageSection, firstSection);
        } else {
            main.appendChild(imageSection);
        }

        // Setup browse button
        const browseBtn = document.querySelector('.btn-browse');
        const fileInput = document.querySelector('.file-input');
        
        browseBtn.addEventListener('click', () => {
            fileInput.click();
        });
        
        fileInput.addEventListener('change', (e) => {
            handleFiles(e.target.files);
        });
    }

    function createWhatsAppButton() {
        const whatsappBtn = document.createElement('a');
        whatsappBtn.className = 'whatsapp-float';
        whatsappBtn.innerHTML = '<i class="fab fa-whatsapp"></i>';
        whatsappBtn.setAttribute('title', 'Chat on WhatsApp');
        whatsappBtn.href = 'https://wa.me/918828574405?text=Hello! I am interested in your mechanical seals and pumps. Please share more details.';
        whatsappBtn.target = '_blank';
        whatsappBtn.rel = 'noopener noreferrer';
        
        document.body.appendChild(whatsappBtn);
    }

    // Global functions for image management
    window.copyImagePath = function(filename) {
        const path = `images/${filename}`;
        navigator.clipboard.writeText(path).then(() => {
            showNotification('Image path copied to clipboard!', 'success');
        });
    };

    window.deleteImage = function(button) {
        const preview = button.closest('.image-preview');
        preview.style.opacity = '0';
        preview.style.transform = 'scale(0.8)';
        
        setTimeout(() => {
            preview.remove();
            showNotification('Image deleted', 'info');
        }, 300);
    };

    // Notification function (simplified version)
    function showNotification(message, type) {
        if (window.VELCROMECH && window.VELCROMECH.showNotification) {
            window.VELCROMECH.showNotification(message, type);
        } else {
            alert(message); // Fallback
        }
    }

    // Add keyboard shortcuts for image management
    document.addEventListener('keydown', (e) => {
        // Ctrl+U for upload
        if (e.ctrlKey && e.key === 'u') {
            e.preventDefault();
            const fileInput = document.querySelector('.file-input');
            if (fileInput) {
                fileInput.click();
            }
        }
        
        // Escape to close modals
        if (e.key === 'Escape') {
            const modals = document.querySelectorAll('.modal.active');
            modals.forEach(modal => {
                modal.classList.remove('active');
            });
        }
    });

    // Smooth reveal animations for cards
    function addRevealAnimations() {
        const cards = document.querySelectorAll('.feature-card, .product-card, .industry-card');
        
        cards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            card.style.transitionDelay = `${index * 0.1}s`;
            
            const cardObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                        cardObserver.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.1 });
            
            cardObserver.observe(card);
        });
    }

    addRevealAnimations();

    // Performance optimization: Use passive listeners for scroll events
    let ticking = false;
    
    function updateScrollEffects() {
        handleParallax();
        ticking = false;
    }
    
    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateScrollEffects);
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', requestTick, { passive: true });
}); 