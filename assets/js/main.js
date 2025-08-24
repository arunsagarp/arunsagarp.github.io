// JavaScript to handle section visibility
document.addEventListener('DOMContentLoaded', function() {
    // Get all navigation links
    const navLinks = document.querySelectorAll('.main-header nav a');
    
    // Get all sections
    const sections = document.querySelectorAll('section');
    
    // Get the header title element
    const headerTitle = document.querySelector('.main-header h2');
    
    // Add click event listener to each navigation link
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all links
            navLinks.forEach(l => l.classList.remove('active'));
            
            // Add active class to clicked link
            this.classList.add('active');
            
            // Get the target section id
            const targetId = this.getAttribute('href').substring(1);
            
            // Update header title with fade effect
            headerTitle.style.opacity = '0';
            
            setTimeout(() => {
                // Update header title based on selected section
                switch(targetId) {
                    case 'about':
                        headerTitle.textContent = 'About';
                        break;
                    case 'resume':
                        headerTitle.textContent = 'Resume';
                        break;
                    case 'projects':
                        headerTitle.textContent = 'Projects';
                        break;
                    default:
                        headerTitle.textContent = 'About';
                }
                
                // Fade in the new title
                headerTitle.style.opacity = '1';
            }, 300); // Match this delay with the CSS transition time
            
            // Hide all sections
            sections.forEach(section => {
                section.style.display = 'none';
            });
            
            // Show the target section
            document.getElementById(targetId).style.display = 'block';
        });
    });
    
    // Show the About section by default
    sections.forEach(section => {
        if (section.id !== 'about') {
            section.style.display = 'none';
        }
    });
    document.getElementById('about').style.display = 'block';
    
    // Slideshow functionality
    function initSlideshows() {
        const slideshows = document.querySelectorAll('.slideshow');
        const modal = document.getElementById('slideshowModal');
        const modalImg = document.getElementById('slideshowModalImg');
        const modalClose = document.getElementById('slideshowModalClose');

        slideshows.forEach(slideshow => {
            const slides = slideshow.querySelectorAll('.slideshow-slide');
            const dots = slideshow.querySelectorAll('.slideshow-dot');
            const projectId = slideshow.getAttribute('data-project');
            let currentSlide = 0;
            let slideInterval;

            // Function to change slide
            function goToSlide(n) {
                slides.forEach(slide => slide.classList.remove('active'));
                dots.forEach(dot => dot.classList.remove('active'));
                slides[n].classList.add('active');
                dots[n].classList.add('active');
                currentSlide = n;
            }

            function nextSlide() {
                const next = (currentSlide + 1) % slides.length;
                goToSlide(next);
            }

            function startSlideShow() {
                slideInterval = setInterval(nextSlide, 2000);
            }

            // Do not pause slideshow on hover anymore
            // slideshow.addEventListener('mouseenter', () => {
            //     clearInterval(slideInterval);
            // });
            // slideshow.addEventListener('mouseleave', () => {
            //     startSlideShow();
            // });

            dots.forEach((dot, index) => {
                dot.addEventListener('click', () => {
                    goToSlide(index);
                });
            });


            // Add click event to slides for modal popup (slideshow keeps running)
            slides.forEach((slide) => {
                slide.style.cursor = 'pointer';
                slide.addEventListener('click', (e) => {
                    e.stopPropagation(); // Prevent bubbling
                    const imgSrc = slide.getAttribute('data-img');
                    if (imgSrc) {
                        modalImg.src = imgSrc;
                        modal.classList.add('active');
                    }
                });
            });

            startSlideShow();
        });

        // Modal close logic (slideshow keeps running)
        if (modal && modalClose) {
            modalClose.addEventListener('click', () => {
                modal.classList.remove('active');
                modalImg.src = '';
            });
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.classList.remove('active');
                    modalImg.src = '';
                }
            });
        }
    }
    
    // Initialize slideshows when the projects section is visible
    const projectsLink = document.querySelector('a[href="#projects"]');
    projectsLink.addEventListener('click', () => {
        // Use setTimeout to ensure the projects section is visible before initializing slideshows
        setTimeout(initSlideshows, 100);
    });
    
    // If projects section is visible by default, initialize slideshows
    if (document.getElementById('projects').style.display === 'block') {
        initSlideshows();
    }
});
