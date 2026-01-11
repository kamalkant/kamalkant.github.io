// ============================================
// MODERN MEDICARE WEBSITE - JAVASCRIPT
// ============================================

// Wait for DOM to be fully loaded
document.addEventListener("DOMContentLoaded", function () {
  // ============================================
  // MOBILE MENU TOGGLE
  // ============================================
  const mobileMenuToggle = document.querySelector(".mobile-menu-toggle");
  const navMenu = document.querySelector(".nav-menu");

  if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener("click", function () {
      this.classList.toggle("active");
      navMenu.classList.toggle("active");
    });

    // Close menu when clicking on a nav link
    const navLinks = document.querySelectorAll(".nav-link");
    navLinks.forEach((link) => {
      link.addEventListener("click", function () {
        mobileMenuToggle.classList.remove("active");
        navMenu.classList.remove("active");
      });
    });
  }

  // ============================================
  // SMOOTH SCROLLING FOR NAVIGATION LINKS
  // ============================================
  const scrollLinks = document.querySelectorAll('a[href^="#"]');

  scrollLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const targetId = this.getAttribute("href");

      if (targetId === "#") return;

      const targetSection = document.querySelector(targetId);

      if (targetSection) {
        const headerOffset = 80;
        const elementPosition = targetSection.getBoundingClientRect().top;
        const offsetPosition =
          elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });
      }
    });
  });

  // ============================================
  // HEADER SCROLL EFFECT
  // ============================================
  const header = document.querySelector(".header");

  window.addEventListener("scroll", function () {
    if (window.scrollY > 50) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  });

  // ============================================
  // FAQ ACCORDION
  // ============================================
  const faqItems = document.querySelectorAll(".faq-item");

  faqItems.forEach((item) => {
    const question = item.querySelector(".faq-question");

    question.addEventListener("click", function () {
      // Close other open items
      faqItems.forEach((otherItem) => {
        if (otherItem !== item && otherItem.classList.contains("active")) {
          otherItem.classList.remove("active");
        }
      });

      // Toggle current item
      item.classList.toggle("active");
    });
  });

  // ============================================
  // SCROLL TO TOP BUTTON
  // ============================================
  const scrollTopBtn = document.querySelector(".scroll-top");

  if (scrollTopBtn) {
    window.addEventListener("scroll", function () {
      if (window.scrollY > 300) {
        scrollTopBtn.classList.add("visible");
      } else {
        scrollTopBtn.classList.remove("visible");
      }
    });

    scrollTopBtn.addEventListener("click", function () {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    });
  }

  // ============================================
  // INTERSECTION OBSERVER FOR FADE-IN ANIMATIONS
  // ============================================
  const observerOptions = {
    threshold: 0.05,
    rootMargin: "0px 0px 0px 0px",
  };

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        
        // Add staggered animation for cards within the same container
        if (entry.target.classList.contains("card-grid")) {
          const cards = entry.target.querySelectorAll(".glass-card");
          cards.forEach((card, index) => {
            setTimeout(() => {
              card.classList.add("visible");
            }, index * 100);
          });
        }
      }
    });
  }, observerOptions);

  // Observe all fade-in elements
  const fadeElements = document.querySelectorAll(".fade-in");
  fadeElements.forEach((element) => {
    observer.observe(element);
  });
  
  // Observe card grids for staggered animations
  const cardGrids = document.querySelectorAll(".card-grid");
  cardGrids.forEach((grid) => {
    observer.observe(grid);
  });

  // ============================================
  // FORM VALIDATION
  // ============================================
  const quoteForm = document.querySelector(".quote-form");

  if (quoteForm) {
    quoteForm.addEventListener("submit", function (e) {
      e.preventDefault();

      // Get form values
      const name = document.getElementById("name").value.trim();
      const email = document.getElementById("email").value.trim();
      const phone = document.getElementById("phone").value.trim();
      const insuranceType = document.getElementById("insurance-type").value;
      const message = document.getElementById("message").value.trim();

      // Simple validation
      let isValid = true;
      let errorMessage = "";

      if (name === "") {
        isValid = false;
        errorMessage += "Please enter your name.\\n";
      }

      if (email === "") {
        isValid = false;
        errorMessage += "Please enter your email.\\n";
      } else if (!isValidEmail(email)) {
        isValid = false;
        errorMessage += "Please enter a valid email address.\\n";
      }

      if (phone === "") {
        isValid = false;
        errorMessage += "Please enter your phone number.\\n";
      }

      if (insuranceType === "") {
        isValid = false;
        errorMessage += "Please select an insurance type.\\n";
      }

      if (isValid) {
        // Show success message
        alert("Thank you for your interest! We will contact you shortly.");
        quoteForm.reset();
      } else {
        alert(errorMessage);
      }
    });
  }

  // Email validation helper function
  function isValidEmail(email) {
    const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
    return emailRegex.test(email);
  }

  // ============================================
  // DYNAMIC CARD ANIMATIONS
  // ============================================
  const cards = document.querySelectorAll(".glass-card");

  cards.forEach((card, index) => {
    card.style.animationDelay = `${index * 0.1}s`;
  });

  // ============================================
  // PARALLAX EFFECT FOR HERO
  // ============================================
  let ticking = false;
  
  window.addEventListener("scroll", function () {
    if (!ticking) {
      window.requestAnimationFrame(function() {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector(".hero");

        if (hero) {
          // Parallax effect
          hero.style.transform = `translateY(${scrolled * 0.3}px)`;
          
          // Fade out effect as user scrolls down
          const opacity = Math.max(1 - scrolled / 600, 0);
          hero.style.opacity = opacity;
        }
        
        ticking = false;
      });
      
      ticking = true;
    }
  });
  
  // ============================================
  // SMOOTH SCROLL REVEAL FOR SECTIONS
  // ============================================
  const sections = document.querySelectorAll(".section");
  
  const sectionObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = "1";
          entry.target.style.transform = "translateY(0)";
        }
      });
    },
    {
      threshold: 0.05,
      rootMargin: "0px 0px 50px 0px",
    }
  );
  
  sections.forEach((section) => {
    section.style.opacity = "0";
    section.style.transform = "translateY(30px)";
    section.style.transition = "opacity 0.4s ease-out, transform 0.4s ease-out";
    sectionObserver.observe(section);
  });
});
