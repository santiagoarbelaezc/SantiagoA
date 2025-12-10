export interface TrailParticle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  baseOpacity: number;
  currentOpacity: number;
  trail: Array<{x: number, y: number, opacity: number}>;
  maxTrailLength: number;
  life: number;
  maxLife: number;
  color: string;
  isMouseAttracted: boolean;
  rotation: number;
  rotationSpeed: number;
  pulsePhase: number;
  pulseSpeed: number;
}

export interface ParticlesConfig {
  count: number;
  mouseAttraction: number;
  trailLength: number;
  speed: number;
  fadeSpeed: number;
  particleSize: number;
  lineWidth?: number;
  connectDistance?: number;
  blur?: number;
  particleType?: 'circle' | 'cross';
}