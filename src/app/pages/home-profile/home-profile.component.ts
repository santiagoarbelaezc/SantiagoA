import { Component, OnInit, AfterViewInit, HostListener } from '@angular/core';
import { ScrollService } from '../../services/scroll.service';
import { ScrollColorService } from '../../services/scroll-color.service';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { ProfileXHeroComponent } from '../../components/profile-x/profile-x-hero/profile-x-hero.component';
import { ProfileXAboutComponent } from '../../components/profile-x/profile-x-about/profile-x-about.component';
import { ProfileXCarouselComponent } from '../../components/profile-x/profile-x-carousel/profile-x-carousel.component';

@Component({
  selector: 'app-home-profile',
  templateUrl: './home-profile.component.html',
  styleUrls: ['./home-profile.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    ProfileXCarouselComponent,
    ProfileXHeroComponent,
    ProfileXAboutComponent
  ]
})
export class HomeProfileComponent implements OnInit, AfterViewInit {

  constructor(
    private scrollService: ScrollService,
    private scrollColorService: ScrollColorService
  ) {}

  ngOnInit() {
    setTimeout(() => {
      this.scrollService.checkScroll();
    }, 100);
  }

  ngAfterViewInit(): void {
    // Forzar recálculo de posiciones para el servicio de color
    setTimeout(() => {
      this.scrollColorService.refreshSectionPositions();
    }, 1000);
  }

  @HostListener('window:scroll')
  onWindowScroll() {
    this.scrollService.checkScroll();
  }

  @HostListener('window:resize')
  onWindowResize() {
    // Recalcular posiciones cuando la ventana cambie de tamaño
    setTimeout(() => {
      this.scrollColorService.refreshSectionPositions();
    }, 300);
  }
}