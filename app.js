// Global variables
let currentPage = 0;
const totalPages = 6;
let isTransitioning = false;

// DOM elements
let pages, dots, prevBtn, nextBtn, loadingScreen, tooltip, fallingLeavesContainer;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements after DOM is loaded
    pages = document.querySelectorAll('.page');
    dots = document.querySelectorAll('.dot');
    prevBtn = document.getElementById('prevBtn');
    nextBtn = document.getElementById('nextBtn');
    loadingScreen = document.getElementById('loading-screen');
    tooltip = document.getElementById('tooltip');
    fallingLeavesContainer = document.getElementById('falling-leaves');
    
    initializeApp();
    setupEventListeners();
    handleLoadingScreen();
    createEnhancedFallingLeaves();
});

// Initialize application
function initializeApp() {
    // Set initial page state
    currentPage = 0;
    updatePageDisplay();
    updateNavigationButtons();
    
    // Setup key terms tooltips
    setupTooltips();
    
    // Setup dot navigation
    setupDotNavigation();
    
    // Setup keyboard navigation
    setupKeyboardNavigation();
    
    // Add smooth scrolling
    document.documentElement.style.scrollBehavior = 'smooth';
    
    // Enhance begin reading button
    enhanceBeginReadingButton();
    
    console.log('App initialized with', pages.length, 'pages');
}

// Handle loading screen
function handleLoadingScreen() {
    setTimeout(() => {
        if (loadingScreen) {
            loadingScreen.classList.add('hidden');
            
            // Add entrance animation to first page
            setTimeout(() => {
                if (pages[0]) {
                    pages[0].style.animation = 'fadeInUp 1s ease-out forwards';
                }
            }, 500);
        }
    }, 3000);
}

// Enhance Begin Reading Button - Fixed Implementation
function enhanceBeginReadingButton() {
    const beginBtn = document.getElementById('begin-reading-btn');
    if (beginBtn) {
        console.log('Setting up Begin Reading button');
        
        // Remove any existing onclick to prevent conflicts
        beginBtn.removeAttribute('onclick');
        
        // Add click handler with proper functionality
        beginBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            console.log('Begin Reading button clicked');
            
            // Add click animation
            this.style.transform = 'translateY(-1px) scale(0.98)';
            
            setTimeout(() => {
                this.style.transform = '';
                // Navigate to first stanza (page 1)
                console.log('Navigating to page 1');
                goToPage(1);
            }, 150);
        });

        // Enhanced hover effects
        beginBtn.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px)';
            this.style.boxShadow = '0 10px 25px rgba(33, 128, 141, 0.3)';
        });

        beginBtn.addEventListener('mouseleave', function() {
            if (!this.matches(':active')) {
                this.style.transform = '';
                this.style.boxShadow = '';
            }
        });
        
        console.log('Begin Reading button setup complete');
    } else {
        console.error('Begin Reading button not found!');
    }
}

// Setup event listeners
function setupEventListeners() {
    // Navigation buttons
    if (prevBtn) {
        prevBtn.addEventListener('click', (e) => {
            e.preventDefault();
            prevPage();
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', (e) => {
            e.preventDefault();
            nextPage();
        });
    }
    
    // Enhanced hover effects for lines
    const hoverLines = document.querySelectorAll('.hover-line');
    hoverLines.forEach(line => {
        line.addEventListener('mouseenter', function() {
            this.style.transform = 'translateX(15px) scale(1.02)';
            this.style.textShadow = '2px 2px 4px rgba(0,0,0,0.1)';
            this.style.background = 'rgba(33, 128, 141, 0.08)';
        });
        
        line.addEventListener('mouseleave', function() {
            this.style.transform = '';
            this.style.textShadow = '';
            this.style.background = '';
        });
    });
    
    // Add stagger animation to poem lines
    addStaggerAnimation();
    
    // Add touch gestures for mobile
    setupTouchGestures();
}

