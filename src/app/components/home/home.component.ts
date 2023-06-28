import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PendientesService } from 'src/app/services/pendientes.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  costeosPendientes: any[] = []
  comprobacionesPendientes: any[] = []
  
  constructor(private router: Router, private pendientesService: PendientesService) {}

  ngOnInit(): void {
    this.costeosPendientes = this.pendientesService.costeosPendientes;
  }

  editarCosteo(costeo: any) {
    this.router.navigate(['/costeo', costeo.id]);
  }

  editarComprobacion(i: number) {
    this.router.navigate(['/comprobar', i]);
  }

  descargarRealizados() {
    this.pendientesService.descargarCompro();
  }


}
