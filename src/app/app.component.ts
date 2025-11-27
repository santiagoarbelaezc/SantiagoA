import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import * as AOS from 'aos';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'SantiagoA';

  ngOnInit() {
    AOS.init({
      duration: 800,
      easing: 'ease-in-out',
      once: true,
      mirror: false,
      offset: 100
    });
  }

  // Recargar AOS cuando la ruta cambie (para transiciones suaves)
  onActivate() {
    setTimeout(() => {
      AOS.refresh();
    }, 500);
  }
}