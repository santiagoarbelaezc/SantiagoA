import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-background',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './background.component.html',
  styleUrls: ['./background.component.css']
})
export class BackgroundComponent {
  @Input() animationSpeed: number = 15;
  @Input() opacity: number = 0.9;
  @Input() blurAmount: number = 0.5;

  get styleOverlay() {
    return {
      'animation-duration': `${this.animationSpeed}s`,
      'opacity': this.opacity,
      'filter': `blur(${this.blurAmount}px)`
    };
  }
}
