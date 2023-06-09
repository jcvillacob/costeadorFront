import { Component, EventEmitter, OnInit } from '@angular/core';
import { CosteoService } from 'src/app/services/costeo.service';
import { FrasesService } from 'src/app/services/frases.service';
import { SuggestionsService } from 'src/app/services/suggestions.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-comprobar',
  templateUrl: './comprobar.component.html',
  styleUrls: ['./comprobar.component.css']
})
export class ComprobarComponent implements OnInit {
  origen: string = '';
  destino: string = '';
  ciudadInter: string = '';
  suggestionsOrigen: string[] = [];
  suggestionsDestino: string[] = [];
  suggestionsInter: string[] = [];
  ciudades: string[] = [];
  city: boolean = false;
  loading: boolean = false;

  tipo_vh: string = '';
  tipo_vhs: string[] = ['TM', 'DT', 'SC'];
  flete: number = 0;
  cliente: string = '';
  observacion: string = '';
  comp: number = 20;
  tercero: boolean = false;
  quote: any = { frase: '', autor: '' };

  /* Variables Cargue y descargue */
  cargue: number = 2;
  descargue: number = 2;

  /* Variables para cálculo de compensacion */
  suggestionsVacio: string[] = [];
  suggestionsVuelta: string[] = [];
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

  /* Para mostrar los valores del Costeo */
  ////////////////////////////////////////////////////////////
  costeado: any = {};
  costeadoB: boolean = false;
  expandir: boolean = false;
  todosFijos: boolean = false;
  todosVariables: boolean = false;
  todosGastos: boolean = false;
  todosIngresos: boolean = false;
  todosPeajes: boolean = false;
  costosFijosDetallados: any[] = [];
  costosVariablesDetallados: any[] = [];
  costosGastosDetallados: any[] = [];
  costosIngresosDetallados: any[] = [];
  costosPeajesDetallados: any[] = [];

  constructor(private frasesService: FrasesService,
    private suggestionsService: SuggestionsService,
    private costeoService: CosteoService) { }

  ngOnInit(): void {
    this.frasesService.getRandomQuote().subscribe(response => {
      this.quote = response;
    });
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


    /* ALERTA PARA QUE INGRESE VALOR DEL FLETE */
    if (!this.flete) {
      Swal.fire({
        icon: 'error',
        title: 'No has ingresado valor de Flete',
        text: 'Por favor, Ingresa el valor de este viaje.',
      });
      return;
    } else {
      costeo.Flete_total = this.flete;
    }


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


    /* ALERTA PARA QUE INGRESE CLIENTE */
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


    /* ALERTA PARA QUE INGRESE COMPENSACION */
    if (this.comp == 0 && !this.distance) {
      let result = await Swal.fire({
        icon: 'question',
        title: 'Has quitado la compensación',
        text: '¿Quieres continuar sin Compensación?',
        showCancelButton: true,
        confirmButtonText: 'Sí, Continuar',
        cancelButtonText: 'Cancelar',
      });
      if (result.isConfirmed) {
        costeo.comp = 0;
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        return;
      }
    } else if (this.comp != 0 && !this.distance) {
      costeo.comp = this.comp / 100;
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
      if (this.city && this.ciudadInter !== '') {
        this.ciudades.push(this.ciudadInter);
      }
      this.ciudades.push(this.destino);
      costeo.ciudades = this.ciudades;
    }

    /* ALERTA PARA ECUADOR */
    if (this.ecuador) {
      /* Para ingresar valores de Loraver */
      if (this.ciudadEcuador == '') {
        Swal.fire({
          icon: 'error',
          title: 'No has Ingresado Ciudad en Ecuador',
          text: 'Recuerda que de no ser ni Guayaquil ni Quito, se debe ingresar el valor de Loraver, el cual sería en USD y debe incluir aduana',
        });
        return;
      } else {
        if (this.ciudadEcuador !== '') {
          costeo.ciudad_ecuador = this.ciudadEcuador;
        }

        if (this.loraver != 0) {
          costeo.loraver = this.loraver;
        }
      }

      /* Para Ingresar Utilidad de Loraver */
      if (this.loraverUtili == 0) {
        let resultE = await Swal.fire({
          icon: 'question',
          title: 'Has quitado la Utilidad de Loraver',
          text: '¿Quieres continuar sin Utilidad?',
          showCancelButton: true,
          confirmButtonText: 'Sí, Continuar',
          cancelButtonText: 'Cancelar',
        });
        if (resultE.isConfirmed) {
          costeo.compLora = this.loraverUtili / 100;
        } else if (resultE.dismiss === Swal.DismissReason.cancel) {
          return;
        }
      } else {
        costeo.compLora = this.loraverUtili / 100;
      }
    }

    /* PARA GUARDAR LA COMPENSACION CALCULADA */
    if (this.distance) {
      if (this.distancia != 0) {
        costeo.distancias = this.distancia;
      }
      if (this.vacioDesde !== '') {
        costeo.vacio_desde = this.vacioDesde;
      }
      if (this.VueltaCargar !== '') {
        costeo.carga_nuevo = this.VueltaCargar;
      }
    }

    costeo.observacion = this.observacion;
    costeo.cargue = this.cargue;
    costeo.descargue = this.descargue;
    this.loading = true;
    this.ciudades = [];
    this.costeadoB = false;
    this.costeoService.comprobar(costeo).subscribe(data => {
      console.log(data);
      this.costeado = data;
      this.loading = false
      if (this.costeado.Costeo?.Ingresos.Utilidad === null) {
        Swal.fire({
          icon: 'error',
          title: 'Ha Ocurrido un Error',
          text: 'Por favor revisa los datos para asegurarte que todo está correcto',
        });
      } else {
        this.costosFijosDetallados = Object.entries(this.costeado.Costeo?.Costos.Costos_Fijos.todos_fijos);
        this.costosVariablesDetallados = Object.entries(this.costeado.Costeo?.Costos.Costos_Variables.todos_variables);
        this.costosGastosDetallados = Object.entries(this.costeado.Costeo?.Costos.Gastos_Porcentuales.todos_porc_gsto);
        this.costosIngresosDetallados = Object.entries(this.costeado.Costeo?.Costos.Ingresos_Porcentuales.todos_porc_ings);
        this.costosPeajesDetallados = this.costeado.Peajes?.peajes[0] || [];
        if (this.costeado.Peajes?.peajes.length > 0) {
          for (let peaje of this.costeado.Peajes?.peajes[1] || []) {
            this.costosPeajesDetallados.push(peaje);
          }
        }
        this.costeadoB = true;
      }
    })
  }
}
