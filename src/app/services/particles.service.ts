import { Injectable, OnDestroy } from '@angular/core';

// Interface simplificada para mejor performance
export interface Particle {
  x: number;
  y: number;
  vx: number; // velocidad x
  vy: number; // velocidad y
  radius: number;
  color: string;
  opacity: number;
  connections: Particle[]; // Referencias a partículas cercanas
}

export interface ParticlesConfig {
  count: number;
  particleSize: number;
  speed: number;
  lineWidth: number;
  connectDistance: number;
  mouseRadius: number;
  fade: number;
}

@Injectable({
  providedIn: 'root'
})
export class ParticlesService implements OnDestroy {
  private particles: Particle[] = [];
  private animationFrameId: number = 0;
  private ctx!: CanvasRenderingContext2D;
  private mouseX: number = -1000;
  private mouseY: number = -1000;
  private canvasWidth: number = 0;
  private canvasHeight: number = 0;
  private frameCount: number = 0;
  
  // Configuración ultra ligera
  private config: ParticlesConfig = {
    count: 50,           // Reducido para performance
    particleSize: 1.2,
    speed: 0.5,
    lineWidth: 0.2,
    connectDistance: 100,
    mouseRadius: 150,
    fade: 0.95          // Más rápido para liberar memoria
  };

  constructor() {}

  ngOnDestroy(): void {
    this.stop();
  }

  initialize(canvas: HTMLCanvasElement, customConfig?: Partial<ParticlesConfig>): void {
    if (customConfig) {
      Object.assign(this.config, customConfig);
    }

    this.ctx = canvas.getContext('2d', { alpha: true })!;
    
    const setupCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      
      this.canvasWidth = rect.width;
      this.canvasHeight = rect.height;
      
      this.ctx.scale(dpr, dpr);
      this.initParticles();
    };

    setupCanvas();
    
    // Debounce resize para performance
    let resizeTimeout: any;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        setupCanvas();
      }, 100);
    });
  }

  private initParticles(): void {
    this.particles = [];
    
    // Pre-calcular colores para performance
    const colors = this.getColors();
    
    for (let i = 0; i < this.config.count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = this.config.speed * (Math.random() * 0.5 + 0.5);
      
      this.particles.push({
        x: Math.random() * this.canvasWidth,
        y: Math.random() * this.canvasHeight,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        radius: this.config.particleSize * (Math.random() * 0.5 + 0.75),
        color: colors[i % colors.length],
        opacity: Math.random() * 0.3 + 0.1,
        connections: []
      });
    }
  }

  private getColors(): string[] {
    return [
      'rgba(255, 255, 255, {opacity})',
      'rgba(240, 240, 240, {opacity})',
      'rgba(230, 230, 230, {opacity})',
      'rgba(220, 220, 220, {opacity})'
    ];
  }

  updateMouse(x: number, y: number): void {
    this.mouseX = x;
    this.mouseY = y;
  }

  start(): void {
    if (this.animationFrameId) {
      this.stop();
    }
    this.animate();
  }

  stop(): void {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = 0;
    }
    // Liberar memoria
    this.particles = [];
  }

  private animate(): void {
    // Actualizar cada 2 frames para mejor performance
    if (this.frameCount % 2 === 0) {
      this.update();
      this.draw();
    }
    
    this.frameCount++;
    this.animationFrameId = requestAnimationFrame(() => this.animate());
  }

  private update(): void {
    // Limpiar conexiones anteriores
    this.particles.forEach(p => p.connections = []);

    // Actualizar posiciones y detectar conexiones
    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];
      
      // Movimiento básico
      p.x += p.vx;
      p.y += p.vy;
      
      // Rebotes suaves
      if (p.x < 0 || p.x > this.canvasWidth) p.vx *= -0.98;
      if (p.y < 0 || p.y > this.canvasHeight) p.vy *= -0.98;
      
      // Contener dentro del canvas
      p.x = Math.max(0, Math.min(this.canvasWidth, p.x));
      p.y = Math.max(0, Math.min(this.canvasHeight, p.y));
      
      // Interacción con mouse (muy ligera)
      if (this.mouseX > 0 && this.mouseY > 0) {
        const dx = this.mouseX - p.x;
        const dy = this.mouseY - p.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < this.config.mouseRadius) {
          const force = 0.02 * (1 - distance / this.config.mouseRadius);
          p.vx += dx * force;
          p.vy += dy * force;
        }
      }
      
      // Fricción
      p.vx *= 0.99;
      p.vy *= 0.99;
      
      // Detectar conexiones para dibujar después
      for (let j = i + 1; j < this.particles.length; j++) {
        const p2 = this.particles[j];
        const dx = p.x - p2.x;
        const dy = p.y - p2.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < this.config.connectDistance) {
          p.connections.push(p2);
        }
      }
    }
  }

  private draw(): void {
    // Limpiar canvas con fade muy sutil
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.03)';
    this.ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
    
    // Dibujar conexiones primero
    this.drawConnections();
    
    // Dibujar partículas
    this.drawParticles();
  }

  private drawConnections(): void {
    this.ctx.lineWidth = this.config.lineWidth;
    this.ctx.lineCap = 'round';
    
    for (const p of this.particles) {
      for (const p2 of p.connections) {
        const dx = p.x - p2.x;
        const dy = p.y - p2.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // Opacidad basada en distancia
        const opacity = (1 - distance / this.config.connectDistance) * 0.15;
        
        this.ctx.beginPath();
        this.ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
        this.ctx.moveTo(p.x, p.y);
        this.ctx.lineTo(p2.x, p2.y);
        this.ctx.stroke();
      }
    }
  }

  private drawParticles(): void {
    for (const p of this.particles) {
      // Dibujar partícula (círculo muy simple)
      this.ctx.beginPath();
      const color = p.color.replace('{opacity}', p.opacity.toString());
      this.ctx.fillStyle = color;
      this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      this.ctx.fill();
      
      // Borde ultra delgado
      this.ctx.beginPath();
      this.ctx.strokeStyle = color.replace(')', ', 0.6)');
      this.ctx.lineWidth = 0.1;
      this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      this.ctx.stroke();
      
      // Punto central mínimo
      this.ctx.beginPath();
      this.ctx.fillStyle = color.replace(')', ', 0.9)');
      this.ctx.arc(p.x, p.y, p.radius * 0.3, 0, Math.PI * 2);
      this.ctx.fill();
    }
  }

  // Métodos públicos simplificados
  setCount(count: number): void {
    this.config.count = Math.max(10, Math.min(100, count));
    this.initParticles();
  }

  setSpeed(speed: number): void {
    this.config.speed = speed;
  }

  getStats(): { particles: number, fps: number } {
    return {
      particles: this.particles.length,
      fps: 60 // Estimado
    };
  }
}