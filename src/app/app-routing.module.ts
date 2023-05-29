import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { CosteoComponent } from './components/costeo/costeo.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'home' },
  { path: 'home', component: HomeComponent},
  { path: 'costeo', component: CosteoComponent},
  { path: 'comprobar', component: HomeComponent},
  { path: 'distancia', component: HomeComponent},
  { path: 'peajes', component: HomeComponent},
  { path: 'compensacion', component: HomeComponent},
  { path: 'grupos', component: HomeComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
