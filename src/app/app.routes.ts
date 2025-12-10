import { Routes } from '@angular/router';
import { HomePortfolioComponent } from './pages/home-portfolio/home-portfolio.component';
import { HomeProfileComponent } from './pages/home-profile/home-profile.component';
import { ProfileXCarouselComponent } from './components/profile-x/profile-x-carousel/profile-x-carousel.component';
import { CarouselComponent } from './components/profile-x/carousel/carousel.component';
import { BackgroundComponent } from './components/profile-x/background/background.component';

import { ProjectPageComponent } from './components/project-page/project-page.component';


export const routes: Routes = [

    {path: '', redirectTo: 'portfolio', pathMatch: 'full'},
    {path:'portfolio', component: HomePortfolioComponent},
    {path:'project', component: ProjectPageComponent},
    {path:'profile-x', component: HomeProfileComponent},
    {path:'profile-x-carousel', component: ProfileXCarouselComponent},
    {path:'carousel', component: CarouselComponent},
    {path:'background', component: BackgroundComponent}
];
