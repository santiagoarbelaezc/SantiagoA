// services/modal.service.ts
import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

export interface SlideImage {
  src: string;
  alt: string;
}

export interface Credential {
  role: string;
  username: string;
  password: string;
  description?: string;
}

export interface UsageInfo {
  title: string;
  credentials: Credential[];
  instructions?: string[];
}

export interface ProjectData {
  id: number;
  title: string;
  description: string;
  longDescription: string;
  technologies: string[];
  category: string;
  year: string;
  images: SlideImage[];
  liveUrl?: string;
  githubUrl?: string;
  usageInfo?: UsageInfo;
}

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  private isModalOpenSubject = new BehaviorSubject<boolean>(false);
  private projectDataSubject = new BehaviorSubject<ProjectData | null>(null);
  
  // Clave para almacenar en localStorage
  private readonly STORAGE_KEY = 'selected_project';
  
  isModalOpen$: Observable<boolean> = this.isModalOpenSubject.asObservable();
  projectData$: Observable<ProjectData | null> = this.projectDataSubject.asObservable();

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    // Solo en el navegador
    if (isPlatformBrowser(this.platformId)) {
      this.loadFromStorage();
    }
  }
  
  openModal(project: ProjectData): void {
    this.projectDataSubject.next(project);
    this.isModalOpenSubject.next(true);
    
    if (isPlatformBrowser(this.platformId)) {
      // Guardar en localStorage
      try {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(project));
      } catch (e) {
        console.warn('No se pudo guardar en localStorage:', e);
      }
      
      document.body.style.overflow = 'hidden';
    }
  }
  
  closeModal(): void {
    this.isModalOpenSubject.next(false);
    
    if (isPlatformBrowser(this.platformId)) {
      // Solo cerrar el modal, no limpiar el proyecto seleccionado
      document.body.style.overflow = 'auto';
    }
  }
  
  // Cerrar y limpiar completamente (cuando se navega fuera)
  clearModal(): void {
    this.isModalOpenSubject.next(false);
    this.projectDataSubject.next(null);
    
    if (isPlatformBrowser(this.platformId)) {
      // Limpiar localStorage
      try {
        localStorage.removeItem(this.STORAGE_KEY);
      } catch (e) {
        console.warn('No se pudo limpiar localStorage:', e);
      }
      
      document.body.style.overflow = 'auto';
    }
  }
  
  getCurrentProject(): ProjectData | null {
    return this.projectDataSubject.value;
  }
  
  isOpen(): boolean {
    return this.isModalOpenSubject.value;
  }
  
  // Método para cargar desde localStorage al iniciar
  private loadFromStorage(): void {
    try {
      const saved = localStorage.getItem(this.STORAGE_KEY);
      if (saved) {
        const projectData = JSON.parse(saved) as ProjectData;
        this.projectDataSubject.next(projectData);
        // No abrir automáticamente el modal, solo cargar los datos
      }
    } catch (e) {
      console.warn('Error al cargar desde localStorage:', e);
      // Limpiar datos corruptos
      localStorage.removeItem(this.STORAGE_KEY);
    }
  }
  
  // Método para establecer proyecto sin abrir modal (útil al recargar)
  setProjectWithoutOpening(project: ProjectData): void {
    this.projectDataSubject.next(project);
    
    if (isPlatformBrowser(this.platformId)) {
      try {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(project));
      } catch (e) {
        console.warn('No se pudo guardar en localStorage:', e);
      }
    }
  }
  
  // Método para cuando se selecciona un nuevo proyecto
  selectNewProject(project: ProjectData): void {
    this.projectDataSubject.next(project);
    
    if (isPlatformBrowser(this.platformId)) {
      try {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(project));
      } catch (e) {
        console.warn('No se pudo guardar en localStorage:', e);
      }
    }
  }
  
  // Método para limpiar cuando se navega fuera de la página de proyecto
  clear(): void {
    this.clearModal();
  }
  
  // Método para obtener credenciales de un proyecto
  getCredentials(projectId: number): Credential[] | null {
    const project = this.projectDataSubject.value;
    if (project && project.id === projectId && project.usageInfo) {
      return project.usageInfo.credentials;
    }
    return null;
  }
  
  // Método para verificar si un proyecto tiene información de uso
  hasUsageInfo(projectId: number): boolean {
    const project = this.projectDataSubject.value;
    return !!(project && project.id === projectId && project.usageInfo);
  }
  
  // Método para obtener toda la información de uso
  getUsageInfo(projectId: number): UsageInfo | null {
    const project = this.projectDataSubject.value;
    if (project && project.id === projectId) {
      return project.usageInfo || null;
    }
    return null;
  }
}