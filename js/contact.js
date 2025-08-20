// Contact form functionality
document.addEventListener('DOMContentLoaded', function() {
    
    // FAQ Accordion functionality
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            // Close other open FAQ items
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Toggle current item
            item.classList.toggle('active');
        });
    });

    // Contact form functionality
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const data = Object.fromEntries(formData);
            
            // Validate required fields
            const requiredFields = ['firstName', 'lastName', 'email', 'subject', 'message'];
            const privacyCheckbox = document.getElementById('privacy');
            
            let isValid = true;
            let errorMessages = [];
            
            // Check required fields
            requiredFields.forEach(field => {
                const input = document.getElementById(field);
                if (!input.value.trim()) {
                    isValid = false;
                    input.classList.add('error');
                    errorMessages.push(`${getFieldLabel(field)} is required`);
                } else {
                    input.classList.remove('error');
                }
            });
            
            // Check privacy policy agreement
            if (!privacyCheckbox.checked) {
                isValid = false;
                errorMessages.push('Please agree to the Privacy Policy and Terms of Service');
            }
            
            // Email validation
            const email = document.getElementById('email');
            if (email.value && !isValidEmail(email.value)) {
                isValid = false;
                email.classList.add('error');
                errorMessages.push('Please enter a valid email address');
            }
            
            if (!isValid) {
                showNotification(errorMessages.join('<br>'), 'error');
                return;
            }
            
            // Show loading state
            const submitBtn = this.querySelector('.btn-submit');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitBtn.disabled = true;
            
            // Simulate form submission (replace with actual API call)
            setTimeout(() => {
                // Reset form
                this.reset();
                
                // Reset button
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                
                // Show success message
                showNotification('Thank you for your message! We will get back to you within 24 hours.', 'success');
                
                // Track form submission (if analytics is available)
                        if (window.VELCROMECH && window.VELCROMECH.trackEvent) {
            window.VELCROMECH.trackEvent('form_submit', 'contact', data.inquiryType || 'general');
                }
                
            }, 2000);
        });
        
        // Real-time validation
        const inputs = contactForm.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('blur', validateField);
            input.addEventListener('input', function() {
                if (this.classList.contains('error')) {
                    validateField.call(this);
                }
            });
        });
    }
    
    // Field validation function
    function validateField() {
        const value = this.value.trim();
        const isRequired = this.hasAttribute('required');
        
        if (isRequired && !value) {
            this.classList.add('error');
            return false;
        }
        
        if (this.type === 'email' && value && !isValidEmail(value)) {
            this.classList.add('error');
            return false;
        }
        
        this.classList.remove('error');
        return true;
    }
    
    // Email validation
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    // Get field label for error messages
    function getFieldLabel(fieldName) {
        const labels = {
            firstName: 'First Name',
            lastName: 'Last Name',
            email: 'Email Address',
            phone: 'Phone Number',
            company: 'Company Name',
            industry: 'Industry',
            inquiryType: 'Inquiry Type',
            subject: 'Subject',
            message: 'Message'
        };
        return labels[fieldName] || fieldName;
    }
    
    // Notification function
    function showNotification(message, type = 'info') {
        // Use the global notification system if available
            if (window.VELCROMECH && window.VELCROMECH.showNotification) {
        window.VELCROMECH.showNotification(message, type);
        } else {
            // Fallback notification
            const notification = document.createElement('div');
            notification.className = `notification notification-${type} show`;
            notification.innerHTML = `
                <span>${message}</span>
                <button class="notification-close">&times;</button>
            `;
            
            document.body.appendChild(notification);
            
            // Auto hide after 5 seconds
            setTimeout(() => {
                notification.classList.remove('show');
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.parentNode.removeChild(notification);
                    }
                }, 300);
            }, 5000);
            
            // Close button functionality
            const closeBtn = notification.querySelector('.notification-close');
            closeBtn.addEventListener('click', () => {
                notification.classList.remove('show');
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.parentNode.removeChild(notification);
                    }
                }, 300);
            });
        }
    }
    
    // Auto-populate form from URL parameters (for quote requests)
    function populateFormFromURL() {
        const urlParams = new URLSearchParams(window.location.search);
        
        if (urlParams.has('product')) {
            const productName = urlParams.get('product');
            const subjectField = document.getElementById('subject');
            const messageField = document.getElementById('message');
            const inquiryTypeField = document.getElementById('inquiry-type');
            
            if (subjectField && !subjectField.value) {
                subjectField.value = `Inquiry about ${productName}`;
            }
            
            if (messageField && !messageField.value) {
                messageField.value = `I am interested in learning more about ${productName}. Please provide detailed information including specifications, pricing, and availability.`;
            }
            
            if (inquiryTypeField) {
                inquiryTypeField.value = 'product-inquiry';
            }
        }
        
        if (urlParams.has('service')) {
            const serviceName = urlParams.get('service');
            const subjectField = document.getElementById('subject');
            const messageField = document.getElementById('message');
            const inquiryTypeField = document.getElementById('inquiry-type');
            
            if (subjectField && !subjectField.value) {
                subjectField.value = `Service Request: ${serviceName}`;
            }
            
            if (messageField && !messageField.value) {
                messageField.value = `I would like to request ${serviceName}. Please contact me to discuss requirements and scheduling.`;
            }
            
            if (inquiryTypeField) {
                inquiryTypeField.value = 'service-request';
            }
        }
    }
    
    populateFormFromURL();
    
    // Form field enhancements
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function() {
            // Simple phone number formatting
            let value = this.value.replace(/\D/g, '');
            if (value.length >= 10) {
                value = value.substring(0, 10);
                this.value = `+91 ${value.substring(0, 5)} ${value.substring(5)}`;
            } else {
                this.value = value;
            }
        });
    }
    
    // Industry selection enhancement
    const industrySelect = document.getElementById('industry');
    const inquiryTypeSelect = document.getElementById('inquiry-type');
    
    if (industrySelect && inquiryTypeSelect) {
        industrySelect.addEventListener('change', function() {
            // Auto-suggest inquiry type based on industry
            if (this.value && inquiryTypeSelect.value === '') {
                inquiryTypeSelect.value = 'product-inquiry';
            }
        });
    }
    
    // Character counter for message field
    const messageField = document.getElementById('message');
    if (messageField) {
        const charCounter = document.createElement('div');
        charCounter.className = 'char-counter';
        charCounter.style.cssText = 'text-align: right; font-size: 0.875rem; color: var(--text-secondary); margin-top: 0.5rem;';
        
        messageField.parentNode.appendChild(charCounter);
        
        function updateCharCounter() {
            const length = messageField.value.length;
            charCounter.textContent = `${length} characters`;
            
            if (length > 1000) {
                charCounter.style.color = 'var(--secondary-color)';
            } else {
                charCounter.style.color = 'var(--text-secondary)';
            }
        }
        
        messageField.addEventListener('input', updateCharCounter);
        updateCharCounter();
    }
}); 