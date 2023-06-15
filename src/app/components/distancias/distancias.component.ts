import { Component, EventEmitter, OnInit } from '@angular/core';
import { CosteoService } from 'src/app/services/costeo.service';
import { FrasesService } from 'src/app/services/frases.service';
import { SuggestionsService } from 'src/app/services/suggestions.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-distancias',
  templateUrl: './distancias.component.html',
  styleUrls: ['./distancias.component.css']
})
export class DistanciasComponent implements OnInit {
  origen: string = '';
  destino: string = '';
  ciudadInter: string = '';
  suggestionsOrigen: string[] = [];
  suggestionsDestino: string[] = [];
  suggestionsInter: string[] = [];
  ciudades: string[] = [];
  loading: boolean = false;
  costeado: any = {};
  costeadoB: boolean = false;


  quote: any = { frase: '', autor: '' };

  checkboxChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(private frasesService: FrasesService,
    private suggestionsService: SuggestionsService,
    private costeoService: CosteoService) { }

  ngOnInit(): void {
    this.frasesService.getRandomQuote().subscribe(response => {
      this.quote = response;
    });
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
    this.costeadoB = false;
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
      if (this.ciudadInter) {
        this.ciudades.push(this.ciudadInter);
      }
      this.ciudades.push(this.destino);
      costeo.ciudades = this.ciudades;
    }

    console.log(costeo);
    this.loading = true;
    this.ciudades = [];
    this.costeoService.Distancia(costeo).subscribe(data => {
      console.log(data);
      this.costeado = data;
      this.costeadoB = true;
      this.loading = false
    })
  }
}
