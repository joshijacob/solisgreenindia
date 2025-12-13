// Pathanamthitta Page Enhancements

document.addEventListener("DOMContentLoaded", () => {

    // Fade-in Hero Animation
    const hero = document.querySelector(".pta-hero-content");
    if (hero) {
        hero.style.opacity = "0";
        hero.style.transition = "opacity 1.2s ease";
        setTimeout(() => { hero.style.opacity = "1"; }, 200);
    }

    // Smooth scroll for CTA buttons
    document.querySelectorAll(".pta-btn").forEach(btn => {
        btn.addEventListener("mouseenter", () => {
            btn.style.transform = "translateY(-3px)";
        });
        btn.addEventListener("mouseleave", () => {
            btn.style.transform = "translateY(0)";
        });
    });

});
