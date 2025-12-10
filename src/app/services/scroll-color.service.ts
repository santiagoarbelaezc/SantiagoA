// services/scroll-color.service.ts (versión extendida)
import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, fromEvent, throttleTime } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ScrollColorService {
  private currentColor = new BehaviorSubject<string>('#FFFFFF');
  public currentColor$ = this.currentColor.asObservable();

  private sections = [
    { id: 'hero', start: 0, end: 0, color: '#FFFFFF' },        // Blanco
    { id: 'about', start: 0, end: 0, color: '#8B4513' },       // Café
    { id: 'projects', start: 0, end: 0, color: '#000000' },    // Negro
    { id: 'contact', start: 0, end: 0, color: '#000000' },     // Negro
    { id: 'footer', start: 0, end: 0, color: '#000000' }       // Negro
  ];

  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) platformId: any) {
    this.isBrowser = isPlatformBrowser(platformId);
    
    if (this.isBrowser) {
      this.initializeScrollListener();
    }
  }

  private initializeScrollListener(): void {
    setTimeout(() => this.calculateSectionPositions(), 100);
    
    fromEvent(window, 'scroll')
      .pipe(throttleTime(10))
      .subscribe(() => this.handleScroll());
    
    fromEvent(window, 'resize')
      .pipe(throttleTime(100))
      .subscribe(() => this.calculateSectionPositions());
  }

  private calculateSectionPositions(): void {
    if (!this.isBrowser) return;

    const scrollTop = window.pageYOffset;
    const windowHeight = window.innerHeight;

    this.sections.forEach((section, index) => {
      const element = document.getElementById(section.id);
      if (element) {
        const rect = element.getBoundingClientRect();
        section.start = rect.top + scrollTop;
        section.end = section.start + rect.height;
        
        if (index === 0) {
          section.start = 0;
        }
      }
    });

    // Si no se encuentra alguna sección, usar valores por defecto
    this.setFallbackPositions();
  }

  private setFallbackPositions(): void {
    const windowHeight = window.innerHeight;
    let currentPosition = 0;

    this.sections.forEach(section => {
      if (section.start === 0 && section.end === 0) {
        // Estimar posiciones basadas en el orden
        section.start = currentPosition;
        section.end = currentPosition + windowHeight * 1.5; // 1.5 pantallas de altura
        currentPosition = section.end;
      }
    });
  }

  private handleScroll(): void {
    if (!this.isBrowser) return;

    const scrollPosition = window.pageYOffset + (window.innerHeight / 2);
    
    for (let i = 0; i < this.sections.length - 1; i++) {
      const currentSection = this.sections[i];
      const nextSection = this.sections[i + 1];
      
      if (scrollPosition >= currentSection.start && scrollPosition < nextSection.end) {
        const sectionRange = nextSection.start - currentSection.start;
        const progress = sectionRange > 0 ? 
          Math.max(0, Math.min(1, (scrollPosition - currentSection.start) / sectionRange)) : 0;
        
        const interpolatedColor = this.interpolateColor(
          currentSection.color,
          nextSection.color,
          progress
        );
        
        this.currentColor.next(interpolatedColor);
        break;
      }
    }

    // Si estamos en la última sección, usar su color directamente
    const lastSection = this.sections[this.sections.length - 1];
    if (scrollPosition >= lastSection.start) {
      this.currentColor.next(lastSection.color);
    }
  }

  private interpolateColor(color1: string, color2: string, factor: number): string {
    const hex = (color: string) => color.replace('#', '');
    const hex1 = hex(color1);
    const hex2 = hex(color2);
    
    const r1 = parseInt(hex1.substring(0, 2), 16);
    const g1 = parseInt(hex1.substring(2, 4), 16);
    const b1 = parseInt(hex1.substring(4, 6), 16);
    
    const r2 = parseInt(hex2.substring(0, 2), 16);
    const g2 = parseInt(hex2.substring(2, 4), 16);
    const b2 = parseInt(hex2.substring(4, 6), 16);
    
    const r = Math.round(r1 + (r2 - r1) * factor);
    const g = Math.round(g1 + (g2 - g1) * factor);
    const b = Math.round(b1 + (b2 - b1) * factor);
    
    return `#${this.componentToHex(r)}${this.componentToHex(g)}${this.componentToHex(b)}`;
  }

  private componentToHex(c: number): string {
    const hex = c.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }

  public refreshSectionPositions(): void {
    if (this.isBrowser) {
      this.calculateSectionPositions();
    }
  }

  // Método para debugging
  public getSectionInfo(): any {
    return this.sections.map(section => ({
      id: section.id,
      start: section.start,
      end: section.end,
      color: section.color
    }));
  }
}