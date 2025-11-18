import { Routes } from '@angular/router';
import { DesignPage } from './pages/design-page/design-page';
import { SolvePage } from './pages/solve-page/solve-page';

export const routes: Routes = [
  { path: 'design', component: DesignPage },
  { path: 'solve/:encoded', component: SolvePage },
  { path: '', redirectTo: 'design', pathMatch: 'full' },
  { path: '**', redirectTo: '' },
];
