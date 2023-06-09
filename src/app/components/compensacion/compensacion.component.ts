import { Component, EventEmitter, OnInit } from '@angular/core';
import { CosteoService } from 'src/app/services/costeo.service';
import { FrasesService } from 'src/app/services/frases.service';
import { SuggestionsService } from 'src/app/services/suggestions.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-compensacion',
  templateUrl: './compensacion.component.html',
  styleUrls: ['./compensacion.component.css']
})
export class CompensacionComponent implements OnInit {
  vacioDesde: string = '';
  VueltaCargar: string = '';
  origen: string = '';
  destino: string = '';
  ciudadInter: string = '';
  suggestionsVacio: string[] = [];
  suggestionsVuelta: string[] = [];
  suggestionsOrigen: string[] = [];
  suggestionsDestino: string[] = [];
  suggestionsInter: string[] = [];
  ciudades: string[] = [];
  loading: boolean = false;


  /* Variables de Ecuador */
  ecuador: boolean = false;
  ciudadEcuador: string = '';
  loraver: number = 0;
  loraverUtili: number = 10;
  checkboxChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  /* Mostrar Resultados */
  costeado: any = {};
  costeadoB: boolean = false;

  constructor(private frasesService: FrasesService,
    private suggestionsService: SuggestionsService,
    private costeoService: CosteoService) { }

  ngOnInit(): void {
  }

  sugerirVacio(ciudad: string) {
    if (ciudad !== '') {
      this.suggestionsService.getSuggestions(ciudad).subscribe(data => {
        this.suggestionsVacio = data.suggestions.map((dato: any) => dato.text).slice(0, 5);
      });
    } else {
      this.suggestionsVacio = [];
    }
  }

  sugerirVuelta(ciudad: string) {
    if (ciudad !== '') {
      this.suggestionsService.getSuggestions(ciudad).subscribe(data => {
        this.suggestionsVuelta = data.suggestions.map((dato: any) => dato.text).slice(0, 5);
      });
    } else {
      this.suggestionsVuelta = [];
    }
  }

  sugerirOrigen(ciudad: string) {
    if (ciudad !== '') {
      this.suggestionsService.getSuggestions(ciudad).subscribe(data => {
        this.suggestionsOrigen = data.suggestions.map((dato: any) => dato.text).slice(0, 5);
      });
    } else {
      this.suggestionsOrigen = [];
    }
  }

  sugerirDestino(ciudad: string) {
    if (ciudad !== '') {
      this.suggestionsService.getSuggestions(ciudad).subscribe(data => {
        this.suggestionsDestino = data.suggestions.map((dato: any) => dato.text).slice(0, 5);
      });
    } else {
      this.suggestionsDestino = [];
    }
  }

  sugerirInter(ciudad: string) {
    if (ciudad !== '') {
      this.suggestionsService.getSuggestions(ciudad).subscribe(data => {
        this.suggestionsInter = data.suggestions.map((dato: any) => dato.text).slice(0, 5);
      });
    } else {
      this.suggestionsInter = [];
    }
  }

  selectSuggestionVacio(suggestion: string) {
    let parts = suggestion.split(',');
    if (parts.length >= 2) {
      this.vacioDesde = parts[0] + ',' + parts[1];
    } else {
      this.vacioDesde = suggestion;
    }
    this.suggestionsVacio = [];
  }

  selectSuggestionVuelta(suggestion: string) {
    let parts = suggestion.split(',');
    if (parts.length >= 2) {
      this.VueltaCargar = parts[0] + ',' + parts[1];
    } else {
      this.VueltaCargar = suggestion;
    }
    this.suggestionsVuelta = [];
  }

  selectSuggestionOrigen(suggestion: string) {
    let parts = suggestion.split(',');
    if (parts.length >= 2) {
      this.origen = parts[0] + ',' + parts[1];
    } else {
      this.origen = suggestion;
    }
    this.suggestionsOrigen = [];
  }

  selectSuggestionDestino(suggestion: string) {
    let parts = suggestion.split(',');
    if (parts.length >= 2) {
      this.destino = parts[0] + ',' + parts[1];
    } else {
      this.destino = suggestion;
    }
    this.suggestionsDestino = [];
  }

  selectSuggestionInter(suggestion: string) {
    let parts = suggestion.split(',');
    if (parts.length >= 2) {
      this.ciudadInter = parts[0] + ',' + parts[1];
    } else {
      this.ciudadInter = suggestion;
    }
    this.suggestionsInter = [];
  }

  async cotizar() {
    const costeo: any = {};

    /* ALERTA PARA QUE INGRESE RUTA */
    if (this.origen === '' || this.destino === '') {
      Swal.fire({
        icon: 'error',
        title: 'Debes ingresar la Ruta',
        text: 'Por favor, Ingresa las ciudades de Origen y Destino.',
      });
      return;
    } else {
      this.ciudades.push(this.origen);
      if (this.ciudadInter !== '') {
        this.ciudades.push(this.ciudadInter);
      }
      this.ciudades.push(this.destino);
      costeo.ciudades = this.ciudades;
    }

    /* PARA GUARDAR LA COMPENSACION CALCULADA */
    if (this.vacioDesde !== '') {
      costeo.vacio_desde = this.vacioDesde;
    }
    if (this.VueltaCargar !== '') {
      costeo.carga_nuevo = this.VueltaCargar;
    }

    this.loading = true;
    this.ciudades = [];
    this.costeoService.compensacion(costeo).subscribe(data => {
      this.costeado = data;
      console.log(data);
      this.loading = false;
      this.costeadoB = true;
    })
  }

}
