// components/carousel-3d/carousel-3d.component.ts
import { Component, Input, OnInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface SlideImage {
  src: string;
  alt: string;
}

@Component({
  selector: 'app-carousel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.css']
})
export class CarouselComponent implements OnInit, OnDestroy {
  @Input() slides: SlideImage[] = [];
  @Input() autoRotate: boolean = true;
  @Input() rotationSpeed: number = 4000;
  @Input() showControls: boolean = true;
  @Input() showIndicators: boolean = true;
  @Input() radius: number = 870;
  @Input() width: number = 700;
  @Input() height: number = 420;

  rotation: number = 0;
  isDragging: boolean = false;
  startX: number = 0;
  currentRotation: number = 0;
  
  private intervalId: any;
  private snapAnimationId: any;
  private touchPosition: { x: number; identifier: number } | null = null;
  private targetRotation: number = 0;
  private isSnapping: boolean = false;

  itemCount: number = 0;
  anglePerItem: number = 0;

  ngOnInit(): void {
    this.itemCount = this.slides.length;
    this.anglePerItem = this.itemCount > 0 ? 360 / this.itemCount : 0;
    this.startAutoRotation();
  }

  ngOnDestroy(): void {
    this.stopAutoRotation();
    this.stopSnapAnimation();
  }

  private startAutoRotation(): void {
    if (!this.autoRotate || this.itemCount === 0) return;
    
    this.intervalId = setInterval(() => {
      if (!this.isDragging && !this.isSnapping) {
        this.rotation -= this.anglePerItem;
        this.snapToExactSlide();
      }
    }, this.rotationSpeed);
  }

