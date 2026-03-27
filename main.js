document.addEventListener('DOMContentLoaded', function () {

    // === Theme Toggle Logic ===
    var themeToggleBtn = document.getElementById('theme-toggle');
    var html = document.documentElement;

    function getStoredTheme() {
        try {
            return localStorage.getItem('theme');
        } catch (e) {
            return null;
        }
    }

    function setStoredTheme(value) {
        try {
            localStorage.setItem('theme', value);
        } catch (e) {
            // localStorage not available
        }
    }

    // Default to dark mode
    var storedTheme = getStoredTheme();
    if (storedTheme === 'light') {
        html.classList.remove('dark');
    } else {
        html.classList.add('dark');
        if (storedTheme === null) {
            setStoredTheme('dark');
        }
    }

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', function () {
            if (html.classList.contains('dark')) {
                html.classList.remove('dark');
                setStoredTheme('light');
            } else {
                html.classList.add('dark');
                setStoredTheme('dark');
            }
        });
    }

    // === Mobile Menu Logic ===
    var mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    var mobileMenu = document.getElementById('mobile-menu');
    var menuIcon = document.getElementById('menu-icon');
    var mobileMenuLinks = document.querySelectorAll('#mobile-menu a');
    var isMenuOpen = false;

    function openMobileMenu() {
        mobileMenu.style.maxHeight = '500px';
        menuIcon.textContent = 'close';
        isMenuOpen = true;
    }

    function closeMobileMenu() {
        mobileMenu.style.maxHeight = '0';
        menuIcon.textContent = 'menu';
        isMenuOpen = false;
    }

    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', function () {
            if (isMenuOpen) {
                closeMobileMenu();
            } else {
                openMobileMenu();
            }
        });
    }

    // === Mobile Servicios Submenu Logic ===
    var mobileServiciosToggle = document.getElementById('mobile-servicios-toggle');
    var mobileServiciosMenu = document.getElementById('mobile-servicios-menu');
    var mobileServiciosIcon = document.getElementById('mobile-servicios-icon');
    var isServiciosOpen = false;

    if (mobileServiciosToggle) {
        mobileServiciosToggle.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            if (isServiciosOpen) {
                mobileServiciosMenu.style.maxHeight = '0';
                mobileServiciosIcon.style.transform = 'rotate(0deg)';
                isServiciosOpen = false;
                // Restore original menu height
                mobileMenu.style.maxHeight = '500px';
            } else {
                mobileServiciosMenu.style.maxHeight = '300px';
                mobileServiciosIcon.style.transform = 'rotate(180deg)';
                isServiciosOpen = true;
                // Expand main menu to fit submenu
                mobileMenu.style.maxHeight = '750px';
            }
        });

        // Add transition styles
        mobileServiciosMenu.style.transition = 'max-height 0.3s ease-in-out';
        mobileServiciosIcon.style.transition = 'transform 0.3s ease-in-out';
    }

    // Close mobile menu when clicking on a link
    mobileMenuLinks.forEach(function (link) {
        link.addEventListener('click', function () {
            closeMobileMenu();
            isServiciosOpen = false;
            if (mobileServiciosMenu) {
                mobileServiciosMenu.style.maxHeight = '0';
                if (mobileServiciosIcon) {
                    mobileServiciosIcon.style.transform = 'rotate(0deg)';
                }
            }
        });
    });

    // Also handle clicks on servicios submenu links
    var serviciosLinks = document.querySelectorAll('#mobile-servicios-menu a');
    serviciosLinks.forEach(function (link) {
        link.addEventListener('click', function () {
            closeMobileMenu();
            isServiciosOpen = false;
            if (mobileServiciosMenu) {
                mobileServiciosMenu.style.maxHeight = '0';
                if (mobileServiciosIcon) {
                    mobileServiciosIcon.style.transform = 'rotate(0deg)';
                }
            }
        });
    });

    // === Services Carousels Logic ===
    function initServiceCarousels() {
        var carousels = document.querySelectorAll('[data-service-carousel]');

        carousels.forEach(function (carousel) {
            var slides = carousel.querySelectorAll('[data-service-slide]');
            var dotsContainer = carousel.querySelector('[data-service-dots]');
            var dots = [];
            var currentIndex = 0;
            var timer = null;
            var interval = parseInt(carousel.getAttribute('data-interval'), 10) || 4500;

            if (!slides.length) {
                return;
            }

            if (!dotsContainer) {
                dotsContainer = document.createElement('div');
                dotsContainer.setAttribute('data-service-dots', '');
                dotsContainer.className = 'absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10';
                carousel.appendChild(dotsContainer);
            }

            dotsContainer.innerHTML = '';

            slides.forEach(function (slide, index) {
                var dot = document.createElement('button');
                dot.type = 'button';
                dot.setAttribute('data-service-dot', '');
                dot.setAttribute('aria-label', 'Ver imagen ' + (index + 1));
                dot.className = 'service-carousel-dot w-2.5 h-2.5 rounded-full ' + (index === 0 ? 'active bg-white/80' : 'bg-white/50');
                dotsContainer.appendChild(dot);
                dots.push(dot);

                if (index === 0) {
                    slide.classList.add('active');
                } else {
                    slide.classList.remove('active');
                }
            });

            function showSlide(index) {
                if (index === currentIndex || index < 0 || index >= slides.length) {
                    return;
                }

                slides[currentIndex].classList.remove('active');
                if (dots[currentIndex]) {
                    dots[currentIndex].classList.remove('active');
                    dots[currentIndex].classList.remove('bg-white/80');
                    dots[currentIndex].classList.add('bg-white/50');
                }

                currentIndex = index;
                slides[currentIndex].classList.add('active');

                if (dots[currentIndex]) {
                    dots[currentIndex].classList.add('active');
                    dots[currentIndex].classList.remove('bg-white/50');
                    dots[currentIndex].classList.add('bg-white/80');
                }
            }

            function nextSlide() {
                var nextIndex = (currentIndex + 1) % slides.length;
                showSlide(nextIndex);
            }

            function startAutoplay() {
                if (slides.length < 2) {
                    return;
                }

                stopAutoplay();
                timer = setInterval(nextSlide, interval);
            }

            function stopAutoplay() {
                if (timer) {
                    clearInterval(timer);
                    timer = null;
                }
            }

            dots.forEach(function (dot, dotIndex) {
                dot.addEventListener('click', function () {
                    showSlide(dotIndex);
                    startAutoplay();
                });
            });

            carousel.addEventListener('mouseenter', stopAutoplay);
            carousel.addEventListener('mouseleave', startAutoplay);

            startAutoplay();
        });
    }

    initServiceCarousels();

    // === Reviews Data and Carousel Logic ===
    var reviewsData = [
        {
            stars: 5,
            text: '"Excelente atención, muy buena calidad de los productos y rapidez en la entrega. Super recomendables!"',
            author: 'Ayelen de los Ángeles Rodriguez',
            role: 'Cliente Verificado',
            initials: 'AR',
            avatarColor: 'bg-blue-300',
            initialsColor: 'text-blue-600',
            ringColor: 'ring-white dark:ring-blue-700'
        },
        {
            stars: 5,
            text: '"El grabado láser en los mates quedó increíble. Un detalle único para mi empresa. ¡Volveré a comprar!"',
            author: 'Juan Pablo Martinez',
            role: 'Cliente Corporativo',
            initials: 'JP',
            avatarColor: 'bg-gray-300',
            initialsColor: 'text-gray-600',
            ringColor: 'ring-white dark:ring-gray-700'
        },
        {
            stars: 4.5,
            text: '"Pedí unas gorras personalizadas para mi banda y quedaron brutales. La tela y el bordado de diez."',
            author: 'Matías Gomez',
            role: 'Músico',
            initials: 'MG',
            avatarColor: 'bg-gray-300',
            initialsColor: 'text-gray-600',
            ringColor: 'ring-white dark:ring-gray-700'
        }
    ];

    // Function to generate star rating HTML
    function generateStars(rating) {
        var starsHTML = '';
        var fullStars = Math.floor(rating);
        var hasHalfStar = rating % 1 !== 0;

        for (var i = 0; i < fullStars; i++) {
            starsHTML += '<span class="material-icons text-yellow-400 text-sm">star</span>';
        }

        if (hasHalfStar) {
            starsHTML += '<span class="material-icons text-yellow-400 text-sm">star_half</span>';
        }

        return starsHTML;
    }

    // Function to generate review HTML
    function generateReviewHTML(review, isActive) {
        var activeClass = isActive ? ' active' : '';
        return '<div class="review-slide' + activeClass + '">' +
            '<div class="flex items-center mb-4">' +
            generateStars(review.stars) +
            '</div>' +
            '<p class="text-gray-700 dark:text-gray-300 italic mb-6 text-lg">' + review.text + '</p>' +
            '<div class="flex items-center">' +
            '<div class="w-10 h-10 rounded-full ' + review.avatarColor + ' overflow-hidden mr-3 ring-2 ' + review.ringColor + ' flex items-center justify-center ' + review.initialsColor + ' font-bold">' +
            review.initials +
            '</div>' +
            '<div>' +
            '<p class="font-bold text-gray-900 dark:text-white text-sm">' + review.author + '</p>' +
            '<p class="text-xs text-gray-500">' + review.role + '</p>' +
            '</div>' +
            '</div>' +
            '</div>';
    }

    // Render reviews into the container
    var reviewsContainer = document.getElementById('reviews-container');
    if (reviewsContainer && reviewsData.length > 0) {
        var reviewsHTML = '';
        reviewsData.forEach(function (review, index) {
            reviewsHTML += generateReviewHTML(review, index === 0);
        });
        reviewsContainer.innerHTML = reviewsHTML;

        // Initialize carousel after rendering
        var reviews = document.querySelectorAll('.review-slide');
        var currentReview = 0;

        if (reviews.length > 1) {
            function getRandomIndex(excludeIndex) {
                var next;
                do {
                    next = Math.floor(Math.random() * reviews.length);
                } while (next === excludeIndex);
                return next;
            }

            function showReview(newIndex) {
                if (newIndex === currentReview) return;

                // Fade out current
                reviews[currentReview].classList.remove('active');

                // After the CSS fade-out transition ends, fade in the new one
                setTimeout(function () {
                    currentReview = newIndex;
                    reviews[currentReview].classList.add('active');
                }, 500); // matches the CSS transition duration
            }

            function nextRandomReview() {
                var randomIndex = getRandomIndex(currentReview);
                showReview(randomIndex);
            }

            setInterval(nextRandomReview, 30000);
        }
    }

});
