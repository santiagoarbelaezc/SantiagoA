import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class ContactComponent {
  contactLinks = [
    { text: 'arbelaezz.c11@gmail.com', url: 'mailto:arbelaezz.c11@gmail.com', external: false },
    { text: 'LinkedIn', url: 'https://www.linkedin.com/in/santiago-arbelaez-contreras-9830b5290/', external: true },
    { text: 'GitHub', url: 'https://github.com/santiagoarbelaezc', external: true }
  ];
}