  private stopAutoRotation(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  private stopSnapAnimation(): void {
    if (this.snapAnimationId) {
      cancelAnimationFrame(this.snapAnimationId);
      this.snapAnimationId = null;
    }
  }

  handlePrev(): void {
    if (this.itemCount === 0) return;
    this.stopAutoRotation();
    
    const currentExactRotation = this.getExactRotation();
    const targetExactRotation = currentExactRotation + this.anglePerItem;
    
    const exactMultiples = [
      targetExactRotation,
      targetExactRotation + 360,
      targetExactRotation - 360
    ];
    
    this.targetRotation = this.findClosestRotation(exactMultiples);
    this.startSnapAnimation();
  }

  handleNext(): void {
    if (this.itemCount === 0) return;
    this.stopAutoRotation();
    
    const currentExactRotation = this.getExactRotation();
    const targetExactRotation = currentExactRotation - this.anglePerItem;
    
    const exactMultiples = [
      targetExactRotation,
      targetExactRotation + 360,
      targetExactRotation - 360
    ];
    
    this.targetRotation = this.findClosestRotation(exactMultiples);
    this.startSnapAnimation();
  }

  private getExactRotation(): number {
    if (this.itemCount === 0) return 0;
    const normalizedRotation = ((-this.rotation % 360) + 360) % 360;
    const currentIndex = Math.round(normalizedRotation / this.anglePerItem) % this.itemCount;
    return -currentIndex * this.anglePerItem;
  }

  private findClosestRotation(rotations: number[]): number {
    let closestRotation = rotations[0];
    let minDistance = Math.abs(rotations[0] - this.rotation);
    
    for (let i = 1; i < rotations.length; i++) {
      const distance = Math.abs(rotations[i] - this.rotation);
      if (distance < minDistance) {
        minDistance = distance;
        closestRotation = rotations[i];
      }
    }
    
    return closestRotation;
  }

  onMouseDown(event: MouseEvent): void {
    if (this.itemCount === 0) return;
    this.isDragging = true;
    this.startX = event.clientX;
    this.currentRotation = this.rotation;
    this.stopAutoRotation();
    this.stopSnapAnimation();
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent): void {
    if (!this.isDragging || this.itemCount === 0) return;
    const deltaX = event.clientX - this.startX;
    this.rotation = this.currentRotation + deltaX * 0.25;
  }

  @HostListener('document:mouseup')
  onMouseUp(): void {
    if (this.isDragging) {
      this.isDragging = false;
      this.snapToExactSlide();
    }
  }

  onTouchStart(event: TouchEvent): void {
    if (event.touches.length === 0 || this.itemCount === 0) return;
    this.isDragging = true;
    this.startX = event.touches[0].clientX;
    this.currentRotation = this.rotation;
    this.touchPosition = {
      x: event.touches[0].clientX,
      identifier: event.touches[0].identifier
    };
    this.stopAutoRotation();
    this.stopSnapAnimation();
  }

  onTouchMove(event: TouchEvent): void {
    if (!this.isDragging || !this.touchPosition || this.itemCount === 0) return;
    
    const touch = Array.from(event.touches).find(
      t => t.identifier === this.touchPosition!.identifier
    );
    
    if (touch) {
      const deltaX = touch.clientX - this.startX;
      this.rotation = this.currentRotation + deltaX * 0.25;
    }
  }

  onTouchEnd(): void {
    if (this.isDragging) {
      this.isDragging = false;
      this.touchPosition = null;
      this.snapToExactSlide();
    }
  }

  goToSlide(index: number): void {
    if (this.itemCount === 0) return;
    this.stopAutoRotation();
    
    this.targetRotation = -index * this.anglePerItem;
    const currentRotation = this.getExactRotation();
    const targetRotation = this.targetRotation;
    
    const options = [
      targetRotation,
      targetRotation + 360,
      targetRotation - 360
    ];
    
    let closest = options[0];
    let minDist = Math.abs(options[0] - currentRotation);
    
    for (let i = 1; i < options.length; i++) {
      const dist = Math.abs(options[i] - currentRotation);
      if (dist < minDist) {
        minDist = dist;
        closest = options[i];
      }
    }
    
    this.targetRotation = closest;
    this.startSnapAnimation();
  }

  private snapToExactSlide(): void {
    if (this.itemCount === 0) return;
    
    const normalizedRotation = ((-this.rotation % 360) + 360) % 360;
    const nearestSlideIndex = Math.round(normalizedRotation / this.anglePerItem) % this.itemCount;
    const exactRotation = -nearestSlideIndex * this.anglePerItem;
    
    const currentRotation = this.rotation;
    const options = [
      exactRotation,
      exactRotation + 360,
      exactRotation - 360
    ];
    
    let closestRotation = options[0];
    let minDistance = Math.abs(options[0] - currentRotation);
    
    for (let i = 1; i < options.length; i++) {
      const distance = Math.abs(options[i] - currentRotation);
      if (distance < minDistance) {
        minDistance = distance;
        closestRotation = options[i];
      }
    }
    
    this.targetRotation = closestRotation;
    this.startSnapAnimation();
  }

  private startSnapAnimation(): void {
    this.isSnapping = true;
    this.stopSnapAnimation();
    
    const animate = () => {
      const difference = this.targetRotation - this.rotation;
      const threshold = 0.01;
      
      if (Math.abs(difference) < threshold) {
        this.rotation = this.targetRotation;
        this.isSnapping = false;
        this.snapAnimationId = null;
        return;
      }
      
      const easing = 0.12;
      this.rotation += difference * easing;
      
      if (Math.abs(difference) < 0.5) {
        this.rotation = this.targetRotation;
        this.isSnapping = false;
        this.snapAnimationId = null;
        return;
      }
      
      this.snapAnimationId = requestAnimationFrame(animate);
    };
    
    animate();
  }

  getItemTransform(index: number): string {
    const angle = index * this.anglePerItem;
    return `rotateY(${angle}deg) translateZ(${this.radius}px)`;
  }

  getItemOpacity(index: number): number {
    const angle = index * this.anglePerItem;
    const normalizedAngle = ((this.rotation + angle) % 360 + 360) % 360;
    const distanceFromFront = Math.abs(normalizedAngle > 180 ? 360 - normalizedAngle : normalizedAngle);
    return Math.max(0.1, 1 - (distanceFromFront / 180) * 0.9);
  }

  getItemScale(index: number): number {
    const angle = index * this.anglePerItem;
    const normalizedAngle = ((this.rotation + angle) % 360 + 360) % 360;
    const distanceFromFront = Math.abs(normalizedAngle > 180 ? 360 - normalizedAngle : normalizedAngle);
    return Math.max(0.7, 1 - (distanceFromFront / 180) * 0.3);
  }

  getCylinderStyle(): any {
    return {
      '--tz': `-${this.radius}px`,
      '--ry': `${this.rotation}deg`,
      'transform': `translateZ(-${this.radius}px) rotateY(${this.rotation}deg)`,
      'width': `${this.width}px`,
      'height': `${this.height}px`
    };
  }

  isActiveSlide(index: number): boolean {
    const normalizedRotation = ((-this.rotation % 360) + 360) % 360;
    const currentIndex = Math.round(normalizedRotation / this.anglePerItem) % this.itemCount;
    return currentIndex === index;
  }

  getCurrentImageIndex(): number {
    if (this.itemCount === 0) return 0;
    const normalizedRotation = ((-this.rotation % 360) + 360) % 360;
    return Math.round(normalizedRotation / this.anglePerItem) % this.itemCount;
  }

  trackByIndex(index: number): number {
    return index;
  }
}