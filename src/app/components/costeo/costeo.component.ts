import { Component, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-costeo',
  templateUrl: './costeo.component.html',
  styleUrls: ['./costeo.component.css']
})
export class CosteoComponent {
  tipo_vhs: string[] = ['TM', 'DT', 'SC'];
  origen: string = '';
  destino: string = '';
  ciudades: string[] = [];
  tipo_vh: string = '';
  utili: number = 0;
  cliente: string = '';
  observacion: string = '';
  comp: number = 0;
  cargue: number = 2;
  descargue: number = 2;
  tercero: boolean = false;

  /* Variables de Ecuador */
  ecuador: boolean = false;
  checkboxChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  ciudadEcuador: string = '';
  loraver: number = 0;
  loraverUtili: number = 10;

  cambiarUtilidad(event: any) {
    this.utili = event.target.value;
  }

  cambiarCompensacion(event: any) {
    this.comp = event.target.value;
  }

  cambiarUtiliLoraver(event: any) {
    this.loraverUtili = event.target.value;
  }

  cambiarTipoVh(vh: string) {
    this.tipo_vh = vh;
  }

  toggleEcuador() {
    this.ecuador = !this.ecuador;
    this.checkboxChange.emit(this.ecuador);
  }

  toggleTercero() {
    this.tercero = !this.tercero;
    this.checkboxChange.emit(this.tercero);
  }

}
