import { Component, EventEmitter, OnInit } from '@angular/core';
import { CosteoService } from 'src/app/services/costeo.service';
import { FrasesService } from 'src/app/services/frases.service';
import { SuggestionsService } from 'src/app/services/suggestions.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-peajes',
  templateUrl: './peajes.component.html',
  styleUrls: ['./peajes.component.css']
})
export class PeajesComponent implements OnInit {
  origen: string = '';
  destino: string = '';
  ciudadInter: string = '';
  suggestionsOrigen: string[] = [];
  suggestionsDestino: string[] = [];
  suggestionsInter: string[] = [];
  ciudades: string[] = [];
  loading: boolean = false;
  costosPeajesDetallados: any[] = [];

  tipo_vh: string = '';
  tipo_vhs: string[] = ['TM', 'DT', 'SC'];
  quote: any = { frase: '', autor: '' };

  /* Mostrar Resultados */
  costeado: any = {};
  costeadoB: boolean = false;

  constructor(private frasesService: FrasesService,
    private suggestionsService: SuggestionsService,
    private costeoService: CosteoService) { }

  ngOnInit(): void {
    this.frasesService.getRandomQuote().subscribe(response => {
      this.quote = response;
    });
  }

  cambiarTipoVh(vh: string) {
    this.tipo_vh = vh;
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
    
    /* ALERTA PARA QUE INGRESE TIPO DE VEHICULO */
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

    this.loading = true;
    this.ciudades = [];
    this.costeadoB = false;
    this.costeoService.Peaje(costeo).subscribe(data => {
      if(!data.error) {
        this.costeado = data;
        this.costosPeajesDetallados = this.costeado.peajes[0] || [];
        if (this.costeado.peajes.length > 0) {
          for (let peaje of this.costeado.peajes[1] || []) {
            this.costosPeajesDetallados.push(peaje);
          }
        }
        console.log(data);
        this.loading = false
        this.costeadoB = true;
      } else {
        this.loading = false;
      }
    })
  }

}