import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ScrollColorService } from './services/scroll-color.service';
import { Subscription } from 'rxjs';
import * as AOS from 'aos';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'SantiagoA';
  currentBackground = '#000000'; // Cambiado a negro para el tema
  private colorSubscription!: Subscription;
  private isBrowser: boolean;

  constructor(
    private scrollColorService: ScrollColorService,
    @Inject(PLATFORM_ID) private platformId: any
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit() {
    // Inicializar AOS con configuración para el carrusel
    AOS.init({
      duration: 1200,
      easing: 'ease-in-out',
      once: false, // Cambiado a false para que se animen al hacer scroll
      mirror: true,
      offset: 100
    });

    // Suscribirse a los cambios de color del fondo
    if (this.isBrowser) {
      this.colorSubscription = this.scrollColorService.currentColor$.subscribe(color => {
        this.currentBackground = color;
      });
    }
  }

  ngOnDestroy() {
    // Limpiar suscripción
    if (this.colorSubscription) {
      this.colorSubscription.unsubscribe();
    }
  }

  // Recargar AOS cuando la ruta cambie
  onActivate() {
    setTimeout(() => {
      AOS.refresh();
      
      if (this.isBrowser) {
        setTimeout(() => {
          this.scrollColorService.refreshSectionPositions();
        }, 100);
      }
    }, 500);
  }
}