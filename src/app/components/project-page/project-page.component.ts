// pages/project-page/project-page.component.ts
import { Component, OnInit, OnDestroy, HostListener, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { ModalService, ProjectData } from '../../services/modal.service';
import { CarouselComponent } from '../carousel/carousel.component';

interface Technology {
  name: string;
  icon: string;
}

@Component({
  selector: 'app-project-page',
  standalone: true,
  imports: [CommonModule, CarouselComponent],
  templateUrl: './project-page.component.html',
  styleUrls: ['./project-page.component.css']
})
export class ProjectPageComponent implements OnInit, OnDestroy {
  projectData: ProjectData | null = null;
  technologyIcons: Technology[] = [];
  isLoading: boolean = true;
  error: string | null = null;
  private isBrowser: boolean;

  // Mapeo de tecnologías a iconos
  private technologyIconMap: { [key: string]: string } = {
    // Frontend
    'Angular': 'assets/angular.png',
    'Angular 17': 'assets/angular.png',
    'React': 'assets/react.png',
    'React 18': 'assets/react.png',
    'React Native': 'assets/react.png',
    'TypeScript': 'assets/typescript.png',
    'D3.js': 'assets/d3js.png',
    
    // Backend
    'Spring Boot': 'assets/spring-boot.png',
    'Spring Boot 3': 'assets/spring-boot.png',
    'Node.js': 'assets/nodejs.png',
    'NestJS': 'assets/nestjs.png',
    'ExpressJS': 'assets/express.png',
    'GraphQL': 'assets/graphql.png',
    
    // Bases de datos
    'PostgreSQL': 'assets/postgresql.png',
    'MongoDB': 'assets/mongodb.png',
    'Redis': 'assets/redis.png',
    'Firebase': 'assets/firebase.png',
    
    // Cloud & DevOps
    'Docker': 'assets/docker.png',
    'AWS': 'assets/aws.png',
    'Expo': 'assets/expo.png',
    
    // Otros
    'Redux Toolkit': 'assets/redux.png',
    'WebSocket': 'assets/websocket.png'
  };

  constructor(
    private modalService: ModalService,
    private router: Router,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    // Restaurar el scroll primero
    if (this.isBrowser) {
      document.body.style.overflow = 'auto';
    }
    
    this.loadProject();
  }

  ngOnDestroy(): void {
    // Solo limpiar si el usuario navega fuera de la página de proyecto
    // No limpiar si solo está recargando
  }

  private loadProject(): void {
    this.projectData = this.modalService.getCurrentProject();
    
    if (this.projectData) {
      this.loadTechnologyIcons();
      this.handleProjectLoaded();
      return;
    }
    
    // Si no hay en el servicio, verificar localStorage
    this.checkLocalStorage();
  }

  private loadTechnologyIcons(): void {
    if (this.projectData && this.projectData.technologies) {
      this.technologyIcons = this.projectData.technologies.map(tech => ({
        name: tech,
        icon: this.technologyIconMap[tech] || 'assets/default-tech.png'
      }));
    }
  }

  private checkLocalStorage(): void {
    if (this.isBrowser) {
      try {
        const saved = localStorage.getItem('selected_project');
        if (saved) {
          const projectData = JSON.parse(saved) as ProjectData;
          
          // Validar que los datos sean correctos
          if (projectData && projectData.id && projectData.title) {
            this.projectData = projectData;
            // Actualizar el servicio con los datos recuperados
            this.modalService.setProjectWithoutOpening(projectData);
            this.loadTechnologyIcons();
            this.handleProjectLoaded();
            return;
          }
        }
      } catch (e) {
        console.warn('Error al leer localStorage:', e);
        // Limpiar datos corruptos
        localStorage.removeItem('selected_project');
      }
    }
    
    // Si no hay datos en ninguna fuente
    this.handleNoProject();
  }

  private handleProjectLoaded(): void {
    this.isLoading = false;
    
    // Hacer scroll al inicio suavemente
    if (this.isBrowser) {
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 100);
    }
  }

  private handleNoProject(): void {
    this.error = 'No se encontró información del proyecto';
    this.isLoading = false;
    
    // Redirigir después de un tiempo si no hay proyecto
    setTimeout(() => {
      this.goBack();
    }, 3000);
  }

  goBack(): void {
    // Solo cerrar el modal pero mantener los datos
    this.modalService.closeModal();
    
    // Redirigir al portfolio
    this.router.navigate(['/portfolio']);
  }

  // Método para cuando el usuario quiere cerrar completamente
  closeAndClear(): void {
    // Esto limpiará todo (modal y datos almacenados)
    this.modalService.clearModal();
    this.router.navigate(['/portfolio']);
  }

  openExternalLink(url: string): void {
    if (this.isBrowser) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  }

  @HostListener('document:keydown.escape')
  handleEscapeKey(): void {
    this.goBack();
  }

  // Método para compartir proyecto
  shareProject(): void {
    if (this.isBrowser && navigator.share && this.projectData) {
      navigator.share({
        title: this.projectData.title,
        text: this.projectData.description,
        url: window.location.href
      }).catch(console.error);
    } else {
      // Fallback para navegadores que no soportan Web Share API
      this.copyToClipboard();
    }
  }

  scrollToTop(): void {
    if (this.isBrowser) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  private copyToClipboard(): void {
    if (!this.isBrowser) return;
    
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      this.showToast('URL copiada al portapapeles!', '#2ecc71');
    }).catch(err => {
      console.error('Error al copiar: ', err);
      this.showToast('Error al copiar URL', '#e74c3c');
    });
  }

  private showToast(message: string, color: string): void {
    if (!this.isBrowser) return;
    
    const alert = document.createElement('div');
    alert.textContent = message;
    alert.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: ${color};
      color: white;
      padding: 12px 20px;
      border-radius: 6px;
      z-index: 10000;
      font-size: 0.9rem;
      animation: fadeInOut 3s ease;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    `;
    
    // Agregar estilos para la animación
    const style = document.createElement('style');
    style.textContent = `
      @keyframes fadeInOut {
        0% { opacity: 0; transform: translateY(-10px); }
        15% { opacity: 1; transform: translateY(0); }
        85% { opacity: 1; transform: translateY(0); }
        100% { opacity: 0; transform: translateY(-10px); }
      }
    `;
    
    document.head.appendChild(style);
    document.body.appendChild(alert);
    
    // Remover después de 3 segundos
    setTimeout(() => {
      if (document.body.contains(alert)) {
        document.body.removeChild(alert);
      }
      if (document.head.contains(style)) {
        document.head.removeChild(style);
      }
    }, 3000);
  }

  // Método opcional: Para cuando el usuario hace refresh
  // Puedes agregar un botón "Seguir viendo" en caso de error
  reloadPage(): void {
    if (this.isBrowser) {
      window.location.reload();
    }
  }

  // Método para obtener icono de tecnología
  getTechIcon(techName: string): string {
    return this.technologyIconMap[techName] || 'assets/default-tech.png';
  }
}