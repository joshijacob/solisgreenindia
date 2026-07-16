import sys

css = """
/* ========== PREMIUM CTA COMPONENT ========== */
.premium-cta-section {
  padding: 60px 0;
  background-color: var(--light-bg);
}

.premium-cta-card {
  display: flex;
  background: linear-gradient(135deg, #0f3c27, #072617);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15);
  color: var(--white);
  align-items: center;
}

.premium-cta-image {
  flex: 0 0 40%;
  position: relative;
  overflow: hidden;
  min-height: 350px;
}

.premium-cta-image img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0.8;
}

/* Gradient overlay for smooth blending */
.premium-cta-image::after {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  width: 30%;
  background: linear-gradient(to right, transparent, #0f3c27);
}

.premium-cta-content {
  flex: 1;
  padding: 50px;
}

.premium-cta-content h3 {
  font-size: 2rem;
  margin-bottom: 15px;
  color: var(--white);
  line-height: 1.3;
}

.premium-cta-content p {
  font-size: 1.1rem;
  margin-bottom: 30px;
  color: rgba(255, 255, 255, 0.9);
  max-width: 90%;
}

.premium-cta-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
}

.pcta-btn {
  display: flex;
  align-items: center;
  padding: 12px 20px;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
  min-width: 180px;
}

.pcta-icon {
  font-size: 1.5rem;
  margin-right: 12px;
}

.pcta-text {
  display: flex;
  flex-direction: column;
}

.pcta-title {
  font-size: 1rem;
  line-height: 1.2;
}

.pcta-sub {
  font-size: 0.8rem;
  font-weight: 400;
  opacity: 0.9;
}

.pcta-btn-orange {
  background-color: var(--solis-orange);
  color: var(--white);
}

.pcta-btn-orange:hover {
  background-color: #e66a00;
  transform: translateY(-2px);
  color: var(--white);
}

.pcta-btn-green {
  background-color: #25D366;
  color: var(--white);
}

.pcta-btn-green:hover {
  background-color: #1ebe5d;
  transform: translateY(-2px);
  color: var(--white);
}

.pcta-btn-white {
  background-color: var(--white);
  color: var(--solis-dark);
}

.pcta-btn-white:hover {
  background-color: #f0f0f0;
  transform: translateY(-2px);
  color: var(--solis-dark);
}

/* Responsive */
@media (max-width: 992px) {
  .premium-cta-card {
    flex-direction: column;
  }
  
  .premium-cta-image {
    width: 100%;
    min-height: 250px;
  }
  
  .premium-cta-image::after {
    width: 100%;
    height: 30%;
    bottom: 0;
    top: auto;
    background: linear-gradient(to bottom, transparent, #0f3c27);
  }
  
  .premium-cta-content {
    padding: 40px 30px;
  }
}

@media (max-width: 576px) {
  .premium-cta-content h3 {
    font-size: 1.5rem;
  }
  
  .premium-cta-buttons {
    flex-direction: column;
  }
  
  .pcta-btn {
    width: 100%;
    justify-content: center;
  }
}
"""

with open(r'd:\Antigravity\solisgreenindia.in\style.css', 'a', encoding='utf-8') as f:
    f.write(css)

print("Appended premium CTA CSS to style.css.")
