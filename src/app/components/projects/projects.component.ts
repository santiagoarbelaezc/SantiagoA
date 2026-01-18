// projects.component.ts
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ModalService, ProjectData, SlideImage } from '../../services/modal.service';

interface Technology {
  name: string;
  icon: string;
}

interface Project {
  id: number;
  title: string;
  description: string;
  longDescription: string;
  technologies: string[];
  technologyIcons: Technology[];
  category: string;
  year: string;
  image: string;
  images: SlideImage[];
  liveUrl?: string;
  githubUrl?: string;
  usageInfo?: {
    title: string;
    credentials: Array<{ role: string; username: string; password: string; description?: string }>;
    instructions?: string[];
  };
}

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class ProjectsComponent {
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

  projects: Project[] = [
  {
    id: 1,
    title: 'TodoTech Shop',
    description: 'Sistema completo de comercio electrónico para tienda física de productos tecnológicos, desarrollado en Spring Boot y Angular con PostgreSQL. Permite gestión optimizada de ventas presenciales, sincronización de inventario en tiempo real, control de órdenes y múltiples métodos de pago incluyendo Stripe.',
    longDescription: 'Plataforma de e-commerce desarrollada con arquitectura de microservicios. Incluye sistema de carrito de compras, procesamiento de pagos con múltiples proveedores (Stripe, PayPal), panel administrativo para gestión de productos, pedidos y usuarios, y análisis de ventas en tiempo real. Implementa autenticación JWT y autorización basada en roles. El sistema está diseñado para ser utilizado tanto en modalidad online como en tienda física, donde los vendedores realizan todo el proceso de venta asistida.',
    image: 'assets/e-commerce.png',
    category: 'E-commerce',
    year: '2024',
    technologies: ['Angular 17', 'Spring Boot 3', 'PostgreSQL', 'AWS'],
    technologyIcons: this.getTechnologyIcons(['Angular 17', 'Spring Boot 3', 'PostgreSQL', 'AWS']),
    images: [
      { src: 'assets/home.png', alt: 'Página principal de TodoTech Shop' },
      { src: 'assets/product-detail.png', alt: 'Detalle de producto' },
      { src: 'assets/cart.png', alt: 'Carrito de compras' },
      { src: 'assets/login.png', alt: 'Login TodoTech' },
      { src: 'assets/admin.png', alt: 'Panel de administración' }
    ],
    liveUrl: 'https://todotechshopfrontend.web.app/login',
    githubUrl: 'https://github.com/santiagoarbelaezc/TodoTechShop-Frontend',
    usageInfo: {
      title: 'Información de Acceso',
      credentials: [
        {
          role: 'Vendedor',
          username: 'vendedor1',
          password: 'Vendedor.1',
          description: 'Acceso al módulo de ventas presenciales. Permite registro de clientes, procesamiento de pedidos y generación de facturas.'
        },
        {
          role: 'Cajero',
          username: 'cajero1',
          password: 'Cajero.1',
          description: 'Acceso al módulo de caja. Permite procesar pagos, generar recibos y cerrar turnos de caja.'
        },
        {
          role: 'Administrador',
          username: 'adminprueba',
          password: 'Admin.123',
          description: 'Acceso parcial al sistema. Permite gestión de usuarios, productos, inventario, reportes y configuración del sistema.'
        }
      ],
      instructions: [
        '1. Ingresa a la URL de la aplicación',
        '2. Selecciona "Iniciar Sesión"',
        '3. Introduce las credenciales según tu rol',
        '4. El sistema te redirigirá automáticamente al módulo correspondiente',
        '5. Para pruebas en ambiente local, descarga el repositorio y sigue las instrucciones del README'
      ]
    }
  },
    {
  id: 2,
  title: 'Bases Education',
  description: 'Plataforma educativa integral para creación, administración y evaluación de exámenes en línea, con calificación automática, análisis detallado de desempeño estudiantil y generación de reportes institucionales personalizados.',
  longDescription: 'Aplicación web completa para instituciones educativas que permite a docentes crear y gestionar exámenes en línea. La plataforma incluye: creación de exámenes organizados por temas con diversos tipos de preguntas, bancos de preguntas reutilizables (públicas/privadas), configuración de parámetros de examen (tiempo, fechas, cantidad de preguntas), calificación automática con retroalimentación inmediata, generación de estadísticas detalladas por estudiante, grupo y tema, gestión de matrícula estudiantil, visualización de horarios y programación de evaluaciones, análisis de preguntas con baja tasa de aciertos para mejora continua, y reportes exportables personalizados según necesidades institucionales.',
  image: 'assets/loginBases.png',
  category: 'Educación',
  year: '2024',
  technologies: ['Angular 17', 'ExpressJS', 'Oracle Developer', 'Node.js'],
  technologyIcons: this.getTechnologyIcons(['Angular 17', 'ExpressJS', 'Oracle Developer', 'Node.js']),
  images: [
    { src: 'assets/loginBases.png', alt: 'Dashboard principal de EduQuiz' },
    { src: 'assets/homeBases.png', alt: 'Creación de exámenes' },
    { src: 'assets/exam.png', alt: 'Vista de estudiante para examen' }
   
  ],
  liveUrl: 'https://eduquiz-platform.demo.com',
  githubUrl: 'https://github.com/santiagoarbelaezc/eduquiz-platform',
  usageInfo: {
    title: 'Información de Acceso Demo',
    credentials: [
      {
        role: 'Docente Demo',
        username: 'profesor.demo',
        password: 'Profesor.2024',
        description: 'Acceso completo al módulo docente: creación de exámenes, banco de preguntas, calificación y análisis estadístico.'
      },
      {
        role: 'Estudiante Demo',
        username: 'estudiante.demo',
        password: 'Estudiante.2024',
        description: 'Acceso al módulo estudiantil: presentación de exámenes, revisión de resultados, visualización de horarios.'
      },
      {
        role: 'Administrador',
        username: 'admin.demo',
        password: 'AdminEdu.2024',
        description: 'Acceso a configuración institucional: gestión de cursos, usuarios, planes de estudio y reportes generales.'
      }
    ],
    instructions: [
      '1. Ingresa a la URL de la plataforma',
      '2. Selecciona "Iniciar Sesión" en la esquina superior derecha',
      '3. Utiliza las credenciales según el rol que desees probar',
      '4. Explora las diferentes funcionalidades según tu rol',
      '5. Para pruebas locales: clona el repositorio y sigue las instrucciones del README'
    ]
  }
},
    {
      id: 3,
      title: 'TaskFlow Mobile App',
      description: 'Aplicación nativa para gestión de tareas con sincronización en la nube y notificaciones push.',
      longDescription: 'Aplicación móvil para gestión de proyectos y tareas personales. Incluye sistema de colaboración en equipo, calendario integrado, recordatorios inteligentes y sincronización en tiempo real. Implementa autenticación biométrica, modo offline con sincronización diferida, y análisis de productividad con IA para sugerencias de optimización.',
      image: 'assets/mobile-app.png',
      category: 'Productividad',
      year: '2023',
      technologies: ['React Native', 'Expo', 'Firebase', 'GraphQL', 'Redux Toolkit'],
      technologyIcons: this.getTechnologyIcons(['React Native', 'Expo', 'Firebase', 'GraphQL', 'Redux Toolkit']),
      images: [
        { src: 'assets/projects/taskflow/login.jpg', alt: 'Pantalla de inicio de sesión' },
        { src: 'assets/projects/taskflow/dashboard.jpg', alt: 'Dashboard de tareas' },
        { src: 'assets/projects/taskflow/team.jpg', alt: 'Colaboración en equipo' },
        { src: 'assets/projects/taskflow/calendar.jpg', alt: 'Calendario integrado' }
      ],
      liveUrl: 'https://play.google.com/store/apps/details?id=com.taskflow',
      githubUrl: 'https://github.com/tu-usuario/taskflow-app'
      // Sin usageInfo (vacío como solicitaste)
    }
  ];

  constructor(
    private router: Router,
    private modalService: ModalService
  ) {}

  // Método para obtener iconos de tecnologías
  private getTechnologyIcons(techNames: string[]): Technology[] {
    return techNames.map(name => ({
      name,
      icon: this.technologyIconMap[name] || 'assets/default-tech.png'
    }));
  }

  openProjectModal(project: Project): void {
    // Convertir el proyecto al formato correcto para el servicio
    const projectData: ProjectData = {
      id: project.id,
      title: project.title,
      description: project.description,
      longDescription: project.longDescription,
      technologies: project.technologies,
      category: project.category,
      year: project.year,
      images: project.images as SlideImage[],
      liveUrl: project.liveUrl,
      githubUrl: project.githubUrl,
      usageInfo: project.usageInfo // Asegúrate de que el servicio ModalService acepte este campo
    };
    
    // Guardar el proyecto en el servicio
    this.modalService.openModal(projectData);
    
    // Navegar a la página del proyecto
    this.router.navigate(['/project']);
  }

  // Método para obtener tecnologías visibles (las primeras 3)
  getVisibleTechnologies(project: Project): Technology[] {
    return project.technologyIcons.slice(0, 3);
  }

  // Método para obtener tecnologías ocultas
  getHiddenTechnologiesCount(project: Project): number {
    return Math.max(0, project.technologies.length - 3);
  }

  // Método para obtener icono de tecnología por nombre
  getTechIcon(techName: string): string {
    return this.technologyIconMap[techName] || 'assets/default-tech.png';
  }
}