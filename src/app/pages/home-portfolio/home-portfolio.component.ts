import { Component, OnInit, AfterViewInit, HostListener } from '@angular/core';
import { ScrollService } from '../../services/scroll.service';
import { ScrollColorService } from '../../services/scroll-color.service';
import { HeroComponent } from '../../components/hero/hero.component';
import { SectionDividerComponent } from '../../components/section-divider/section-divider.component';
import { AboutComponent } from '../../components/about/about.component';
import { ProjectsComponent } from '../../components/projects/projects.component';
import { ContactComponent } from '../../components/contact/contact.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../components/navbar/navbar.component';

import { DesignGalleryComponent } from '../../components/design-gallery/design-gallery.component';

@Component({
  selector: 'app-home-portfolio',
  templateUrl: './home-portfolio.component.html',
  styleUrls: ['./home-portfolio.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    NavbarComponent,
    HeroComponent,
    SectionDividerComponent,
    AboutComponent,
    ProjectsComponent,
    ContactComponent,
    DesignGalleryComponent,
    FooterComponent
  ]
})
export class HomePortfolioComponent implements OnInit, AfterViewInit {

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