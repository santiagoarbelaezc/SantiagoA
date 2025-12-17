// navbar.component.ts - VERSIÓN CON ALTURAS DEFINIDAS PARA DESKTOP
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, HostListener, OnInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
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
  private lastScrollTop = 0;
  private scrollTimeout: any;
  private resizeTimeout: any;
  private currentSectionElement: HTMLElement | null = null;

  // Definir las secciones principales para el navbar
  mainSections = [
    { 
      id: 'profilex', 
      name: 'Profile X', 
      external: true, 
      url: '/profile-x'
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

  constructor(
    private scrollColorService: ScrollColorService,
    private router: Router,
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
      
      // Inicializar el estado del scroll
      this.checkScroll();
      // Obtener referencia a las secciones una vez al inicio
      this.cacheSectionElements();
    }
  }

  ngOnDestroy() {
    if (this.colorSubscription) {
      this.colorSubscription.unsubscribe();
    }
    if (this.scrollTimeout) {
      clearTimeout(this.scrollTimeout);
    }
    if (this.resizeTimeout) {
      clearTimeout(this.resizeTimeout);
    }
  }

  // Cachear referencias a elementos de sección para mejor performance
  private cacheSectionElements() {
    if (!this.isBrowser) return;
    
    this.currentSectionElement = document.getElementById('hero');
  }

  @HostListener('window:scroll')
  onWindowScroll() {
    if (!this.isBrowser) return;
    
    // Usar debounce para mejor rendimiento
    if (this.scrollTimeout) {
      clearTimeout(this.scrollTimeout);
    }
    
    this.scrollTimeout = setTimeout(() => {
      this.checkScroll();
    }, 10);
  }

  @HostListener('window:resize')
  onWindowResize() {
    if (!this.isBrowser) return;
    
    // Debounce para resize
    if (this.resizeTimeout) {
      clearTimeout(this.resizeTimeout);
    }
    
    this.resizeTimeout = setTimeout(() => {
      // Cerrar menú en desktop
      if (window.innerWidth > 768) {
        this.closeMenu();
      }
      // Recachear elementos si cambia el tamaño
      this.cacheSectionElements();
    }, 150);
  }

  private checkScroll() {
    if (!this.isBrowser) return;
    
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    // Determinar si está scrolled con umbral más bajo para responsive
    const scrollThreshold = this.isMobileView() ? 5 : 10;
    this.isScrolled = scrollTop > scrollThreshold;
    
    // Guardar la última posición del scroll
    this.lastScrollTop = scrollTop;
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
    
    // Prevenir scroll del body cuando el menú está abierto
    if (this.isBrowser) {
      if (this.isMenuOpen) {
        document.body.classList.add('menu-open');
        document.body.style.overflow = 'hidden';
      } else {
        document.body.classList.remove('menu-open');
        document.body.style.overflow = '';
      }
    }
  }

  closeMenu() {
    this.isMenuOpen = false;
    
    // Remover clase del body
    if (this.isBrowser) {
      document.body.classList.remove('menu-open');
      document.body.style.overflow = '';
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
      // Calcular la posición considerando el navbar fijo
      const navbarHeight = this.isMobileView() ? 60 : 70; // Diferente altura para móvil
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navbarHeight;

      window.scrollTo({
        top: offsetPosition,
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

  // NUEVO MÉTODO MEJORADO: Detección de sección optimizada para responsive
  getSectionClass(): string {
    if (!this.isBrowser) return 'navbar-white';
    
    const scrollPosition = window.pageYOffset;
    
    // Si estamos en móvil, usar lógica simplificada pero precisa
    if (this.isMobileView()) {
      return this.getMobileSectionClass(scrollPosition);
    }
    
    // Para desktop, usar lógica con alturas definidas
    return this.getDesktopSectionClass(scrollPosition);
  }

  private getMobileSectionClass(scrollPosition: number): string {
    // En móvil, usar offsets fijos para mejor performance
    // Estos valores se basan en las alturas típicas de las secciones en responsive
    
    // Alturas aproximadas en móvil (ajustar según tu diseño)
    const mobileHeroHeight = window.innerHeight * 1.5; // Hero ocupa 80% de la pantalla
    const mobileAboutHeight = window.innerHeight * 1.2; // About más alto
    
    if (scrollPosition < mobileHeroHeight) {
      return 'navbar-white';
    } else if (scrollPosition < mobileHeroHeight + mobileAboutHeight) {
      return 'navbar-brown';
    } else {
      return 'navbar-black';
    }
  }

  private getDesktopSectionClass(scrollPosition: number): string {
    // ALTURAS DEFINIDAS PARA DESKTOP (ajusta estos valores según tu diseño real)
    
    // Hero: desde 0 hasta 1000px aprox
    // About: desde 1000px hasta 1800px aprox  
    // Projects: desde 1800px en adelante
    
    const heroEnd = 840;       // Fin del hero
    const aboutEnd = 1800;      // Fin del about
    
    // Si estamos cerca del top (en el hero)
    if (scrollPosition < heroEnd) {
      return 'navbar-white';
    }
    
    // Si estamos en about section
    if (scrollPosition < aboutEnd) {
      return 'navbar-brown';
    }
    
    // Si estamos en projects o más abajo
    return 'navbar-black';
  }

  // Versión alternativa con márgenes para transición suave
  private getDesktopSectionClassWithMargins(scrollPosition: number): string {
    // ALTURAS DEFINIDAS PARA DESKTOP CON MÁRGENES DE TRANSICIÓN
    
    // Hero: desde 0 hasta 1000px aprox
    // About: desde 1000px hasta 1800px aprox  
    // Projects: desde 1800px en adelante
    
    const heroEnd = 1000;       // Fin del hero
    const aboutEnd = 1800;      // Fin del about
    const transitionMargin = 150; // Margen para transición suave
    
    // Si estamos en el hero (con margen para transición suave)
    if (scrollPosition < heroEnd - transitionMargin) {
      return 'navbar-white';
    }
    
    // Zona de transición entre hero y about
    if (scrollPosition < heroEnd + transitionMargin) {
      // Mezcla de blanco y café durante la transición
      // Podrías hacerlo más complejo si quieres, pero por simplicidad:
      return scrollPosition < heroEnd ? 'navbar-white' : 'navbar-brown';
    }
    
    // Si estamos en about (excluyendo zona de transición)
    if (scrollPosition < aboutEnd - transitionMargin) {
      return 'navbar-brown';
    }
    
    // Zona de transición entre about y projects
    if (scrollPosition < aboutEnd + transitionMargin) {
      // Mezcla de café y negro durante la transición
      return scrollPosition < aboutEnd ? 'navbar-brown' : 'navbar-black';
    }
    
    // Si estamos en projects o más abajo
    return 'navbar-black';
  }

  // Método simplificado para el color de fondo
  getNavbarBackground(): string {
    // La capa sólida se encarga del fondo en móvil sin scroll
    if (!this.isScrolled && this.isMobileView()) {
      return 'transparent';
    }
    
    if (!this.isScrolled) {
      return 'transparent';
    }
    
    // Usar la misma lógica que getSectionClass
    const sectionClass = this.getSectionClass();
    
    switch(sectionClass) {
      case 'navbar-white':
        return 'rgba(255, 255, 255, 0.95)';
      case 'navbar-brown':
        return 'rgba(151, 75, 24, 0.95)';
      case 'navbar-black':
        return 'rgba(0, 0, 0, 0.95)';
      default:
        return 'rgba(255, 255, 255, 0.95)';
    }
  }

  // Método simplificado para obtener el color del borde
  getBorderColor(): string {
    if (!this.isScrolled) {
      return 'transparent';
    }
    
    const sectionClass = this.getSectionClass();
    
    switch(sectionClass) {
      case 'navbar-white':
        return 'rgba(0, 0, 0, 0.1)';
      case 'navbar-brown':
        return 'rgba(255, 255, 255, 0.15)';
      case 'navbar-black':
        return 'rgba(255, 255, 255, 0.1)';
      default:
        return 'transparent';
    }
  }

  // Método para determinar si estamos en vista móvil
  isMobileView(): boolean {
    if (!this.isBrowser) return false;
    return window.innerWidth <= 768;
  }
}