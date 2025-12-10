import { Component, OnInit, AfterViewInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-profile-x-about',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile-x-about.component.html',
  styleUrls: ['./profile-x-about.component.css']
})
export class ProfileXAboutComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('waveCanvas') waveCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('wavePreview') wavePreview!: ElementRef<HTMLCanvasElement>;

  // Controles de onda
  waveIntensity = 1.0;
  waveSpeed = 1.5;
  waveFrequency = 3.0;
  waveAmplitude = 80;
  
  // Estado
  isAnimating = true;
  currentFPS = 60;
  frameCount = 0;
  
  // Contextos de canvas
  private ctx!: CanvasRenderingContext2D;
  private previewCtx!: CanvasRenderingContext2D;
  private animationFrameId: number = 0;
  private lastTime = 0;
  
  // Código de ejemplo
  tsCodeExample = `// Wave Deformation Effect
export class WaveEffect {
  private ctx: CanvasRenderingContext2D;
  private time = 0;
  
  constructor(canvas: HTMLCanvasElement) {
    this.ctx = canvas.getContext('2d')!;
  }
  
  // Función de onda senoidal modificada
  private waveFunction(x: number, time: number): number {
    return Math.sin(x * this.frequency + time) * this.amplitude;
  }
  
  // Renderizar onda con deformación
  renderWave() {
    const { width, height } = this.ctx.canvas;
    this.ctx.clearRect(0, 0, width, height);
    
    this.ctx.beginPath();
    for(let x = 0; x < width; x++) {
      const y = height/2 + this.waveFunction(x/100, this.time);
      if(x === 0) this.ctx.moveTo(x, y);
      else this.ctx.lineTo(x, y);
    }
    this.ctx.strokeStyle = '#ffffff';
    this.ctx.lineWidth = 2;
    this.ctx.stroke();
  }
  
  // Animar
  animate() {
    this.time += 0.05;
    this.renderWave();
    requestAnimationFrame(() => this.animate());
  }
}`;

  constructor() { }

  ngOnInit(): void {
    // Inicialización de valores
  }

  ngAfterViewInit(): void {
    this.initCanvas();
    this.startAnimation();
  }

  ngOnDestroy(): void {
    this.stopAnimation();
  }

  private initCanvas(): void {
    // Canvas principal (fondo)
    const canvas = this.waveCanvas.nativeElement;
    this.ctx = canvas.getContext('2d', { alpha: true })!;
    
    // Canvas de preview
    const previewCanvas = this.wavePreview.nativeElement;
    this.previewCtx = previewCanvas.getContext('2d', { alpha: true })!;
    
    // Configurar tamaño de canvas
    this.resizeCanvas();
    
    // Listener para resize
    window.addEventListener('resize', () => this.resizeCanvas());
  }

  private resizeCanvas(): void {
    const canvas = this.waveCanvas.nativeElement;
    const previewCanvas = this.wavePreview.nativeElement;
    const container = canvas.parentElement!;
    
    // Tamaño del canvas principal (fondo completo)
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;
    
    // Tamaño del preview
    previewCanvas.width = previewCanvas.parentElement!.clientWidth;
    previewCanvas.height = 200;
  }

  private startAnimation(): void {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
    
    this.lastTime = performance.now();
    this.animate();
  }

  private stopAnimation(): void {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = 0;
    }
  }

  private animate(): void {
    const currentTime = performance.now();
    const deltaTime = currentTime - this.lastTime;
    
    // Calcular FPS
    if (deltaTime > 0) {
      this.currentFPS = Math.round(1000 / deltaTime);
    }
    
    if (this.isAnimating) {
      this.renderBackground();
      this.renderPreview();
      this.frameCount++;
    }
    
    this.lastTime = currentTime;
    this.animationFrameId = requestAnimationFrame(() => this.animate());
  }

  private renderBackground(): void {
    const ctx = this.ctx;
    const width = ctx.canvas.width;
    const height = ctx.canvas.height;
    
    // Limpiar con fade sutil
    ctx.fillStyle = 'rgba(0, 0, 0, 0.02)';
    ctx.fillRect(0, 0, width, height);
    
    // Dibujar múltiples ondas en el fondo
    const time = Date.now() * 0.001 * this.waveSpeed;
    
    // Onda principal (más visible)
    this.drawWaveLayer(ctx, width, height, time, {
      amplitude: this.waveAmplitude * 0.8,
      frequency: this.waveFrequency * 0.5,
      color: 'rgba(255, 255, 255, 0.15)',
      lineWidth: 1.5,
      offsetY: height * 0.3
    });
    
    // Onda secundaria (más sutil)
    this.drawWaveLayer(ctx, width, height, time * 0.8, {
      amplitude: this.waveAmplitude * 0.5,
      frequency: this.waveFrequency * 0.3,
      color: 'rgba(255, 255, 255, 0.08)',
      lineWidth: 1,
      offsetY: height * 0.6
    });
    
    // Onda terciaria (muy sutil)
    this.drawWaveLayer(ctx, width, height, time * 1.2, {
      amplitude: this.waveAmplitude * 0.3,
      frequency: this.waveFrequency * 0.7,
      color: 'rgba(255, 255, 255, 0.05)',
      lineWidth: 0.5,
      offsetY: height * 0.8
    });
  }

  private drawWaveLayer(
    ctx: CanvasRenderingContext2D, 
    width: number, 
    height: number, 
    time: number,
    options: {
      amplitude: number,
      frequency: number,
      color: string,
      lineWidth: number,
      offsetY: number
    }
  ): void {
    const { amplitude, frequency, color, lineWidth, offsetY } = options;
    
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    for (let x = 0; x <= width; x += 2) {
      // Función de onda con múltiples senos para deformación orgánica
      const wave1 = Math.sin(x * frequency * 0.01 + time) * amplitude;
      const wave2 = Math.sin(x * frequency * 0.02 + time * 1.3) * amplitude * 0.5;
      const wave3 = Math.sin(x * frequency * 0.005 + time * 0.7) * amplitude * 0.3;
      
      // Combinar ondas con intensidad aplicada
      const y = offsetY + (wave1 + wave2 + wave3) * this.waveIntensity;
      
      if (x === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    
    ctx.stroke();
    
    // Añadir puntos en los picos
    for (let x = 0; x <= width; x += 40) {
      const wave1 = Math.sin(x * frequency * 0.01 + time) * amplitude;
      const wave2 = Math.sin(x * frequency * 0.02 + time * 1.3) * amplitude * 0.5;
      const wave3 = Math.sin(x * frequency * 0.005 + time * 0.7) * amplitude * 0.3;
      
      const y = offsetY + (wave1 + wave2 + wave3) * this.waveIntensity;
      
      ctx.beginPath();
      ctx.fillStyle = color.replace(')', ', 0.6)');
      ctx.arc(x, y, 2, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  private renderPreview(): void {
    const ctx = this.previewCtx;
    const width = ctx.canvas.width;
    const height = ctx.canvas.height;
    const time = Date.now() * 0.001 * this.waveSpeed;
    
    // Limpiar canvas
    ctx.clearRect(0, 0, width, height);
    
    // Fondo del preview
    ctx.fillStyle = 'rgba(10, 10, 10, 0.5)';
    ctx.fillRect(0, 0, width, height);
    
    // Dibujar onda de preview (más detallada)
    this.drawDetailedWave(ctx, width, height, time, {
      amplitude: this.waveAmplitude,
      frequency: this.waveFrequency,
      color: 'rgba(255, 255, 255, 0.8)',
      lineWidth: 2,
      offsetY: height / 2
    });
    
    // Añadir guías
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 0.5;
    
    // Línea central
    ctx.beginPath();
    ctx.moveTo(0, height / 2);
    ctx.lineTo(width, height / 2);
    ctx.stroke();
    
    // Bordes
    ctx.strokeRect(0, 0, width, height);
  }

  private drawDetailedWave(
    ctx: CanvasRenderingContext2D, 
    width: number, 
    height: number, 
    time: number,
    options: {
      amplitude: number,
      frequency: number,
      color: string,
      lineWidth: number,
      offsetY: number
    }
  ): void {
    const { amplitude, frequency, color, lineWidth, offsetY } = options;
    
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.lineCap = 'round';
    
    // Usar más puntos para onda más suave
    for (let x = 0; x <= width; x += 1) {
      // Función de deformación más compleja
      const deformation = 
        Math.sin(x * frequency * 0.01 + time) * 
        Math.sin(x * frequency * 0.005 + time * 0.5) * 
        this.waveIntensity;
      
      const wave = 
        Math.sin(x * frequency * 0.01 + time + deformation) * amplitude +
        Math.sin(x * frequency * 0.03 + time * 1.7) * amplitude * 0.4 +
        Math.sin(x * frequency * 0.007 + time * 0.3) * amplitude * 0.2;
      
      const y = offsetY + wave;
      
      if (x === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    
    ctx.stroke();
    
    // Relleno sutil debajo de la onda
    ctx.lineTo(width, height);
    ctx.lineTo(0, height);
    ctx.closePath();
    ctx.fillStyle = color.replace(')', ', 0.1)');
    ctx.fill();
  }

  // Métodos públicos para controles
  updateWave(): void {
    // Los valores se actualizan automáticamente a través del two-way binding
  }

  setPreset(preset: 'sutil' | 'moderado' | 'intenso'): void {
    switch(preset) {
      case 'sutil':
        this.waveIntensity = 0.5;
        this.waveSpeed = 0.8;
        this.waveFrequency = 2.0;
        this.waveAmplitude = 40;
        break;
      case 'moderado':
        this.waveIntensity = 1.0;
        this.waveSpeed = 1.5;
        this.waveFrequency = 3.0;
        this.waveAmplitude = 80;
        break;
      case 'intenso':
        this.waveIntensity = 1.8;
        this.waveSpeed = 2.5;
        this.waveFrequency = 5.0;
        this.waveAmplitude = 120;
        break;
    }
  }

  toggleAnimation(): void {
    this.isAnimating = !this.isAnimating;
    if (this.isAnimating) {
      this.startAnimation();
    }
  }
}