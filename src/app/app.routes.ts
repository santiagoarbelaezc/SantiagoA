import { Routes } from '@angular/router';
import { HomePortfolioComponent } from './pages/home-portfolio/home-portfolio.component';

import { BackgroundComponent } from './components/profile-x/background/background.component';

import { ProjectPageComponent } from './components/project-page/project-page.component';


export const routes: Routes = [

    {path: '', redirectTo: 'portfolio', pathMatch: 'full'},
    {path:'portfolio', component: HomePortfolioComponent},
    {path:'project', component: ProjectPageComponent},
    {path:'background', component: BackgroundComponent}
];
