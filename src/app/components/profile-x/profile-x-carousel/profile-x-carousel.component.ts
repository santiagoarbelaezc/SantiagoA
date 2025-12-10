import { CommonModule } from '@angular/common';
import { 
  Component, 
  OnInit, 
  OnDestroy, 
  HostListener,
  AfterViewInit,
  Renderer2,
  ElementRef,
  ViewChild 
} from '@angular/core';

@Component({
  selector: 'app-profile-x-carousel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile-x-carousel.component.html',
  styleUrls: ['./profile-x-carousel.component.css']
})
export class ProfileXCarouselComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('sceneElement') sceneElement!: ElementRef;
  
  // Imágenes para el carrusel
  images = [
    'assets/fondo1.png',
    'assets/fondo2.jpg',
    'assets/fondo3.jpg',
    'assets/fondo4.png',
    'assets/fondo5.png'
  ];

  // Estado del carrusel
  rotation = 0;
  isDragging = false;
  startX = 0;
  startRotation = 0;
  
  // Configuración del carrusel
  itemCount = this.images.length;
  anglePerItem = 360 / this.itemCount;
  radius = 700; // Radio grande para mostrar todas las imágenes
  
  // Auto-rotación
  autoRotate = true;
  rotationSpeed = 4000; // 4 segundos por rotación
  private rotateInterval: any;
  
  // Para los event listeners
  private mouseMoveListener: (() => void) | null = null;
  private mouseUpListener: (() => void) | null = null;

  constructor(private renderer: Renderer2) {}

  ngOnInit() {
    // Iniciar auto-rotación si está activada
    if (this.autoRotate) {
      this.startAutoRotation();
    }
  }

  ngAfterViewInit() {
    // Asegurarse de que el carrusel esté centrado
    setTimeout(() => {
      this.updateCarousel();
    }, 100);
  }

  ngOnDestroy() {
    this.stopAutoRotation();
    this.cleanupListeners();
  }

  // ===== AUTO-ROTACIÓN =====
  private startAutoRotation() {
    this.stopAutoRotation();
    this.rotateInterval = setInterval(() => {
      if (!this.isDragging) {
        this.rotation -= this.anglePerItem;
        this.updateCarousel();
      }
    }, this.rotationSpeed);
  }

  private stopAutoRotation() {
    if (this.rotateInterval) {
      clearInterval(this.rotateInterval);
      this.rotateInterval = null;
    }
  }

  private resetAutoRotation() {
    if (this.autoRotate) {
      this.stopAutoRotation();
      this.startAutoRotation();
    }
  }

  // ===== EVENTOS DE MOUSE Y TOUCH =====
  onMouseDown(event: MouseEvent) {
    event.preventDefault();
    this.startDrag(event.clientX);
  }

  onTouchStart(event: TouchEvent) {
    event.preventDefault();
    if (event.touches.length === 1) {
      this.startDrag(event.touches[0].clientX);
    }
  }

  private startDrag(clientX: number) {
    this.isDragging = true;
    this.startX = clientX;
    this.startRotation = this.rotation;
    
    // Detener auto-rotación mientras se arrastra
    this.stopAutoRotation();
    
    // Agregar listeners globales
    this.addGlobalListeners();
  }

  private addGlobalListeners() {
    // Mouse move listener
    this.mouseMoveListener = this.renderer.listen(
      'document', 
      'mousemove', 
      this.handleMouseMove.bind(this)
    );
    
    // Touch move listener
    this.renderer.listen(
      'document', 
      'touchmove', 
      this.handleTouchMove.bind(this)
    );
    
    // Mouse up listener
    this.mouseUpListener = this.renderer.listen(
      'document', 
      'mouseup', 
      this.endDrag.bind(this)
    );
    
    // Touch end listener
    this.renderer.listen(
      'document', 
      'touchend', 
      this.endDrag.bind(this)
    );
  }

  private handleMouseMove(event: MouseEvent) {
    if (!this.isDragging) return;
    event.preventDefault();
    
    const deltaX = event.clientX - this.startX;
    this.rotation = this.startRotation + (deltaX * 0.25);
    this.updateCarousel();
  }

  private handleTouchMove(event: TouchEvent) {
    if (!this.isDragging || event.touches.length !== 1) return;
    event.preventDefault();
    
    const deltaX = event.touches[0].clientX - this.startX;
    this.rotation = this.startRotation + (deltaX * 0.25);
    this.updateCarousel();
  }

  private endDrag() {
    if (!this.isDragging) return;
    
    this.isDragging = false;
    this.cleanupListeners();
    
    // Reanudar auto-rotación si estaba activa
    if (this.autoRotate) {
      this.startAutoRotation();
    }
  }

  private cleanupListeners() {
    if (this.mouseMoveListener) {
      this.mouseMoveListener();
      this.mouseMoveListener = null;
    }
    
    if (this.mouseUpListener) {
      this.mouseUpListener();
      this.mouseUpListener = null;
    }
  }

  // ===== CONTROLES DE NAVEGACIÓN =====
  onPrev() {
    this.rotation += this.anglePerItem;
    this.updateCarousel();
    this.resetAutoRotation();
  }

  onNext() {
    this.rotation -= this.anglePerItem;
    this.updateCarousel();
    this.resetAutoRotation();
  }

  goToSlide(index: number) {
    const targetRotation = -index * this.anglePerItem;
    this.rotation = targetRotation;
    this.updateCarousel();
    this.resetAutoRotation();
  }

  // ===== CÁLCULOS VISUALES =====
  private updateCarousel() {
    // Normalizar la rotación para mantenerla dentro de 360°
    this.rotation = ((this.rotation % 360) + 360) % 360;
  }

  getItemStyle(index: number): any {
    const angle = index * this.anglePerItem;
    const normalizedAngle = ((this.rotation + angle) % 360 + 360) % 360;
    const distanceFromFront = Math.abs(normalizedAngle > 180 ? 360 - normalizedAngle : normalizedAngle);
    
    // Cálculo de opacidad y escala como en React
    const opacity = Math.max(0.15, 1 - (distanceFromFront / 180) * 0.85);
    
    return {
      transform: `rotateY(${angle}deg) translateZ(${this.radius}px)`,
      opacity: opacity
    };
  }

  getImageWrapperStyle(index: number): any {
    const angle = index * this.anglePerItem;
    const normalizedAngle = ((this.rotation + angle) % 360 + 360) % 360;
    const distanceFromFront = Math.abs(normalizedAngle > 180 ? 360 - normalizedAngle : normalizedAngle);
    const scale = Math.max(0.85, 1 - (distanceFromFront / 180) * 0.15);
    
    return {
      transform: `scale(${scale})`
    };
  }

  getCylinderTransform(): string {
    return `translateZ(-${this.radius}px) rotateY(${this.rotation}deg)`;
  }

  getCylinderStyle(): any {
    return {
      transform: `translateZ(-${this.radius}px) rotateY(${this.rotation}deg)`
    };
  }

  // ===== CÁLCULO DE SLIDE ACTIVO =====
  getActiveSlideIndex(): number {
    const normalizedRotation = ((-this.rotation % 360 + 360) % 360);
    return Math.round(normalizedRotation / this.anglePerItem) % this.itemCount;
  }

  // ===== CONTROL DE TECLADO =====
  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    switch (event.key) {
      case 'ArrowLeft':
        event.preventDefault();
        this.onPrev();
        break;
      case 'ArrowRight':
        event.preventDefault();
        this.onNext();
        break;
      case ' ':
        event.preventDefault();
        this.onNext();
        break;
    }
  }

  // ===== WHEEL EVENT =====
  @HostListener('wheel', ['$event'])
  onWheel(event: WheelEvent) {
    event.preventDefault();
    
    if (this.isDragging) return;
    
    const delta = Math.sign(event.deltaY);
    if (delta > 0) {
      this.onNext();
    } else {
      this.onPrev();
    }
  }
}