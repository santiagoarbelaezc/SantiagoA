import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { ScrollService } from '../../services/scroll.service';
import { CommonModule, isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-hero',
  templateUrl: './hero.component.html',
  styleUrls: ['./hero.component.css'],
  standalone: true, 
  imports: [CommonModule]
})
export class HeroComponent implements OnInit, OnDestroy {
  stats = [
    { count: 3, label: 'Años Exp.', value: 0 },
    { count: 50, label: 'Proyectos', value: 0 },
    { count: 100, label: 'Compromiso', value: 0 }
  ];

  private animationTimers: any[] = [];
  private observer!: IntersectionObserver;

  constructor(
    private scrollService: ScrollService,
    @Inject(PLATFORM_ID) private platformId: any
  ) {}

  ngOnInit() {
    this.animateStats();
    this.setupIntersectionObserver();
  }

  ngOnDestroy() {
    this.animationTimers.forEach(timer => clearInterval(timer));
    this.animationTimers = [];
    
    if (this.observer) {
      this.observer.disconnect();
    }
  }

  scrollToProjects(): void {
    this.scrollService.scrollToSection('projects');
  }

  scrollToNextSection(): void {
    this.scrollService.scrollToSection('about');
  }

  private animateStats(): void {
    this.stats.forEach((stat) => {
      this.animateCounter(stat);
    });
  }

  private animateCounter(stat: any): void {
    const duration = 1500;
    const stepTime = Math.max(20, Math.floor(duration / stat.count));
    let current = 0;

    const timer = setInterval(() => {
      current += 1;
      stat.value = current;
      
      if (current >= stat.count) {
        clearInterval(timer);
        const index = this.animationTimers.indexOf(timer);
        if (index > -1) {
          this.animationTimers.splice(index, 1);
        }
      }
    }, stepTime);

    this.animationTimers.push(timer);
  }

  private setupIntersectionObserver(): void {
  if (isPlatformBrowser(this.platformId)) {
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            // Cuando el elemento entra en el viewport
            entry.target.classList.add('revealed');
            entry.target.classList.remove('hidden');
            
            // También revelar todos los elementos hijos con data-aos
            const childElements = entry.target.querySelectorAll('[data-aos]');
            childElements.forEach((el: Element) => {
              el.classList.add('revealed');
              el.classList.remove('hidden');
            });
          } else {
            // Cuando el elemento sale del viewport
            entry.target.classList.add('hidden');
            entry.target.classList.remove('revealed');
            
            // También ocultar todos los elementos hijos con data-aos
            const childElements = entry.target.querySelectorAll('[data-aos]');
            childElements.forEach((el: Element) => {
              el.classList.add('hidden');
              el.classList.remove('revealed');
            });
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -10% 0px' // Más sensible para scroll up
      }
    );

    // Observar el contenedor principal del hero en lugar de elementos individuales
    setTimeout(() => {
      const heroSection = document.querySelector('.hero');
      if (heroSection) {
        this.observer.observe(heroSection);
      }
    }, 100);
  }
}
}