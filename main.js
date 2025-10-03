
document.addEventListener('DOMContentLoaded', function() {
    const menuBtn = document.querySelector('.menu-btn');
    const navLinks = document.querySelector('.nav-links');
    const backToTopBtn = document.getElementById('back-to-top-btn');

    // Sticky navbar and Back to Top button functionality
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        const sticky = navbar.offsetTop;
        window.onscroll = function() {
            // Sticky navbar
            if (window.pageYOffset >= sticky) {
                navbar.classList.add('sticky');
            } else {
                navbar.classList.remove('sticky');
            }

            // Back to top button
            if (backToTopBtn) {
                if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
                    backToTopBtn.style.display = "block";
                } else {
                    backToTopBtn.style.display = "none";
                }
            }
        };
    }

    // Hamburger menu functionality
    if (menuBtn && navLinks) {
        menuBtn.addEventListener('click', function() {
            navLinks.classList.toggle('mobile-menu');
        });
    }

    // Back to top button click event
    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', function() {
            document.body.scrollTop = 0; // For Safari
            document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
        });
    }
});
