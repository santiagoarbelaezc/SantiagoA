import { 
  Component, 
  Input, 
  Output, 
  EventEmitter, 
  ViewChildren, 
  QueryList, 
  ElementRef, 
  AfterViewInit, 
  OnDestroy,
  ChangeDetectorRef,
  OnInit 
} from '@angular/core';
import { CommonModule } from '@angular/common';

export interface ProjectVideo {
  url: string;
  layout?: 'full' | 'half' | 'vertical';
}

export interface Project {
  id: string;
  title: string;
  company: string;
  description: string;
  technologies: string[];
  videos: ProjectVideo[];
  year: number;
  linkRepositorio?: string;
  linkEnVivo?: string;
}

interface VideoState {
  isPlaying: boolean;
  isManuallyPaused: boolean;
  videoElement?: HTMLVideoElement;
}

@Component({
  selector: 'app-project-scheme',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './project-scheme.component.html',
  styleUrls: ['./project-scheme.component.css']
})
export class ProjectSchemeComponent implements AfterViewInit, OnDestroy, OnInit {
  @Input() project!: Project;
  @Input() animationDelay: number = 0;
  @Input() showPlayButtons: boolean = true;
  
  @Output() videoPlay = new EventEmitter<{projectId: string, videoIndex: number, videoElement: HTMLVideoElement}>();
  @Output() videoPause = new EventEmitter<{projectId: string, videoIndex: number}>();
  
  @ViewChildren('videoElement') videoElements!: QueryList<ElementRef<HTMLVideoElement>>;
  
