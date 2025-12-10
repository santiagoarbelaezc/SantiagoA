// section-divider.component.ts
import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-section-divider',
  templateUrl: './section-divider.component.html',
  styleUrls: ['./section-divider.component.css'],
    standalone: true, 
    imports: [CommonModule]
})
export class SectionDividerComponent {
  @Input() theme: 'white' | 'brown' | 'black' = 'white';
  @Input() animation: 'scan' | 'pulse' | 'glow' = 'scan';
}