// Setup touch gestures for mobile responsiveness
function setupTouchGestures() {
    let startX = 0;
    let startY = 0;
    
    document.addEventListener('touchstart', function(e) {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
    });
    
    document.addEventListener('touchend', function(e) {
        if (isTransitioning) return;
        
        const endX = e.changedTouches[0].clientX;
        const endY = e.changedTouches[0].clientY;
        const diffX = startX - endX;
        const diffY = startY - endY;
        
        // Check if it's a horizontal swipe (not vertical scroll)
        if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
            if (diffX > 0) {
                // Swipe left - next page
                nextPage();
            } else {
                // Swipe right - previous page
                prevPage();
            }
        }
    });
}

// Setup keyboard navigation
function setupKeyboardNavigation() {
    document.addEventListener('keydown', function(e) {
        if (isTransitioning) return;
        
        switch(e.key) {
            case 'ArrowRight':
            case ' ':
                e.preventDefault();
                nextPage();
                break;
            case 'ArrowLeft':
                e.preventDefault();
                prevPage();
                break;
            case 'Home':
                e.preventDefault();
                goToPage(0);
                break;
            case 'End':
                e.preventDefault();
                goToPage(totalPages - 1);
                break;
            case 'Enter':
                if (currentPage === 0) {
                    e.preventDefault();
                    goToPage(1); // Begin reading functionality
                }
                break;
        }
    });
}

// Setup tooltips for key terms
function setupTooltips() {
    const keyTerms = document.querySelectorAll('.key-term');
    console.log('Setting up tooltips for', keyTerms.length, 'key terms');
    
    keyTerms.forEach((term, index) => {
        console.log('Setting up tooltip for term:', term.textContent, 'with data:', term.dataset.tooltip);
        
        term.addEventListener('mouseenter', function(e) {
            const tooltipText = this.dataset.tooltip || this.getAttribute('data-tooltip');
            console.log('Showing tooltip:', tooltipText);
            showTooltip(e, tooltipText);
        });
        
        term.addEventListener('mouseleave', function() {
            console.log('Hiding tooltip');
            hideTooltip();
        });
        
        term.addEventListener('mousemove', function(e) {
            updateTooltipPosition(e);
        });
        
        // Add ripple effect on click
        term.addEventListener('click', function(e) {
            e.preventDefault();
            createRippleEffect(e, this);
        });
    });
}

// Setup dot navigation
function setupDotNavigation() {
    if (!dots) return;
    
    dots.forEach((dot, index) => {
        console.log('Setting up dot navigation for dot', index);
        
        dot.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('Dot clicked:', index);
            if (!isTransitioning) {
                goToPage(index);
            }
        });
        
        // Enhanced hover effects for dots
        dot.addEventListener('mouseenter', function() {
            if (!this.classList.contains('active')) {
                this.style.transform = 'scale(1.3)';
                this.style.background = 'rgba(50, 184, 198, 0.8)';
                this.style.boxShadow = '0 0 8px rgba(50, 184, 198, 0.6)';
            }
        });
        
        dot.addEventListener('mouseleave', function() {
            if (!this.classList.contains('active')) {
                this.style.transform = '';
                this.style.background = '';
                this.style.boxShadow = '';
            }
        });
        
        // Keyboard accessibility for dots
        dot.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                if (!isTransitioning) {
                    goToPage(index);
                }
            }
        });
    });
}

// Add stagger animation to poem lines
function addStaggerAnimation() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const lines = entry.target.querySelectorAll('.line');
                lines.forEach((line, index) => {
                    setTimeout(() => {
                        line.style.opacity = '1';
                        line.style.transform = 'translateX(0)';
                        line.style.transition = 'all 0.6s ease-out';
                    }, index * 100);
                });
            }
        });
    }, observerOptions);
    
    document.querySelectorAll('.poem-text').forEach(poemText => {
        // Initially hide lines
        const lines = poemText.querySelectorAll('.line');
        lines.forEach(line => {
            line.style.opacity = '0';
            line.style.transform = 'translateX(-30px)';
        });
        
        observer.observe(poemText);
    });
}

