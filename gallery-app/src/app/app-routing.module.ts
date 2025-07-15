import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminViewComponent } from './views/admin-view/admin-view.component';
import { PublicViewComponent } from './views/public-view/public-view.component';

const routes: Routes = [
  { path: '', redirectTo: '/galeria', pathMatch: 'full' },
  { path: 'galeria', component: PublicViewComponent },
  { path: 'admin', component: AdminViewComponent },
  { path: '**', redirectTo: '/galeria' } // Wildcard route para 404s
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
