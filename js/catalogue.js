// E-Catalogue functionality
document.addEventListener('DOMContentLoaded', function() {
    
    // Download tracking
    const downloadButtons = document.querySelectorAll('.download-btn');
    const previewButtons = document.querySelectorAll('.preview-btn');
    
    // Download functionality
    downloadButtons.forEach(button => {
        button.addEventListener('click', function() {
            const fileName = this.getAttribute('data-file');
            if (fileName) {
                handleDownload(fileName, this);
            }
        });
    });
    
    // Preview functionality
    previewButtons.forEach(button => {
        button.addEventListener('click', function() {
            const fileName = this.getAttribute('data-file');
            if (fileName) {
                handlePreview(fileName);
            }
        });
    });
    
    function handleDownload(fileName, buttonElement) {
        // Show loading state
        const originalText = buttonElement.innerHTML;
        buttonElement.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Downloading...';
        buttonElement.disabled = true;
        
        // Simulate download process
        setTimeout(() => {
            // In a real implementation, you would:
            // 1. Create a download link
            // 2. Track the download in analytics
            // 3. Possibly require user registration for certain files
            
            // Create a temporary download link
            const link = document.createElement('a');
            link.href = `downloads/${fileName}`;
            link.download = fileName;
            link.style.display = 'none';
            
            document.body.appendChild(link);
            
            // Attempt to trigger download
            try {
                link.click();
                showNotification(`${fileName} download started`, 'success');
                
                // Track download
                trackDownload(fileName);
                
            } catch (error) {
                showNotification('Download failed. Please try again or contact support.', 'error');
                console.error('Download error:', error);
            }
            
            document.body.removeChild(link);
            
            // Reset button
            buttonElement.innerHTML = originalText;
            buttonElement.disabled = false;
            
        }, 1500);
    }
    
    function handlePreview(fileName) {
        // Create preview modal
        const modal = createPreviewModal(fileName);
        document.body.appendChild(modal);
        
        // Show modal
        setTimeout(() => {
            modal.classList.add('active');
        }, 10);
        
        // Track preview
        trackPreview(fileName);
    }
    
    function createPreviewModal(fileName) {
        const modal = document.createElement('div');
        modal.className = 'preview-modal';
        modal.innerHTML = `
            <div class="modal-backdrop"></div>
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Preview: ${fileName}</h3>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="preview-placeholder">
                        <i class="fas fa-file-pdf"></i>
                        <h4>Document Preview</h4>
                        <p>Preview functionality would be implemented here.<br>
                        This could include PDF viewer, image gallery, or document thumbnails.</p>
                        <div class="preview-actions">
                            <button class="btn btn-primary download-btn" data-file="${fileName}">
                                <i class="fas fa-download"></i>
                                Download Full Document
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Add event listeners
        const closeBtn = modal.querySelector('.modal-close');
        const backdrop = modal.querySelector('.modal-backdrop');
        const downloadBtn = modal.querySelector('.download-btn');
        
        closeBtn.addEventListener('click', () => closeModal(modal));
        backdrop.addEventListener('click', () => closeModal(modal));
        downloadBtn.addEventListener('click', function() {
            const fileName = this.getAttribute('data-file');
            handleDownload(fileName, this);
            closeModal(modal);
        });
        
        return modal;
    }
    
    function closeModal(modal) {
        modal.classList.remove('active');
        setTimeout(() => {
            if (modal.parentNode) {
                modal.parentNode.removeChild(modal);
            }
        }, 300);
    }
    
    // Download tracking
    function trackDownload(fileName) {
        // Update download counter (in real app, this would be server-side)
        updateDownloadStats(fileName);
        
        // Analytics tracking
        if (window.VELCROMECH && window.VELCROMECH.trackEvent) {
            window.VELCROMECH.trackEvent('file_download', 'catalogue', fileName);
        }
        
        // Google Analytics (if available)
        if (typeof gtag !== 'undefined') {
            gtag('event', 'download', {
                event_category: 'catalogue',
                event_label: fileName
            });
        }
    }
    
    function trackPreview(fileName) {
        if (window.VELCROMECH && window.VELCROMECH.trackEvent) {
            window.VELCROMECH.trackEvent('file_preview', 'catalogue', fileName);
        }
    }
    
    function updateDownloadStats(fileName) {
        // This would typically be handled server-side
        // For demo purposes, we'll just store in localStorage
        const stats = JSON.parse(localStorage.getItem('downloadStats') || '{}');
        stats[fileName] = (stats[fileName] || 0) + 1;
        localStorage.setItem('downloadStats', JSON.stringify(stats));
    }
    
    // Search functionality for catalogues
    const searchInput = document.querySelector('.catalogue-search');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const query = this.value.toLowerCase();
            filterCatalogues(query);
        });
    }
    
    function filterCatalogues(query) {
        const catalogueItems = document.querySelectorAll('.catalogue-item, .download-card, .resource-card');
        
        catalogueItems.forEach(item => {
            const title = item.querySelector('h3, h4').textContent.toLowerCase();
            const description = item.querySelector('p').textContent.toLowerCase();
            
            if (title.includes(query) || description.includes(query)) {
                item.style.display = 'block';
                item.parentElement.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });
        
        // Hide empty categories
        const categories = document.querySelectorAll('.product-category');
        categories.forEach(category => {
            const visibleItems = category.querySelectorAll('.catalogue-item[style*="block"], .catalogue-item:not([style])');
            if (visibleItems.length === 0 && query.length > 0) {
                category.style.display = 'none';
            } else {
                category.style.display = 'block';
            }
        });
    }
    
    // Bulk download functionality
    const bulkDownloadBtn = document.querySelector('.bulk-download-btn');
    if (bulkDownloadBtn) {
        bulkDownloadBtn.addEventListener('click', handleBulkDownload);
    }
    
    function handleBulkDownload() {
        const selectedFiles = document.querySelectorAll('input[name="bulk-select"]:checked');
        
        if (selectedFiles.length === 0) {
            showNotification('Please select files to download', 'error');
            return;
        }
        
        // Show confirmation
        const fileNames = Array.from(selectedFiles).map(input => input.value);
        const confirmation = confirm(`Download ${fileNames.length} files?\n\nFiles:\n${fileNames.join('\n')}`);
        
        if (confirmation) {
            fileNames.forEach((fileName, index) => {
                setTimeout(() => {
                    const link = document.createElement('a');
                    link.href = `downloads/${fileName}`;
                    link.download = fileName;
                    link.click();
                }, index * 500); // Stagger downloads
            });
            
            showNotification(`Started downloading ${fileNames.length} files`, 'success');
            
            // Track bulk download
                    if (window.VELCROMECH && window.VELCROMECH.trackEvent) {
            window.VELCROMECH.trackEvent('bulk_download', 'catalogue', fileNames.length.toString());
            }
        }
    }
    
    // File size formatter
    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
    }
    
    // Update file sizes dynamically (if needed)
    function updateFileSizes() {
        const fileSizeElements = document.querySelectorAll('.file-size');
        fileSizeElements.forEach(element => {
            const fileName = element.closest('.download-card, .catalogue-item').querySelector('.download-btn').getAttribute('data-file');
            // In a real app, you'd fetch the actual file size from the server
            // For demo, we'll use placeholder sizes
        });
    }
    
    // Notification function
    function showNotification(message, type = 'info') {
            if (window.VELCROMECH && window.VELCROMECH.showNotification) {
        window.VELCROMECH.showNotification(message, type);
        } else {
            alert(message); // Fallback
        }
    }
    
    // Initialize
    updateFileSizes();
    
    // Add keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        // Ctrl+D for quick download of most popular catalog
        if (e.ctrlKey && e.key === 'd') {
            e.preventDefault();
            const firstDownloadBtn = document.querySelector('.download-btn');
            if (firstDownloadBtn) {
                firstDownloadBtn.click();
            }
        }
        
        // Escape to close modals
        if (e.key === 'Escape') {
            const activeModal = document.querySelector('.preview-modal.active');
            if (activeModal) {
                closeModal(activeModal);
            }
        }
    });
}); 