// Zoomable Image Modal - Handles pinch-to-zoom, pan, and double-tap zoom
(function() {
    let currentScale = 1;
    let isDragging = false;
    let startX = 0;
    let startY = 0;
    let translateX = 0;
    let translateY = 0;
    let currentImage = null;
    let modalBody = null;

    // Initialize when DOM is ready
    document.addEventListener('DOMContentLoaded', function() {
        setupZoomableModals();
    });

    function setupZoomableModals() {
        // Find all fullscreen image modals
        const modals = document.querySelectorAll('.fullscreen-image-modal');

        modals.forEach(modal => {
            modal.addEventListener('shown.bs.modal', function() {
                initZoomableImage(this);
            });

            modal.addEventListener('hidden.bs.modal', function() {
                resetZoom();
            });
        });
    }

    function initZoomableImage(modal) {
        modalBody = modal.querySelector('.modal-body');
        currentImage = modal.querySelector('.modal-body img');
        const zoomHint = modal.querySelector('.zoom-hint');

        if (!currentImage || !modalBody) return;

        // Reset transform
        resetZoom();

        // Add zoomable class
        currentImage.classList.add('zoomable');
        modalBody.classList.add('zoomable-container');

        // Hide zoom hint after 3 seconds or on first interaction
        let hintHidden = false;
        const hideHint = () => {
            if (!hintHidden && zoomHint) {
                zoomHint.style.opacity = '0';
                zoomHint.style.transition = 'opacity 0.5s ease';
                hintHidden = true;
                setTimeout(() => {
                    zoomHint.style.display = 'none';
                }, 500);
            }
        };

        // Auto-hide after 3 seconds
        setTimeout(hideHint, 3000);

        // Hide hint on first interaction
        const hideHintOnInteraction = () => hideHint();

        // Touch events for pinch zoom
        let initialDistance = 0;
        let initialScale = 1;
        let lastScale = 1;

        modalBody.addEventListener('touchstart', function(e) {
            hideHintOnInteraction();
            if (e.touches.length === 2) {
                // Pinch start
                initialDistance = getDistance(e.touches[0], e.touches[1]);
                initialScale = currentScale;
            } else if (e.touches.length === 1 && currentScale > 1) {
                // Pan start
                isDragging = true;
                startX = e.touches[0].clientX - translateX;
                startY = e.touches[0].clientY - translateY;
            }
        }, { passive: true });

        modalBody.addEventListener('touchmove', function(e) {
            if (e.touches.length === 2) {
                // Pinch zoom
                e.preventDefault();
                const currentDistance = getDistance(e.touches[0], e.touches[1]);
                const scaleChange = currentDistance / initialDistance;
                currentScale = Math.max(1, Math.min(5, initialScale * scaleChange));
                lastScale = currentScale;
                updateTransform();
            } else if (e.touches.length === 1 && isDragging && currentScale > 1) {
                // Pan
                e.preventDefault();
                translateX = e.touches[0].clientX - startX;
                translateY = e.touches[0].clientY - startY;
                updateTransform();
            }
        }, { passive: false });

        modalBody.addEventListener('touchend', function(e) {
            isDragging = false;
            if (e.touches.length === 0) {
                // Pinch ended
                currentScale = lastScale;
            }
        });

        // Double tap to zoom
        let lastTap = 0;
        modalBody.addEventListener('touchend', function(e) {
            const currentTime = new Date().getTime();
            const tapLength = currentTime - lastTap;
            if (tapLength < 300 && tapLength > 0) {
                // Double tap
                if (currentScale === 1) {
                    currentScale = 2.5;
                } else {
                    resetZoom();
                }
                updateTransform();
            }
            lastTap = currentTime;
        });

        // Mouse wheel zoom for desktop
        modalBody.addEventListener('wheel', function(e) {
            hideHintOnInteraction();
            e.preventDefault();
            const delta = e.deltaY > 0 ? -0.1 : 0.1;
            currentScale = Math.max(1, Math.min(5, currentScale + delta));
            updateTransform();
        }, { passive: false });

        // Mouse drag for desktop
        modalBody.addEventListener('mousedown', function(e) {
            hideHintOnInteraction();
            if (currentScale > 1) {
                isDragging = true;
                startX = e.clientX - translateX;
                startY = e.clientY - translateY;
                modalBody.style.cursor = 'grabbing';
            }
        });

        modalBody.addEventListener('mousemove', function(e) {
            if (isDragging && currentScale > 1) {
                e.preventDefault();
                translateX = e.clientX - startX;
                translateY = e.clientY - startY;
                updateTransform();
            }
        });

        modalBody.addEventListener('mouseup', function() {
            isDragging = false;
            modalBody.style.cursor = currentScale > 1 ? 'grab' : 'default';
        });

        modalBody.addEventListener('mouseleave', function() {
            isDragging = false;
            modalBody.style.cursor = currentScale > 1 ? 'grab' : 'default';
        });

        // Click to zoom on desktop
        currentImage.addEventListener('click', function(e) {
            hideHintOnInteraction();
            if (!isDragging) {
                if (currentScale === 1) {
                    currentScale = 2.5;
                    modalBody.style.cursor = 'grab';
                } else {
                    resetZoom();
                }
                updateTransform();
            }
        });
    }

    function getDistance(touch1, touch2) {
        const dx = touch1.clientX - touch2.clientX;
        const dy = touch1.clientY - touch2.clientY;
        return Math.sqrt(dx * dx + dy * dy);
    }

    function updateTransform() {
        if (currentImage) {
            currentImage.style.transform = `translate(${translateX}px, ${translateY}px) scale(${currentScale})`;
        }
    }

    function resetZoom() {
        currentScale = 1;
        translateX = 0;
        translateY = 0;
        isDragging = false;
        if (currentImage) {
            currentImage.style.transform = 'translate(0, 0) scale(1)';
        }
        if (modalBody) {
            modalBody.style.cursor = 'default';
        }
    }
})();
