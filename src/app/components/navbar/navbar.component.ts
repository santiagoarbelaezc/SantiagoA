// navbar.component.ts - VERSIÓN CON CONFIGURACIÓN MANUAL DE ALTURAS
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, HostListener, OnInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';

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
  
  // Sección actual detectada por scroll
  currentSection = 'hero'; 
  
  // ===========================================
  // CONFIGURACIÓN DE ALTURAS - AJUSTA ESTOS VALORES
  // ===========================================
  
  // Configuración para DESKTOP (en píxeles)
  desktopConfig = {
    // Alturas de inicio/fin de cada sección
    sections: {
      hero: { start: 0, end: 1000 },           // Hero: 0px a 1000px
      todotech: { start: 1000, end: 2200 },    // TodoTech: 1000px a 2100px (+100px)
      plaxtilineas: { start: 2200, end: 4050 }, // Plaxtilineas: 2100px a 3400px (+600px)
      espumas: { start: 4050, end: 5600 },     // Espumas: 3400px a 4600px (+1000px)
      contact: { start: 5600, end: 6000 },     // Contacto: 4600px a 5200px
      footer: { start: 6000, end: 6400 }       // Footer: 5200px a 5600px
    },
    // Colores para cada sección
    colors: {
      hero: 'navbar-white',
      todotech: 'navbar-red',
      plaxtilineas: 'navbar-black',
      espumas: 'navbar-green',
      contact: 'navbar-black',
      footer: 'navbar-black'
    }
  };
  
  // Configuración para MÓVIL (en píxeles)
  mobileConfig = {
    // Alturas de inicio/fin de cada sección (más pequeñas)
    sections: {
      hero: { start: 0, end: 1500 },           // Hero: 0px a 700px
      todotech: { start: 1500, end: 2200 },    // TodoTech: 700px a 1800px (+100px)
      plaxtilineas: { start: 2200, end: 3400 }, // Plaxtilineas: 1800px a 3200px (+600px)
      espumas: { start: 3400, end: 4500 },    // Espumas: 3200px a 4000px (+1000px)
      contact: { start: 4500, end: 4600 },    // Contacto: 4000px a 4600px
      footer: { start: 4600, end: 5000 }      // Footer: 4600px a 5000px
    },
    // Colores para cada sección (pueden ser los mismos o diferentes)
    colors: {
      hero: 'navbar-white',
      todotech: 'navbar-red',
      plaxtilineas: 'navbar-black',
      espumas: 'navbar-green',
      contact: 'navbar-black',
      footer: 'navbar-black'
    }
  };
  
  // Margen para transición suave (en píxeles)
  transitionMargin = 150;
  
  // Opacidad del navbar cuando está scrolled (0-1)
  navbarOpacity = 0.95;
  
  // ===========================================
  // FIN DE CONFIGURACIÓN
  // ===========================================


  private isBrowser: boolean;
  private lastScrollTop = 0;
  private scrollTimeout: any;
  private resizeTimeout: any;

  // Definir las secciones principales para el navbar
  mainSections = [
    { id: 'hero', name: 'Portfolio', external: false },
    { id: 'todotech', name: 'Proyectos', external: false },
    { id: 'contact', name: 'Contacto', external: false }
  ];

  // Redes sociales
  socialNetworks = [
    { id: 'linkedin', name: 'LinkedIn', external: true, url: 'https://www.linkedin.com/in/santiago-arbelaez-contreras-9830b5290/' },
    { id: 'github', name: 'GitHub', external: true, url: 'https://github.com/santiagoarbelaezc' }
  ];

  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: any
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit() {
    // Inicializar el estado del scroll
    if (this.isBrowser) {
      this.checkScroll();
    }
  }

  ngOnDestroy() {
    if (this.scrollTimeout) {
      clearTimeout(this.scrollTimeout);
    }
    if (this.resizeTimeout) {
      clearTimeout(this.resizeTimeout);
    }
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
    }, 150);
  }

  private checkScroll() {
    if (!this.isBrowser) return;
    
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    // Determinar si está scrolled
    const scrollThreshold = this.isMobileView() ? 5 : 10;
    this.isScrolled = scrollTop > scrollThreshold;
    
    // Detectar sección actual y actualizar
    this.updateCurrentSection(scrollTop);
    
    // Guardar la última posición del scroll
    this.lastScrollTop = scrollTop;
  }

  // Método para detectar la sección actual basándose en el scroll
  private updateCurrentSection(scrollPosition: number): void {
    if (!this.isBrowser) return;
    
    const sectionClass = this.getSectionClass();
    
    // Encontrar qué sección corresponde a esta clase
    const config = this.isMobileView() ? this.mobileConfig : this.desktopConfig;
    for (const [sectionId, color] of Object.entries(config.colors)) {
      if (color === sectionClass) {
        this.currentSection = sectionId;
        break;
      }
    }
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
    return this.currentSection === sectionId;
  }

  // Método para navegar suavemente a una sección
  scrollToSection(sectionId: string, event: Event): void {
    event.preventDefault();
    this.closeMenu();
    
    if (!this.isBrowser) return;

    const element = document.getElementById(sectionId);
    if (element) {
      // Calcular la posición considerando el navbar fijo
      const navbarHeight = this.isMobileView() ? 60 : 70;
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

  // Método para manejar clics en secciones
  handleSectionClick(section: any, event: Event): void {
    event.preventDefault();
    this.closeMenu();
    
    if (section.external) {
      if (section.url.startsWith('/')) {
        this.router.navigate([section.url]);
      } else {
        if (this.isBrowser) {
          window.open(section.url, '_blank', 'noopener,noreferrer');
        }
      }
    } else {
      this.scrollToSection(section.id, event);
    }
  }

  // MÉTODO PRINCIPAL: Detección de sección con configuración manual
  getSectionClass(): string {
    if (!this.isBrowser) return 'navbar-white';
    
    const scrollPosition = window.pageYOffset;
    
    // Usar configuración diferente para móvil y desktop
    const config = this.isMobileView() ? this.mobileConfig : this.desktopConfig;
    const sections = config.sections;
    
    // Verificar en qué sección estamos
    if (scrollPosition < sections.hero.end - this.transitionMargin) {
      return config.colors.hero;
    }
    
    // Zona de transición entre hero y todotech
    if (scrollPosition < sections.hero.end + this.transitionMargin) {
      return scrollPosition < sections.hero.end ? config.colors.hero : config.colors.todotech;
    }
    
    // TodoTech section
    if (scrollPosition < sections.todotech.end - this.transitionMargin) {
      return config.colors.todotech;
    }
    
    // Zona de transición entre todotech y plaxtilineas
    if (scrollPosition < sections.todotech.end + this.transitionMargin) {
      return scrollPosition < sections.todotech.end ? config.colors.todotech : config.colors.plaxtilineas;
    }
    
    // Plaxtilineas section
    if (scrollPosition < sections.plaxtilineas.end - this.transitionMargin) {
      return config.colors.plaxtilineas;
    }
    
    // Zona de transición entre plaxtilineas y espumas
    if (scrollPosition < sections.plaxtilineas.end + this.transitionMargin) {
      return scrollPosition < sections.plaxtilineas.end ? config.colors.plaxtilineas : config.colors.espumas;
    }
    
    // Espumas section
    if (scrollPosition < sections.espumas.end - this.transitionMargin) {
      return config.colors.espumas;
    }
    
    // Zona de transición entre espumas y contact
    if (scrollPosition < sections.espumas.end + this.transitionMargin) {
      return scrollPosition < sections.espumas.end ? config.colors.espumas : config.colors.contact;
    }
    
    // Contact section
    if (scrollPosition < sections.contact.end - this.transitionMargin) {
      return config.colors.contact;
    }
    
    // Zona de transición entre contact y footer
    if (scrollPosition < sections.contact.end + this.transitionMargin) {
      return scrollPosition < sections.contact.end ? config.colors.contact : config.colors.footer;
    }
    
    // Footer o más abajo
    return config.colors.footer;
  }

  // Método para el color de fondo del navbar
  getNavbarBackground(): string {
    // Transparente cuando no hay scroll
    if (!this.isScrolled && this.isMobileView()) {
      return 'transparent';
    }
    
    if (!this.isScrolled) {
      return 'transparent';
    }
    
    // Obtener la clase de sección actual
    const sectionClass = this.getSectionClass();
    
    // Mapear la clase a un color con opacidad
    switch(sectionClass) {
      case 'navbar-white':
        return `rgba(255, 255, 255, ${this.navbarOpacity})`;
      case 'navbar-red':
        return `rgba(187, 20, 34, ${this.navbarOpacity})`;
      case 'navbar-black':
        return `rgba(0, 0, 0, ${this.navbarOpacity})`;
      case 'navbar-green':
        return `rgba(51, 174, 128, ${this.navbarOpacity})`;
      default:
        return `rgba(255, 255, 255, ${this.navbarOpacity})`;
    }
  }

  // Método para el color del borde
  getBorderColor(): string {
    if (!this.isScrolled) {
      return 'transparent';
    }
    
    const sectionClass = this.getSectionClass();
    
    switch(sectionClass) {
      case 'navbar-white':
        return 'rgba(0, 0, 0, 0.1)';
      case 'navbar-red':
        return 'rgba(255, 255, 255, 0.15)';
      case 'navbar-black':
        return 'rgba(255, 255, 255, 0.1)';
      case 'navbar-green':
        return 'rgba(255, 255, 255, 0.15)';
      default:
        return 'transparent';
    }
  }

  // Método para determinar si estamos en vista móvil
  isMobileView(): boolean {
    if (!this.isBrowser) return false;
    return window.innerWidth <= 768;
  }
  
  // ===========================================
  // MÉTODOS PARA AJUSTAR CONFIGURACIÓN EN TIEMPO REAL
  // ===========================================
  
  // Actualizar configuración de desktop
  updateDesktopConfig(newConfig: any): void {
    if (newConfig.sections) {
      this.desktopConfig.sections = { ...this.desktopConfig.sections, ...newConfig.sections };
    }
    if (newConfig.colors) {
      this.desktopConfig.colors = { ...this.desktopConfig.colors, ...newConfig.colors };
    }
  }
  
  // Actualizar configuración de móvil
  updateMobileConfig(newConfig: any): void {
    if (newConfig.sections) {
      this.mobileConfig.sections = { ...this.mobileConfig.sections, ...newConfig.sections };
    }
    if (newConfig.colors) {
      this.mobileConfig.colors = { ...this.mobileConfig.colors, ...newConfig.colors };
    }
  }
  
  // Actualizar alturas específicas
  updateDesktopSectionHeight(sectionId: string, start: number, end: number): void {
    if (this.desktopConfig.sections[sectionId as keyof typeof this.desktopConfig.sections]) {
      this.desktopConfig.sections[sectionId as keyof typeof this.desktopConfig.sections] = { start, end };
    }
  }
  
  updateMobileSectionHeight(sectionId: string, start: number, end: number): void {
    if (this.mobileConfig.sections[sectionId as keyof typeof this.mobileConfig.sections]) {
      this.mobileConfig.sections[sectionId as keyof typeof this.mobileConfig.sections] = { start, end };
    }
  }
  
  // Actualizar color de una sección
  updateDesktopSectionColor(sectionId: string, color: string): void {
    if (this.desktopConfig.colors[sectionId as keyof typeof this.desktopConfig.colors]) {
      this.desktopConfig.colors[sectionId as keyof typeof this.desktopConfig.colors] = color;
    }
  }
  
  updateMobileSectionColor(sectionId: string, color: string): void {
    if (this.mobileConfig.colors[sectionId as keyof typeof this.mobileConfig.colors]) {
      this.mobileConfig.colors[sectionId as keyof typeof this.mobileConfig.colors] = color;
    }
  }
  
  // Actualizar margen de transición
  updateTransitionMargin(margin: number): void {
    this.transitionMargin = Math.max(0, margin);
  }
  
  // Actualizar opacidad
  updateNavbarOpacity(opacity: number): void {
    this.navbarOpacity = Math.max(0, Math.min(1, opacity));
  }
}