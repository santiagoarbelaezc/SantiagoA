import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectSchemeComponent, Project } from '../project-scheme/project-scheme.component';

@Component({
  selector: 'app-project-plaxtilineas',
  standalone: true,
  imports: [CommonModule, ProjectSchemeComponent],
  templateUrl: './project-plaxtilineas.component.html',
  styleUrls: ['./project-plaxtilineas.component.css']
})
export class ProjectPlaxtilineasComponent {
  project: Project = {
    id: 'plaxtilineas',
    title: 'Plaxtilineas',
    company: 'E-Commerce Armenia Quindío',
    description: 'Plataforma e-commerce para Plaxtilineas, empresa ubicada en Armenia, Quindío. Sistema completo de ventas en línea con catálogo de productos, gestión de inventario y procesamiento de pedidos optimizado para el mercado local.',
    technologies: ['Node.js', 'Express', 'Angular', 'MySQL', 'Hostinger', 'AWS'],
    videos: [
      { 
        url: 'assets/videos/plaxtilineas.mp4',
        layout: 'full' 
      }
    ],
    year: 2025,
    linkRepositorio: 'https://github.com/santiagoarbelaezc/Plaxtilineas.git',
    linkEnVivo: 'https://plaxtilineas.com/'
  };

  onVideoPlay(event: {projectId: string, videoIndex: number, videoElement: HTMLVideoElement}): void {
    console.log('Video play event:', event);
  }

  onVideoPause(event: {projectId: string, videoIndex: number}): void {
    console.log('Video pause event:', event);
  }
}