// Navigation functions - Fixed implementation
function nextPage() {
    console.log('Next page called, current:', currentPage, 'total:', totalPages);
    if (currentPage < totalPages - 1 && !isTransitioning) {
        goToPage(currentPage + 1);
    }
}

function prevPage() {
    console.log('Prev page called, current:', currentPage);
    if (currentPage > 0 && !isTransitioning) {
        goToPage(currentPage - 1);
    }
}

function goToPage(pageIndex) {
    console.log('Going to page:', pageIndex, 'from:', currentPage);
    
    if (pageIndex === currentPage || isTransitioning || pageIndex < 0 || pageIndex >= totalPages) {
        console.log('Invalid page navigation attempt');
        return;
    }
    
    isTransitioning = true;
    
    // Hide current page
    if (pages[currentPage]) {
        pages[currentPage].classList.remove('active');
        pages[currentPage].style.opacity = '0';
        pages[currentPage].style.transform = pageIndex > currentPage ? 'translateX(-100px)' : 'translateX(100px)';
    }
    
    setTimeout(() => {
        // Update current page
        const oldPage = currentPage;
        currentPage = pageIndex;
        
        // Show new page
        if (pages[currentPage]) {
            pages[currentPage].classList.add('active');
            pages[currentPage].style.opacity = '1';
            pages[currentPage].style.transform = 'translateX(0)';
        }
        
        // Update UI
        updatePageDisplay();
        updateNavigationButtons();
        
        // Add page-specific animations
        addPageAnimations();
        
        console.log('Page transition completed from', oldPage, 'to', currentPage);
        
        setTimeout(() => {
            isTransitioning = false;
        }, 300);
    }, 400);
}

// Update page display
function updatePageDisplay() {
    // Update progress dots with enhanced animations
    if (dots) {
        dots.forEach((dot, index) => {
            if (dot) {
                const wasActive = dot.classList.contains('active');
                dot.classList.toggle('active', index === currentPage);
                
                if (index === currentPage && !wasActive) {
                    // Add activation animation
                    dot.style.animation = 'pulse 0.6s ease-out';
                    setTimeout(() => {
                        dot.style.animation = '';
                    }, 600);
                }
            }
        });
    }
    
    // Add page-specific effects
    addPageSpecificEffects();
}

// Add page-specific effects
function addPageSpecificEffects() {
    // Add special effects based on current page
    switch(currentPage) {
        case 0: // Title page
            addTitlePageEffects();
            break;
        case 1: // First stanza
            addStanzaEffects('growth');
            break;
        case 2: // Second stanza
            addStanzaEffects('resilience');
            break;
        case 3: // Third stanza
            addStanzaEffects('destruction');
            break;
        case 4: // Fourth stanza
            addStanzaEffects('death');
            break;
        case 5: // Final page
            addFinalPageEffects();
            break;
    }
}

// Add title page effects
function addTitlePageEffects() {
    const titleDecoration = document.querySelector('.title-decoration');
    if (titleDecoration) {
        titleDecoration.style.animation = 'pulse 2s ease-in-out infinite';
    }
}

// Add stanza-specific effects
function addStanzaEffects(theme) {
    if (!pages[currentPage]) return;
    
    const currentPageElement = pages[currentPage];
    const leafDecoration = currentPageElement.querySelector('.leaf-decoration');
    
    if (leafDecoration) {
        switch(theme) {
            case 'growth':
                leafDecoration.style.color = '#22c55e';
                leafDecoration.style.animation = 'float 3s ease-in-out infinite';
                break;
            case 'resilience':
                leafDecoration.style.color = '#16a34a';
                leafDecoration.style.animation = 'rotate 4s ease-in-out infinite';
                break;
            case 'destruction':
                leafDecoration.style.color = '#dc2626';
                leafDecoration.style.animation = 'shake 2s ease-in-out infinite';
                break;
            case 'death':
                leafDecoration.style.color = '#a1a1aa';
                leafDecoration.style.animation = 'fade 3s ease-in-out infinite';
                break;
        }
    }
}

