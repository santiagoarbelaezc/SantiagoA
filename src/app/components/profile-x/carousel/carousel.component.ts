import { Component, Input, OnInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';

interface TouchPosition {
  x: number;
  identifier: number;
}

interface Slide {
  image: string;
}

@Component({
  selector: 'app-carousel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './carousel.component.html',
  styleUrl: './carousel.component.css'
})
export class CarouselComponent implements OnInit, OnDestroy {
  @Input() slides: Slide[] = [
    { image: 'assets/fondo1.png' },
    { image: 'assets/fondo8.png' },
    { image: 'assets/fondo3.jpg' },
    { image: 'assets/fondo4.png' },
    { image: 'assets/fondo10.png' },
    { image: 'assets/fondo6.png' }
  ];
  
  @Input() autoRotate: boolean = true;
  @Input() rotationSpeed: number = 4000;

  rotation: number = 0;
  isDragging: boolean = false;
  startX: number = 0;
  currentRotation: number = 0;
  
  private intervalId: any;
  private snapAnimationId: any;
  private touchPosition: TouchPosition | null = null;
  private targetRotation: number = 0;
  private isSnapping: boolean = false;

  itemCount: number = 0;
  anglePerItem: number = 0;
  radius: number = 870;

  ngOnInit(): void {
    this.itemCount = this.slides.length;
    this.anglePerItem = 360 / this.itemCount;
    this.startAutoRotation();
  }

  ngOnDestroy(): void {
    this.stopAutoRotation();
    this.stopSnapAnimation();
  }

  private startAutoRotation(): void {
    if (!this.autoRotate) return;
    
    this.intervalId = setInterval(() => {
      if (!this.isDragging && !this.isSnapping) {
        this.rotation -= this.anglePerItem;
        // Asegurarse de que quede alineado después de la rotación automática
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
    this.stopAutoRotation();
    
    // En lugar de simplemente sumar el ángulo, calcular la rotación exacta
    const currentExactRotation = this.getExactRotation();
    const targetExactRotation = currentExactRotation + this.anglePerItem;
    
    // Encontrar el múltiplo más cercano del ángulo por item
    const exactMultiples = [
      targetExactRotation,
      targetExactRotation + 360,
      targetExactRotation - 360
    ];
    
    // Seleccionar el más cercano a la rotación actual
    this.targetRotation = this.findClosestRotation(exactMultiples);
    this.startSnapAnimation();
  }

  handleNext(): void {
    this.stopAutoRotation();
    
    // En lugar de simplemente restar el ángulo, calcular la rotación exacta
    const currentExactRotation = this.getExactRotation();
    const targetExactRotation = currentExactRotation - this.anglePerItem;
    
    // Encontrar el múltiplo más cercano del ángulo por item
    const exactMultiples = [
      targetExactRotation,
      targetExactRotation + 360,
      targetExactRotation - 360
    ];
    
    // Seleccionar el más cercano a la rotación actual
    this.targetRotation = this.findClosestRotation(exactMultiples);
    this.startSnapAnimation();
  }

  // Método para obtener la rotación exacta alineada
  private getExactRotation(): number {
    // Calcular el índice del slide actual basado en la rotación
    const normalizedRotation = ((-this.rotation % 360) + 360) % 360;
    const currentIndex = Math.round(normalizedRotation / this.anglePerItem) % this.itemCount;
    
    // Devolver la rotación exacta para ese índice
    return -currentIndex * this.anglePerItem;
  }

  // Método para encontrar la rotación más cercana
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
    this.isDragging = true;
    this.startX = event.clientX;
    this.currentRotation = this.rotation;
    this.stopAutoRotation();
    this.stopSnapAnimation();
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent): void {
    if (!this.isDragging) return;
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
    if (event.touches.length === 0) return;
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
    if (!this.isDragging || !this.touchPosition) return;
    
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
    this.stopAutoRotation();
    // Ir directamente al slide exacto
    this.targetRotation = -index * this.anglePerItem;
    
    // Ajustar para encontrar el camino más corto
    const currentRotation = this.getExactRotation();
    const targetRotation = this.targetRotation;
    
    // Calcular las opciones posibles
    const options = [
      targetRotation,
      targetRotation + 360,
      targetRotation - 360
    ];
    
    // Encontrar la opción más cercana
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

  // Método mejorado para alinearse exactamente
  private snapToExactSlide(): void {
    // Calcular el índice del slide más cercano
    const normalizedRotation = ((-this.rotation % 360) + 360) % 360;
    const nearestSlideIndex = Math.round(normalizedRotation / this.anglePerItem) % this.itemCount;
    
    // Calcular la rotación exacta para ese slide
    const exactRotation = -nearestSlideIndex * this.anglePerItem;
    
    // Buscar la rotación más cercana considerando múltiples vueltas
    const currentRotation = this.rotation;
    const options = [
      exactRotation,
      exactRotation + 360,
      exactRotation - 360
    ];
    
    // Encontrar la opción más cercana a la rotación actual
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
      const threshold = 0.01; // Umbral más pequeño para mayor precisión
      
      if (Math.abs(difference) < threshold) {
        // Asegurarse de que la rotación final sea exacta
        this.rotation = this.targetRotation;
        this.isSnapping = false;
        this.snapAnimationId = null;
        return;
      }
      
      // Animación con easing para un movimiento suave pero preciso
      const easing = 0.12; // Aumentado ligeramente para ser más directo
      this.rotation += difference * easing;
      
      // Si estamos muy cerca, saltar directamente al final
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
      'transform': `translateZ(-${this.radius}px) rotateY(${this.rotation}deg)`
    };
  }

  isActiveSlide(index: number): boolean {
    // Calcular el índice actual exacto
    const normalizedRotation = ((-this.rotation % 360) + 360) % 360;
    const currentIndex = Math.round(normalizedRotation / this.anglePerItem) % this.itemCount;
    return currentIndex === index;
  }

  trackByIndex(index: number): number {
    return index;
  }
}