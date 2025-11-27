import { Component, OnInit, HostListener } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  ngOnInit() {
    // Inicializar las animaciones al cargar la página
    setTimeout(() => {
      this.checkScroll();
    }, 100);
  }

  @HostListener('window:scroll')
  onWindowScroll() {
    this.checkScroll();
  }

  scrollToSection(sectionId: string): void {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  }

  private checkScroll() {
    const elements = document.querySelectorAll(
      '.hero-title, .hero-subtitle, .hero-line, .hero-actions, .hero-image, ' +
      '.section-divider, .section-header, .about-text, .skill-category, ' +
      '.project-card, .contact-text, .contact-link, .footer'
    );

    elements.forEach(element => {
      const elementTop = element.getBoundingClientRect().top;
      const elementBottom = element.getBoundingClientRect().bottom;
      const windowHeight = window.innerHeight;

      // Revelar elemento cuando está en el viewport
      if (elementTop < windowHeight * 0.85 && elementBottom > 0) {
        element.classList.add('revealed');
      }
      
      // Opcional: Ocultar de nuevo cuando sale del viewport (para scroll up/down)
      else if (elementBottom < 0 || elementTop > windowHeight) {
        element.classList.remove('revealed');
      }
    });
  }
}