// Add final page effects
function addFinalPageEffects() {
    const finalDecoration = document.querySelector('.final-decoration');
    if (finalDecoration) {
        finalDecoration.style.animation = 'float 3s ease-in-out infinite';
    }
}

// Add page animations
function addPageAnimations() {
    if (!pages[currentPage]) return;
    
    const currentPageElement = pages[currentPage];
    const animateElements = currentPageElement.querySelectorAll('.line, .theme-note, .reflection-text p');
    
    animateElements.forEach((element, index) => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            element.style.transition = 'all 0.6s ease-out';
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, index * 100 + 200);
    });
}

// Update navigation buttons
function updateNavigationButtons() {
    if (prevBtn) {
        prevBtn.disabled = currentPage === 0;
        prevBtn.style.opacity = currentPage === 0 ? '0.5' : '1';
        prevBtn.style.cursor = currentPage === 0 ? 'not-allowed' : 'pointer';
    }
    
    if (nextBtn) {
        nextBtn.disabled = currentPage === totalPages - 1;
        nextBtn.style.opacity = currentPage === totalPages - 1 ? '0.5' : '1';
        nextBtn.style.cursor = currentPage === totalPages - 1 ? 'not-allowed' : 'pointer';
    }
}

// Tooltip functions
function showTooltip(event, text) {
    if (!tooltip || !text) {
        console.log('Cannot show tooltip - missing tooltip element or text');
        return;
    }
    
    console.log('Showing tooltip with text:', text);
    tooltip.textContent = text;
    tooltip.classList.remove('hidden');
    tooltip.classList.add('visible');
    updateTooltipPosition(event);
}

function hideTooltip() {
    if (!tooltip) return;
    
    tooltip.classList.remove('visible');
    tooltip.classList.add('hidden');
}

function updateTooltipPosition(event) {
    if (!tooltip) return;
    
    const tooltipRect = tooltip.getBoundingClientRect();
    const x = event.clientX - tooltipRect.width / 2;
    const y = event.clientY - tooltipRect.height - 15;
    
    tooltip.style.left = Math.max(10, Math.min(x, window.innerWidth - tooltipRect.width - 10)) + 'px';
    tooltip.style.top = Math.max(10, y) + 'px';
}

// Create ripple effect
function createRippleEffect(event, element) {
    const ripple = document.createElement('span');
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    ripple.style.position = 'absolute';
    ripple.style.borderRadius = '50%';
    ripple.style.background = 'rgba(33, 128, 141, 0.3)';
    ripple.style.transform = 'scale(0)';
    ripple.style.animation = 'ripple 0.6s linear';
    ripple.style.pointerEvents = 'none';
    ripple.style.zIndex = '10';
    
    element.style.position = 'relative';
    element.appendChild(ripple);
    
    setTimeout(() => {
        if (ripple.parentNode) {
            ripple.remove();
        }
    }, 600);
}

