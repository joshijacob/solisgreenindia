import re
import sys

css_path = r'd:\Antigravity\solisgreenindia.in\style.css'
css = open(css_path, encoding='utf-8').read()

# Replace .premium-cta-card
old_card = """.premium-cta-card {
  display: flex;
  background: linear-gradient(135deg, #0f3c27, #072617);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15);
  color: var(--white);
  align-items: center;
}"""
new_card = """.premium-cta-card {
  display: flex;
  background: linear-gradient(135deg, #0f3c27, #072617);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  color: var(--white);
  align-items: stretch;
}"""
css = css.replace(old_card, new_card)

# Replace .premium-cta-image
old_img = """.premium-cta-image {
  flex: 0 0 40%;
  position: relative;
  overflow: hidden;
  min-height: 350px;
}"""
new_img = """.premium-cta-image {
  flex: 0 0 25%;
  position: relative;
  overflow: hidden;
  min-height: 120px;
}"""
css = css.replace(old_img, new_img)

# Replace .premium-cta-content
old_content = """.premium-cta-content {
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
}"""
new_content = """.premium-cta-content {
  flex: 1;
  padding: 25px 40px;
  display: grid;
  grid-template-columns: 1fr auto;
  grid-template-areas: 
    "title buttons"
    "desc buttons";
  gap: 8px 30px;
  align-items: center;
}

.premium-cta-content h3 {
  grid-area: title;
  font-size: 1.4rem;
  margin-bottom: 0;
  color: var(--white);
  line-height: 1.2;
}

.premium-cta-content p {
  grid-area: desc;
  font-size: 0.95rem;
  margin-bottom: 0;
  color: rgba(255, 255, 255, 0.9);
  max-width: 100%;
}

.premium-cta-buttons {
  grid-area: buttons;
  display: flex;
  flex-wrap: nowrap;
  gap: 15px;
}"""
css = css.replace(old_content, new_content)

# Replace buttons
old_btn = """.pcta-btn {
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
}"""
new_btn = """.pcta-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px 16px;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
  min-width: 150px;
}

.pcta-icon {
  font-size: 1.2rem;
  margin-right: 10px;
}

.pcta-text {
  display: flex;
  flex-direction: column;
}

.pcta-title {
  font-size: 0.9rem;
  line-height: 1.2;
}"""
css = css.replace(old_btn, new_btn)

# Responsive
old_media = """@media (max-width: 992px) {
  .premium-cta-card {
    flex-direction: column;
  }
  
  .premium-cta-image {
    width: 100%;
    min-height: 250px;
  }
  
  .premium-cta-content {
    padding: 30px;
  }
  
  .premium-cta-buttons {
    justify-content: center;
  }
}"""
new_media = """@media (max-width: 992px) {
  .premium-cta-card {
    flex-direction: column;
  }
  
  .premium-cta-image {
    width: 100%;
    min-height: 200px;
  }
  
  .premium-cta-content {
    padding: 30px;
    grid-template-columns: 1fr;
    grid-template-areas: 
      "title"
      "desc"
      "buttons";
    text-align: center;
    gap: 15px;
  }
  
  .premium-cta-buttons {
    flex-wrap: wrap;
    justify-content: center;
  }
}"""
if old_media in css:
    css = css.replace(old_media, new_media)
else:
    # try regex because of spacing issues
    css = re.sub(r'@media \(max-width: 992px\) \{.*?\.premium-cta-buttons \{\s*justify-content: center;\s*\}\s*\}', new_media, css, flags=re.DOTALL)

open(css_path, 'w', encoding='utf-8').write(css)
print("Updated CSS successfully")
