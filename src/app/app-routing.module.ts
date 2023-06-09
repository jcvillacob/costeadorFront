import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { CosteoComponent } from './components/costeo/costeo.component';
import { DistanciasComponent } from './components/distancias/distancias.component';
import { ComprobarComponent } from './components/comprobar/comprobar.component';
import { PeajesComponent } from './components/peajes/peajes.component';
import { CompensacionComponent } from './components/compensacion/compensacion.component';
import { GruposComponent } from './components/grupos/grupos.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'home' },
  { path: 'home', component: HomeComponent},
  { path: 'costeo', component: CosteoComponent},
  { path: 'comprobar', component: ComprobarComponent},
  { path: 'distancia', component: DistanciasComponent},
  { path: 'peajes', component: PeajesComponent},
  { path: 'compensacion', component: CompensacionComponent},
  { path: 'grupos', component: GruposComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
