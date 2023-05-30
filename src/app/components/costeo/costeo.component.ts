import { Component, EventEmitter, OnInit } from '@angular/core';
import { FrasesService } from 'src/app/services/frases.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-costeo',
  templateUrl: './costeo.component.html',
  styleUrls: ['./costeo.component.css']
})
export class CosteoComponent implements OnInit {
  origen: string = '';
  destino: string = '';
  ciudades: string[] = [];
  ciudadInter: string = '';
  city: boolean = false;

  tipo_vh: string = '';
  tipo_vhs: string[] = ['TM', 'DT', 'SC'];
  utili: number = 0;
  cliente: string = '';
  observacion: string = '';
  comp: number = 0;
  tercero: boolean = false;
  quote: any = { frase: '', autor: '' };

  /* Variables Cargue y descargue */
  cargue: number = 2;
  descargue: number = 2;

  /* Variables para cálculo de compensacion */
  distance: boolean = false;
  distancia: number = 0;
  vacioDesde: string = '';
  VueltaCargar: string = '';

  /* Variables de Ecuador */
  ecuador: boolean = false;
  ciudadEcuador: string = '';
  loraver: number = 0;
  loraverUtili: number = 10;
  checkboxChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(private frasesService: FrasesService) { }

  ngOnInit(): void {
    this.frasesService.getRandomQuote().subscribe(response => {
      this.quote = response;
    });
  }

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

  anadirCiudad() {
    this.city = !this.city;
  }

  toggleEcuador() {
    this.ecuador = !this.ecuador;
    this.checkboxChange.emit(this.ecuador);
  }

  toggleTercero() {
    this.tercero = !this.tercero;
    this.checkboxChange.emit(this.tercero);
  }

  toggleDistancia() {
    this.distance = !this.distance;
    this.checkboxChange.emit(this.distance);
  }

  cotizar() {
    const costeo: any = {};

    if (this.tipo_vh === '') {
      Swal.fire({
        icon: 'error',
        title: 'No hay Tipo de Vehículo',
        text: 'Por favor, Selecciona un tipo de vehículo.',
      });
      return;
    } else {
      costeo.tipo_vh = this.tipo_vh;
    }

    if (this.cliente === '') {
      Swal.fire({
        icon: 'error',
        title: 'No has escrito el cliente',
        text: 'Por favor, Ingresa un Cliente.',
      });
      return;
    } else {
      costeo.cliente = this.cliente;
    }

    if (this.utili === 0) {
      Swal.fire({
        icon: 'question',
        title: 'No has añadido una utilidad',
        text: '¿Quieres continuar sin Utilidad?',
        showCancelButton: true,
        confirmButtonText: 'Sí, Continuar',
        cancelButtonText: 'Cancelar',
      }).then((result) => {
        if (result.isConfirmed) {
          costeo.utili = this.utili / 100;
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          return;
        }
      });
    }

    if (this.comp === 0 && !this.distance) {
      Swal.fire({
        icon: 'question',
        title: 'Has quitado la compensación',
        text: '¿Quieres continuar sin Compensación?',
        showCancelButton: true,
        confirmButtonText: 'Sí, Continuar',
        cancelButtonText: 'Cancelar',
      }).then((result) => {
        if (result.isConfirmed) {
          costeo.comp = this.comp / 100;
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          return;
        }
      });
    }

    if (this.origen === '' || this.destino === '') {
      Swal.fire({
        icon: 'error',
        title: 'Debes ingresar la Ruta',
        text: 'Por favor, Ingresa las ciudades de Origen y Destino.',
      });
      return;
    } else {
      this.ciudades.push(this.origen);
      if (this.city && this.ciudadInter !== '') {
        this.ciudades.push(this.ciudadInter);
      }
      this.ciudades.push(this.destino);
      costeo.ciudades = this.ciudades;
    }

    costeo.observacion = this.observacion;
    costeo.cargue = this.cargue;
    costeo.descargue = this.descargue;
    console.log(costeo);
    this.ciudades = [];

  }

}
