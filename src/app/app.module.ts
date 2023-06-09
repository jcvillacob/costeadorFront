import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms'; // Import FormsModule
import { HttpClientModule } from '@angular/common/http';
import { GoogleMapsModule } from '@angular/google-maps';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { HomeComponent } from './components/home/home.component';
import { CosteoComponent } from './components/costeo/costeo.component';
import { LoadingComponent } from './components/loading/loading.component';
import { DistanciasComponent } from './components/distancias/distancias.component';
import { ComprobarComponent } from './components/comprobar/comprobar.component';
import { PeajesComponent } from './components/peajes/peajes.component';
import { CompensacionComponent } from './components/compensacion/compensacion.component';
import { GruposComponent } from './components/grupos/grupos.component';
import { FooterComponent } from './components/footer/footer.component';
import { MapaComponent } from './components/mapa/mapa.component';

@NgModule({
  declarations: [
    AppComponent,
    SidebarComponent,
    HomeComponent,
    CosteoComponent,
    LoadingComponent,
    DistanciasComponent,
    ComprobarComponent,
    PeajesComponent,
    CompensacionComponent,
    GruposComponent,
    FooterComponent,
    MapaComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    GoogleMapsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
