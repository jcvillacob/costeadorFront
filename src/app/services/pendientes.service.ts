import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PendientesService {
  ultimo: number = -1;
  costeosPendientes: any[] = [
    {
      "id": 1, "Cliente": "Brenntag", "Observacion": "Spot", "Ciudades": ["Cali, Valle del Cauca", "Barranquilla, Atlantico"],
      "Utilidad": 0.2, "Comp": 0.2, "tipo_vh": "TM",
    },
    {
      "id": 2, "Cliente": "Brenntag", "Observacion": "Roundtrip", "Ciudades": ["Medellin, Antioquia", "Barranquilla, Atlantico"],
      "Utilidad": 0.2, "Comp": 0.5, "tipo_vh": "TM",
    },
    {
      "id": 3, "Cliente": "Brenntag", "Observacion": "Spot", "Ciudades": ["Barrancabermeja, Santander", "Barranquilla, Atlantico"],
      "Utilidad": 0.2, "Comp": 0.2, "tipo_vh": "TM",
    },
  ];

  comprobacionesPendientes!: any[];
  comprobacionesRealizadas: any[] = []

  constructor() {}

  loadComprobacionesPendientes(data: any[]) {
    this.comprobacionesPendientes = data;
    this.ultimo = this.comprobacionesPendientes.length;
  }

  getCosteoPendientes(id: number) {
    return (this.costeosPendientes.filter(costeo => costeo.id == id));
  }

  getComproPendientes(id: number) {
    return (this.comprobacionesPendientes[id]);
  }

  UpdateComproPendientes(id: number, data: any): void {
    this.comprobacionesPendientes[id].comprobado = true;
    this.comprobacionesRealizadas[id] = {
      "Cliente": data.Costeo.Cliente,
      "Origen": data.Distancia.Origen,
      "Destino": data.Distancia.Destino,
      "Distancia": data.Distancia.Distancia,
      "Observacion": data.Costeo.Observacion,
      "Tipo_Vh": data.Costeo.Tipo_vehiculo,
      "Compensacion": data.Costeo.Compensacion,
      "Flete": data.Costeo.Ingresos.Flete_total,
      "Utilidad": data.Costeo.Ingresos.porcentaje_utilidad,
      "EBITDA": data.Costeo.Ingresos.EBITDA,
      "Costos_Totales": data.Costeo.Costos.Costos_Totales,
      "Peajes": data.Peajes.peajesTotales,
      "Depreciacion": data.Costeo.Costos.Depreciacion,
      "Costos_Fijos": data.Costeo.Costos.Costos_Fijos.Total_fijos,
      "Costos_Variables": data.Costeo.Costos.Costos_Variables.Total_variables
    };
    console.log(this.comprobacionesRealizadas);
  }

  descargarCompro() {
    // Crear libro de trabajo y hoja de trabajo
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.comprobacionesRealizadas);
  
    // Agregar hoja de trabajo al libro de trabajo
    XLSX.utils.book_append_sheet(wb, ws, 'Comprobaciones Realizadas');
  
    // Escribir el libro de trabajo en el archivo y descargarlo
    XLSX.writeFile(wb, 'ComprobacionesRealizadas.xlsx');
  }
  

}
