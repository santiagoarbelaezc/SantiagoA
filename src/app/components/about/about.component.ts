// about.component.ts
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-about',
  standalone: true, 
  imports: [CommonModule],
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css'],
})
export class AboutComponent {
  // Tecnologías Frontend
  frontendTechnologies = [
    { name: 'Angular', icon: 'assets/angular.png' },
    { name: 'React', icon: 'assets/react.png' }
  ];

  // Tecnologías Backend
  backendTechnologies = [
    { name: 'Node.js', icon: 'assets/nodejs.png' },
    { name: 'Spring Boot', icon: 'assets/spring-boot.png' },
    { name: 'NestJS', icon: 'assets/nestjs.png' },
    { name: 'ExpressJS', icon: 'assets/express.png' }
  ];

  // Bases de Datos
  databases = [
    { name: 'MongoDB', icon: 'assets/mongodb.png' },
    { name: 'PostgreSQL', icon: 'assets/postgresql.png' },
    { name: 'Firebase', icon: 'assets/firebase.png' }
  ];

  // Cloud Technologies
  otherTechnologies = [
    { name: 'AWS', icon: 'assets/aws.png' }
  ];
}