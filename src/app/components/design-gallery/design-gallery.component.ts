import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-design-gallery',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './design-gallery.component.html',
  styleUrls: ['./design-gallery.component.css'],
  animations: [
    trigger('slideInOut', [
      transition(':enter', [
        style({ 
          transform: 'translateX(100%) scale(0.95)', 
          opacity: 0 
        }),
        animate('400ms cubic-bezier(0.4, 0, 0.2, 1)', 
          style({ 
            transform: 'translateX(0) scale(1)', 
            opacity: 1 
          }))
      ]),
      transition(':leave', [
        animate('300ms cubic-bezier(0.4, 0, 0.2, 1)',
          style({ 
            transform: 'translateX(100%) scale(0.95)', 
            opacity: 0 
          }))
      ])
    ])
  ]
})
export class DesignGalleryComponent implements OnInit {
  isOpen = false;
  isHovering = false;
  
  designs = [
    {
      id: 1,
      title: 'Sistema UI Web',
      category: 'Web Design',
      year: 2024,
      description: 'Diseño de sistema de componentes escalable',
      tags: ['Figma', 'Design Tokens', 'Components']
    },
    {
      id: 2,
      title: 'App Móvil Fintech',
      category: 'Mobile UI',
      year: 2024,
      description: 'Interfaz para aplicación financiera',
      tags: ['iOS', 'Android', 'Dark Mode']
    },
    {
      id: 3,
      title: 'Branding Corporativo',
      category: 'Brand Identity',
      year: 2023,
      description: 'Identidad visual completa',
      tags: ['Logo', 'Typography', 'Color System']
    },
    {
      id: 4,
      title: 'Dashboard Analytics',
      category: 'Data Visualization',
      year: 2024,
      description: 'Panel de control con métricas',
      tags: ['Charts', 'Metrics', 'Real-time']
    }
  ];

  constructor() {}

  ngOnInit() {
    console.log('DesignGallery initialized');
  }

  toggleGallery() {
    this.isOpen = !this.isOpen;
  }

  @HostListener('document:keydown.escape')
  onEscapeKey() {
    if (this.isOpen) {
      this.isOpen = false;
    }
  }
}