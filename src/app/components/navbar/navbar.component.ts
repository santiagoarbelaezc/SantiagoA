// navbar.component.ts
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, HostListener, OnInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router'; // ← Añadir Router
import { ScrollColorService } from '../../services/scroll-color.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, OnDestroy {
  isScrolled = false;
  isMenuOpen = false;
  currentBackground = '#FFFFFF';
  
  // SIEMPRE mostrar Portafolio como activa mientras estemos en esta app
  currentSection = 'projects'; 
  
  private colorSubscription!: Subscription;
  private isBrowser: boolean;

  // Definir las secciones principales para el navbar
  mainSections = [
    { 
      id: 'profilex', 
      name: 'Profile X', 
      external: true, 
      url: '/profile-x' // ← URL corregida
    },
    { 
      id: 'projects', 
      name: 'Portafolio', 
      external: false 
    }
  ];

  // Productos
  products = [
    { id: 'capturex', name: 'CaptureX', external: true, url: 'https://capturex.com' },
    { id: 'findlink', name: 'FindLink', external: true, url: 'https://findlink.com' }
  ];

  // Redes sociales
  socialNetworks = [
     { id: 'github', name: 'GitHub', external: true, url: 'https://github.com/santiagoarbelaezc' },
    { id: 'linkedin', name: 'LinkedIn', external: true, url: 'https://www.linkedin.com/in/santiago-arbelaez-contreras-9830b5290/' },
    { id: 'instagram', name: 'Instagram', external: true, url: 'https://www.instagram.com/santiago_arbelaezc/' },
    { id: 'whatsapp', name: 'WhatsApp', external: true, url: 'https://wa.me/tu-numero' }
  ];

  // Colores manuales basados en tu sistema
  private sectionColors: { [key: string]: string } = {
    'hero': '#FFFFFF',      // Blanco
    'about': '#8B4513',     // Café
    'projects': '#000000',  // Negro
    'contact': '#000000',   // Negro
    'footer': '#000000'     // Negro
  };

  constructor(
    private scrollColorService: ScrollColorService,
    private router: Router, // ← Inyectar Router
    @Inject(PLATFORM_ID) private platformId: any
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit() {
    // Suscribirse a los cambios de color del fondo
    if (this.isBrowser) {
      this.colorSubscription = this.scrollColorService.currentColor$.subscribe(color => {
        this.currentBackground = color;
      });
    }
  }

  ngOnDestroy() {
    if (this.colorSubscription) {
      this.colorSubscription.unsubscribe();
    }
  }

  @HostListener('window:scroll')
  onWindowScroll() {
    if (!this.isBrowser) return;
    
    this.isScrolled = window.scrollY > 50;
    // NO actualizamos la sección activa basada en scroll
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
    
    // Prevenir scroll del body cuando el menú está abierto
    if (this.isBrowser) {
      if (this.isMenuOpen) {
        document.body.classList.add('menu-open');
      } else {
        document.body.classList.remove('menu-open');
      }
    }
  }

  closeMenu() {
    this.isMenuOpen = false;
    
    // Remover clase del body
    if (this.isBrowser) {
      document.body.classList.remove('menu-open');
    }
  }

  @HostListener('window:resize')
  onWindowResize() {
    if (this.isBrowser && window.innerWidth > 768) {
      this.closeMenu();
    }
  }

  // Método para verificar si una sección está activa
  isActiveSection(sectionId: string): boolean {
    // Solo "Portafolio" está activa mientras estemos en esta aplicación
    return sectionId === 'projects';
  }

  // Método para navegar suavemente a una sección
  scrollToSection(sectionId: string, event: Event): void {
    event.preventDefault();
    this.closeMenu();
    
    if (!this.isBrowser) return;

    const element = document.getElementById(sectionId);
    if (element) {
      const offsetTop = element.getBoundingClientRect().top + window.pageYOffset;
      window.scrollTo({
        top: offsetTop - 80,
        behavior: 'smooth'
      });
    }
  }

  // Método para abrir enlaces externos
  openExternalLink(url: string, event: Event): void {
    event.preventDefault();
    this.closeMenu();
    
    if (this.isBrowser) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  }

  // Método para manejar clics en secciones (internas o externas)
  handleSectionClick(section: any, event: Event): void {
    event.preventDefault();
    this.closeMenu();
    
    if (section.external) {
      // Es un enlace externo - verificar si es ruta interna o externa real
      if (section.url.startsWith('/')) {
        // Es una ruta interna de Angular - usar Router
        this.router.navigate([section.url]);
      } else {
        // Es un enlace externo real - abrir en nueva pestaña
        if (this.isBrowser) {
          window.open(section.url, '_blank', 'noopener,noreferrer');
        }
      }
    } else {
      // Es una sección interna - hacer scroll suave
      this.scrollToSection(section.id, event);
    }
  }

  // Obtener el color de fondo basado en la sección actual
  getNavbarBackground(): string {
    if (!this.isScrolled) {
      return 'transparent';
    }

    // Usar colores manuales según la sección actual del scroll
    // Esto mantiene el cambio de color dinámico mientras "Portafolio" siempre está activa
    const scrollPosition = this.isBrowser ? window.pageYOffset + (window.innerHeight / 2) : 0;
    
    // Determinar el color basado en la posición del scroll
    if (scrollPosition < 500) {
      return 'rgba(255, 255, 255, 0.9)'; // Hero - Blanco
    } else if (scrollPosition < 1500) {
      return 'rgba(59, 29, 9, 0.9)'; // About - Café
    } else {
      return 'rgba(0, 0, 0, 0.9)'; // Projects/Contact - Negro
    }
  }

  // Obtener color del borde basado en la sección
  getBorderColor(): string {
    if (!this.isScrolled) {
      return 'transparent';
    }

    const scrollPosition = this.isBrowser ? window.pageYOffset + (window.innerHeight / 2) : 0;
    
    if (scrollPosition < 500) {
      return 'rgba(0, 0, 0, 0.1)'; // Hero - Blanco
    } else if (scrollPosition < 1500) {
      return 'rgba(255, 255, 255, 0.15)'; // About - Café
    } else {
      return 'rgba(255, 255, 255, 0.1)'; // Projects/Contact - Negro
    }
  }

  // Obtener clase CSS basada en la posición del scroll
  getSectionClass(): string {
    const scrollPosition = this.isBrowser ? window.pageYOffset + (window.innerHeight / 2) : 0;
    
    if (scrollPosition < 1300) {
      return 'navbar-white';
    } else if (scrollPosition < 2175) {
      return 'navbar-brown';
    } else {
      return 'navbar-black';
    }
  }
}