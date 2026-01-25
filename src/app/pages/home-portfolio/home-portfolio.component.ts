import { Component, OnInit, AfterViewInit, HostListener } from '@angular/core';
import { ScrollService } from '../../services/scroll.service';
import { ScrollColorService } from '../../services/scroll-color.service';
import { HeroComponent } from '../../components/hero/hero.component';
import { SectionDividerComponent } from '../../components/section-divider/section-divider.component';
import { AboutComponent } from '../../components/about/about.component';
import { ProjectsVideoComponent } from '../../components/projects-video/projects-video.component';
import { ContactComponent } from '../../components/contact/contact.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../components/navbar/navbar.component';

import { ProjectTodotechComponent } from "../../components/projects-video/project-todotech/project-todotech.component";
import { ProjectPlaxtilineasComponent } from "../../components/projects-video/project-plaxtilineas/project-plaxtilineas.component";
import { ProjectEspumasComponent } from "../../components/projects-video/project-espumas/project-espumas.component";

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
    ProjectsVideoComponent,
    ContactComponent,
    FooterComponent,
    ProjectTodotechComponent,
    ProjectPlaxtilineasComponent,
    ProjectEspumasComponent
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