  private videoStates: Map<string, VideoState> = new Map();
  private intersectionObserver?: IntersectionObserver;
  private isComponentVisible: boolean = true;

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    // Inicializar estados de video
    this.initializeVideoStates();
  }

  ngAfterViewInit(): void {
    this.setupVideoObservers();
    this.setupPageVisibilityListener();
  }

  ngOnDestroy(): void {
    this.cleanupObservers();
  }

  private initializeVideoStates(): void {
    this.project.videos.forEach((_, index) => {
      const videoId = this.getVideoId(index);
      this.videoStates.set(videoId, {
        isPlaying: false,
        isManuallyPaused: false
      });
    });
  }

  private setupVideoObservers(): void {
    this.intersectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const video = entry.target as HTMLVideoElement;
        const videoId = video.getAttribute('data-video-id');
        
        if (!videoId) return;
        
        const state = this.videoStates.get(videoId);
        if (!state) return;

        if (entry.isIntersecting) {
          // Cuando el video entra en la vista
          if (!state.isManuallyPaused) {
            this.playVideo(videoId, video);
          }
        } else {
          // Cuando el video sale de la vista
          if (state.isPlaying) {
            this.pauseVideo(videoId, video);
          }
        }
      });
    }, {
      threshold: 0.3, // Aumentado para mejor UX
      rootMargin: '50px'
    });

    setTimeout(() => {
      this.videoElements.forEach((videoRef) => {
        if (this.intersectionObserver && videoRef.nativeElement) {
          this.intersectionObserver.observe(videoRef.nativeElement);
        }
      });
    }, 0);
  }

  private setupPageVisibilityListener(): void {
    document.addEventListener('visibilitychange', () => {
      this.isComponentVisible = !document.hidden;
      
      if (!this.isComponentVisible) {
        // Pausar todos los videos cuando la página no es visible
        this.pauseAllVideos();
      } else {
        // Reanudar videos que deberían estar reproduciéndose
        this.resumeVisibleVideos();
      }
    });
  }

  private cleanupObservers(): void {
    if (this.intersectionObserver) {
      this.intersectionObserver.disconnect();
    }
  }

  getVideoId(index: number): string {
    return `${this.project.id}-${index}`;
  }

  toggleVideo(index: number, videoElement: HTMLVideoElement): void {
    const videoId = this.getVideoId(index);
    const state = this.videoStates.get(videoId);
    
    if (!state) return;
    
    state.videoElement = videoElement;
    
    if (videoElement.paused) {
      this.playVideo(videoId, videoElement);
      state.isManuallyPaused = false;
    } else {
      this.pauseVideo(videoId, videoElement);
      state.isManuallyPaused = true;
    }
    
    this.cdr.detectChanges();
  }

  private async playVideo(videoId: string, videoElement: HTMLVideoElement): Promise<void> {
    try {
      const state = this.videoStates.get(videoId);
      if (!state || state.isPlaying) return;
      
      await videoElement.play();
      
      state.isPlaying = true;
      state.isManuallyPaused = false;
      
      // Emitir evento de reproducción
      const index = this.getVideoIndexFromId(videoId);
      if (index !== -1) {
        this.videoPlay.emit({
          projectId: this.project.id,
          videoIndex: index,
          videoElement: videoElement
        });
      }
      
      this.cdr.detectChanges();
    } catch (error) {
      console.warn('Error playing video:', error);
      const state = this.videoStates.get(videoId);
      if (state) {
        state.isPlaying = false;
        state.isManuallyPaused = true;
        this.cdr.detectChanges();
      }
    }
  }

  private pauseVideo(videoId: string, videoElement: HTMLVideoElement): void {
    const state = this.videoStates.get(videoId);
    if (!state || !state.isPlaying) return;
    
    videoElement.pause();
    state.isPlaying = false;
    
    // Emitir evento de pausa
    const index = this.getVideoIndexFromId(videoId);
    if (index !== -1) {
      this.videoPause.emit({
        projectId: this.project.id,
        videoIndex: index
      });
    }
    
    this.cdr.detectChanges();
  }

  private pauseAllVideos(): void {
    this.videoElements.forEach((videoRef, index) => {
      const videoId = this.getVideoId(index);
      const state = this.videoStates.get(videoId);
      
      if (state?.isPlaying && videoRef.nativeElement) {
        videoRef.nativeElement.pause();
        state.isPlaying = false;
      }
    });
  }

  private resumeVisibleVideos(): void {
    this.videoElements.forEach((videoRef, index) => {
      const videoId = this.getVideoId(index);
      const state = this.videoStates.get(videoId);
      
      if (state && !state.isManuallyPaused && videoRef.nativeElement) {
        const rect = videoRef.nativeElement.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
        
        if (isVisible) {
          this.playVideo(videoId, videoRef.nativeElement);
        }
      }
    });
  }

  private getVideoIndexFromId(videoId: string): number {
    const match = videoId.match(/.+?-(\d+)$/);
    return match ? parseInt(match[1], 10) : -1;
  }

  isVideoPlaying(index: number): boolean {
    const state = this.videoStates.get(this.getVideoId(index));
    return state?.isPlaying || false;
  }

  getVerticalVideo(): ProjectVideo | undefined {
    return this.project.videos.find(v => v.layout === 'vertical');
  }

  getNonVerticalVideos(): ProjectVideo[] {
    return this.project.videos.filter(v => v.layout !== 'vertical');
  }

  hasVerticalVideo(): boolean {
    return this.project.videos.some(v => v.layout === 'vertical');
  }

  getLayoutClass(video: ProjectVideo): string {
    if (this.project.videos.length === 1) return 'video-container--full';
    if (video.layout === 'vertical') return 'video-container--vertical';
    return 'video-container--half';
  }

  getIconUrl(tech: string): string {
    const iconMap: { [key: string]: string } = {
      'Angular': 'angular.png',
      'AWS': 'aws.png',
      'Firebase': 'firebase.png',
      'Spring Boot': 'spring-boot.png',
      'PostgreSQL': 'postgresql.png',
      'CSS': 'css.png',
      'Docker': 'docker.png',
      'Express': 'express.png',
      'Hostinger': 'hostinger.png',
      'MongoDB': 'mongodb.png',
      'MySQL': 'mysql.png',
      'NestJS': 'nestjs.png',
      'Node.js': 'nodejs.png',
      'Oracle': 'oracle.png',
      'Play': 'play.png',
      'React': 'react.png'
    };
    const iconName = iconMap[tech];
    return iconName ? `assets/icons/${iconName}` : '';
  }
}