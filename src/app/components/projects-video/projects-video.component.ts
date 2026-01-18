import { Component, OnInit, OnDestroy, ViewChildren, QueryList, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VideoService } from '../../services/video.service';

interface ProjectVideo {
  url: string;
  layout?: 'full' | 'half' | 'vertical';
}

interface Project {
  id: string;
  title: string;
  company: string;
  description: string;
  technologies: string[];
  videos: ProjectVideo[];
  year: number;
}

@Component({
  selector: 'app-projects-video',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './projects-video.component.html',
  styleUrls: ['./projects-video.component.css']
})
export class ProjectsVideoComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChildren('videoElement') videoElements!: QueryList<ElementRef<HTMLVideoElement>>;

  videoPausedManually: Set<string> = new Set();
  private intersectionObserver?: IntersectionObserver;

  projects: Project[] = [
    {
      id: 'plaxtilineas',
      title: 'Plaxtilineas',
      company: 'Armenia, Colombia',
      description: 'Plataforma e-commerce completa para una empresa local de Armenia. Sistema robusto de gestión de productos diseñado para optimizar la experiencia de compra en línea y aumentar las ventas digitales.',
      technologies: ['Angular', 'Node.js', 'Express', 'MySQL', 'AWS', 'Hostinger'],
      videos: [
        { url: 'plaxtilineas', layout: 'full' }
      ],
      year: 2025
    },
    {
      id: 'todotechshop',
      title: 'TodoTechShop',
      company: 'Plataforma Global',
      description: 'Plataforma e-commerce especializada en tecnología. Ofrece un completo catálogo de productos electrónicos con sistema de carrito de compras, procesamiento de pagos seguro y gestión de órdenes optimizada para proporcionar una experiencia de compra fluida.',
      technologies: ['Spring Boot', 'PostgreSQL', 'Angular', 'AWS', 'Firebase'],
      videos: [
        { url: 'todotech', layout: 'full' }
      ],
      year: 2025
    }
  ];

  constructor(private videoService: VideoService) {}

  ngOnInit(): void {
    this.setupIntersectionObserver();
  }

  ngAfterViewInit(): void {
    this.observeVideos();
  }

  ngOnDestroy(): void {
    if (this.intersectionObserver) {
      this.intersectionObserver.disconnect();
    }
  }

  private setupIntersectionObserver(): void {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '50px'
    };

    this.intersectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const video = entry.target as HTMLVideoElement;
        const videoId = video.getAttribute('data-video-id');

        if (entry.isIntersecting && videoId && !this.videoPausedManually.has(videoId)) {
          // Cuando entra al viewport, reproducir
          const playPromise = video.play();
          if (playPromise !== undefined) {
            playPromise.catch(error => {
              console.log('Autoplay prevented:', videoId, error.name);
            });
          }
        } else if (!entry.isIntersecting) {
          // Cuando sale del viewport, pausar y resetear
          video.pause();
          video.currentTime = 0;
        }
      });
    }, observerOptions);
  }

  private observeVideos(): void {
    this.videoElements.forEach((videoRef) => {
      if (this.intersectionObserver && videoRef.nativeElement) {
        this.intersectionObserver.observe(videoRef.nativeElement);
      }
    });
  }

  handlePlayVideo(videoId: string, videoRef: HTMLVideoElement): void {
    videoRef.currentTime = 0;
    const playPromise = videoRef.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          this.videoPausedManually.delete(videoId);
        })
        .catch(error => {
          console.log('Error playing video:', error.name);
        });
    }
  }

  handleVideoPause(videoId: string): void {
    this.videoPausedManually.add(videoId);
  }

  isVideoPlaying(videoId: string): boolean {
    return !this.videoPausedManually.has(videoId);
  }

  getVerticalVideo(project: Project): ProjectVideo | undefined {
    return project.videos.find(v => v.layout === 'vertical');
  }

  getNonVerticalVideos(project: Project): ProjectVideo[] {
    return project.videos.filter(v => v.layout !== 'vertical');
  }

  hasVerticalVideo(project: Project): boolean {
    return project.videos.some(v => v.layout === 'vertical');
  }

  getVideosForDisplay(project: Project): ProjectVideo[] {
    const nonVerticalVideos = this.getNonVerticalVideos(project);
    const verticalVideos = project.videos.filter(v => v.layout === 'vertical');
    
    if (project.videos.length === 1) {
      return project.videos;
    }
    
    return [...nonVerticalVideos, ...verticalVideos];
  }

  /**
   * Obtiene la URL completa del video usando el servicio
   */
  getVideoUrl(videoId: string): string {
    return this.videoService.getVideoUrl(videoId);
  }
}
