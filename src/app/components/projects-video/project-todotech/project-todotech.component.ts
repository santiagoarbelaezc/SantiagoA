import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectSchemeComponent, Project } from '../project-scheme/project-scheme.component';

@Component({
  selector: 'app-project-todotech',
  standalone: true,
  imports: [CommonModule, ProjectSchemeComponent],
  templateUrl: './project-todotech.component.html',
  styleUrls: ['./project-todotech.component.css']
})
export class ProjectTodotechComponent {
  project: Project = {
    id: 'todotechshop',
    title: 'TodoTechShop',
    company: 'E-Commerce Tecnológico',
    description: 'Plataforma e-commerce especializada en tecnología. Ofrece un completo catálogo de productos electrónicos con sistema de carrito de compras, procesamiento de pagos seguro y gestión de órdenes optimizada para proporcionar una experiencia de compra fluida.',
    technologies: ['Spring Boot', 'PostgreSQL', 'Angular', 'AWS', 'Firebase'],
    videos: [
      { 
        url: 'assets/videos/todotech.mp4',
        layout: 'full' 
      }
    ],
    year: 2025,
    linkRepositorio: 'https://github.com/santiagoarbelaezc/todo-tech-back',
    linkEnVivo: 'https://todotechshopfrontend.web.app/catalogo-todotech-presentacion'
  };

  onVideoPlay(event: {projectId: string, videoIndex: number, videoElement: HTMLVideoElement}): void {
    console.log('Video play event:', event);
  }

  onVideoPause(event: {projectId: string, videoIndex: number}): void {
    console.log('Video pause event:', event);
  }
}