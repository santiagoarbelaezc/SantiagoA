import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectSchemeComponent, Project } from '../project-scheme/project-scheme.component';

@Component({
  selector: 'app-project-espumas',
  standalone: true,
  imports: [CommonModule, ProjectSchemeComponent],
  templateUrl: './project-espumas.component.html',
  styleUrls: ['./project-espumas.component.css']
})
export class ProjectEspumasComponent {
  project: Project = {
    id: 'espumas',
    title: 'Espumas & Plasticos',
    company: 'E-Commerce Armenia Quindío',
    description: 'Plataforma e-commerce para Espumas & Plasticos, empresa ubicada en Armenia, Quindío. Sistema completo de ventas en línea con catálogo de productos, gestión de inventario y procesamiento de pedidos optimizado para el mercado local.',
    technologies: ['Node.js', 'Express', 'Angular', 'Firebase', 'MySQL'],
    videos: [
      { 
        url: 'assets/videos/espumas.mp4',
        layout: 'full' 
      }
    ],
    year: 2026,
    linkRepositorio: 'https://github.com/santiagoarbelaezc/EspumasYPlasticos.git',
    linkEnVivo: 'https://espumasplaxticos-desarrollo.web.app/'
  };

  onVideoPlay(event: {projectId: string, videoIndex: number, videoElement: HTMLVideoElement}): void {
    console.log('Video play event:', event);
  }

  onVideoPause(event: {projectId: string, videoIndex: number}): void {
    console.log('Video pause event:', event);
  }
}