// Enhanced Falling Leaves Effect
function createEnhancedFallingLeaves() {
    if (!fallingLeavesContainer) return;
    
    const leafEmojis = ['🍃', '🌿', '🍂', '🌱', '🌾', '🍀', '🌸', '🌺', '🌻', '🌷'];
    const leafCount = 50; // Significantly more leaves
    
    // Create initial leaves
    for (let i = 0; i < leafCount; i++) {
        setTimeout(() => {
            createLeaf();
        }, i * 200); // Stagger initial creation
    }
    
    // Continuously create new leaves
    setInterval(createLeaf, 800);
    
    function createLeaf() {
        if (document.querySelectorAll('.leaf').length > 100) {
            // Remove oldest leaves to prevent too many DOM elements
            const oldestLeaf = document.querySelector('.leaf');
            if (oldestLeaf) {
                oldestLeaf.remove();
            }
        }
        
        const leaf = document.createElement('div');
        leaf.className = 'leaf';
        leaf.textContent = leafEmojis[Math.floor(Math.random() * leafEmojis.length)];
        
        // Random starting position
        leaf.style.left = Math.random() * 100 + 'vw';
        leaf.style.top = '-50px';
        
        // Random size
        const size = Math.random() * 0.8 + 0.8; // 0.8x to 1.6x
        leaf.style.fontSize = size + 'rem';
        
        // Random opacity
        leaf.style.opacity = Math.random() * 0.4 + 0.3; // 0.3 to 0.7
        
        // Random animation duration and type
        const duration = Math.random() * 8 + 6; // 6-14 seconds
        const animationType = Math.random();
        
        if (animationType < 0.33) {
            leaf.style.animation = `fall ${duration}s linear infinite`;
        } else if (animationType < 0.66) {
            leaf.style.animation = `fallSway ${duration}s ease-in-out infinite`;
        } else {
            leaf.style.animation = `fallSpiral ${duration}s ease-in-out infinite`;
        }
        
        // Add slight delay for more natural effect
        leaf.style.animationDelay = Math.random() * 2 + 's';
        
        fallingLeavesContainer.appendChild(leaf);
        
        // Remove leaf after animation
        setTimeout(() => {
            if (leaf.parentNode) {
                leaf.remove();
            }
        }, (duration + 2) * 1000);
    }
}

// Enhanced hover effects for navigation buttons
function enhanceNavigationButtons() {
    [prevBtn, nextBtn].forEach(btn => {
        if (!btn) return;
        
        btn.addEventListener('mouseenter', function() {
            if (!this.disabled) {
                this.style.transform = 'translateY(-3px) scale(1.05)';
                this.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.15)';
            }
        });
        
        btn.addEventListener('mouseleave', function() {
            if (!this.disabled) {
                this.style.transform = '';
                this.style.boxShadow = '';
            }
        });
        
        btn.addEventListener('mousedown', function() {
            if (!this.disabled) {
                this.style.transform = 'translateY(-1px) scale(1.02)';
            }
        });
        
        btn.addEventListener('mouseup', function() {
            if (!this.disabled) {
                this.style.transform = 'translateY(-3px) scale(1.05)';
            }
        });
    });
}

// Responsive font size adjustment
function adjustFontSizes() {
    const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
    
    if (vw < 480) {
        document.documentElement.style.setProperty('--responsive-title-size', '2rem');
        document.documentElement.style.setProperty('--responsive-text-size', '0.9rem');
    } else if (vw < 768) {
        document.documentElement.style.setProperty('--responsive-title-size', '2.5rem');
        document.documentElement.style.setProperty('--responsive-text-size', '1rem');
    } else {
        document.documentElement.style.setProperty('--responsive-title-size', '3rem');
        document.documentElement.style.setProperty('--responsive-text-size', '1.125rem');
    }
}

// Initialize enhanced effects after DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        enhanceNavigationButtons();
        adjustFontSizes();
    }, 1000);
    
    // Listen for resize events for responsive design
    window.addEventListener('resize', adjustFontSizes);
});

// Performance optimization for animations
function optimizeAnimations() {
    // Use requestAnimationFrame for smoother animations
    let ticking = false;
    
    function updateAnimations() {
        // Update any ongoing animations here
        ticking = false;
    }
    
    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateAnimations);
            ticking = true;
        }
    }
    
    // Call requestTick whenever you need to update animations
    document.addEventListener('scroll', requestTick);
}

// Initialize performance optimizations
optimizeAnimations();

// Export functions for global access - Fixed
window.nextPage = nextPage;
window.prevPage = prevPage;
window.goToPage = goToPage;