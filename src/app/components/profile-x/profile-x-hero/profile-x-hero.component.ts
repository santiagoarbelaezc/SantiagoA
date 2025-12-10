import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import AOS from 'aos';

@Component({
  selector: 'app-profile-x-hero',
  standalone: true,
  templateUrl: './profile-x-hero.component.html',
  styleUrls: ['./profile-x-hero.component.css']
})
export class ProfileXHeroComponent implements OnInit, AfterViewInit {
  
  constructor(private router: Router) {}

  ngOnInit(): void {
    // AOS ya está inicializado en app.component
  }

  ngAfterViewInit(): void {
    // Solo refrescar AOS, nada más
    AOS.refresh();
  }

  exploreProfile(): void {
    this.router.navigate(['/profile-x'], { fragment: 'about' });
  }
}