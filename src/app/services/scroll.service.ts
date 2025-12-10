// scroll.service.ts (actualizado)
import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class ScrollService {
  
  constructor(@Inject(PLATFORM_ID) private platformId: any) {}

  scrollToSection(sectionId: string): void {
    if (isPlatformBrowser(this.platformId)) {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      }
    }
  }

  // En scroll.service.ts - actualiza el método checkScroll
checkScroll(revealClass: string = 'revealed'): void {
  if (isPlatformBrowser(this.platformId)) {
    // Seleccionar elementos de todos los componentes (incluyendo los específicos del hero)
    const elements = document.querySelectorAll(
      `.hero-badge, .hero-title, .title-line, .hero-subtitle, .hero-description, ` +
      `.hero-divider, .hero-actions, .hero-stats, .image-frame, .frame-corner, .hero-image, ` +
      `.section-divider, .section-header, .about-text, .skill-category, ` +
      `.skill-item, .specialty-item, .project-card, .contact-text, ` +
      `.contact-link, .footer, .title-ornament, .category-line, .card-line, ` +
      `.footer-ornament, .project-header, .project-line, .tech-item`
    );

    elements.forEach(element => {
      const elementTop = element.getBoundingClientRect().top;
      const elementBottom = element.getBoundingClientRect().bottom;
      const windowHeight = window.innerHeight;

      if (elementTop < windowHeight * 0.85 && elementBottom > 0) {
        element.classList.add(revealClass);
      } else if (elementBottom < 0 || elementTop > windowHeight) {
        element.classList.remove(revealClass);
      }
    });
  }
}
}