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
    var mobileMenuPanel = document.getElementById('mobile-menu-panel');
    var mobileMenuClose = document.getElementById('mobile-menu-close');
    var mobileMenuOverlay = document.getElementById('mobile-menu-overlay');
    var mobileMenuLinks = document.querySelectorAll('#mobile-menu-panel a');

    function openMobileMenu() {
        mobileMenu.classList.remove('hidden');
        setTimeout(function () {
            mobileMenuPanel.classList.remove('translate-x-full');
        }, 10);
    }

    function closeMobileMenu() {
        mobileMenuPanel.classList.add('translate-x-full');
        setTimeout(function () {
            mobileMenu.classList.add('hidden');
        }, 300);
    }

    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', openMobileMenu);
    }

    if (mobileMenuClose) {
        mobileMenuClose.addEventListener('click', closeMobileMenu);
    }

    if (mobileMenuOverlay) {
        mobileMenuOverlay.addEventListener('click', closeMobileMenu);
    }

    // Close mobile menu when clicking on a link
    mobileMenuLinks.forEach(function (link) {
        link.addEventListener('click', closeMobileMenu);
    });

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
