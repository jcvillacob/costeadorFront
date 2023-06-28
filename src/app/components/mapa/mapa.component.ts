import { Component, OnInit, ChangeDetectorRef, Input, SimpleChanges } from '@angular/core';
import polyline from '@mapbox/polyline';
import { PendientesService } from 'src/app/services/pendientes.service';

@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.component.html',
  styleUrls: ['./mapa.component.css']
})
export class MapaComponent implements OnInit {
  @Input() Distancia: any = {};
  @Input() peajes: any[] = [];

  /* VARIABLES DE INICIO */
  ciudades = { ciudades: ["Medellin", "bogota", "cali"] };
  coordenadas: any[] = [];
  center: any = {};
  datos = { Geometry: '' };
  zoom = 7.5;
  defaultPolylineOptions: google.maps.PolylineOptions = {
    path: [],
    geodesic: true,
    strokeColor: '#3379F3',
    strokeOpacity: 1.0,
    strokeWeight: 4
  }
  polylineOptions: google.maps.PolylineOptions = this.defaultPolylineOptions;
  path: Promise<google.maps.LatLngLiteral[]> = Promise.resolve([]);

  constructor(private cdr: ChangeDetectorRef,
    private pendientesService: PendientesService) { }

  /* AQUI ESTÁ EL ONINIT */
  ngOnInit(): void { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['Distancia']) {
      this.loadData();
    }
  }


  async loadData() {
    this.coordenadas = [{ Ciudad: '', Coordenadas: { lat: 6.245890000000031, lng: -75.57456999999994 } }];

    /* Coordenadas de Origen y Destino */
    this.coordenadas.push({ "Ciudad": this.Distancia.Origen, "Coordenadas": this.Distancia.Coordenadas[this.Distancia.Origen] });
    this.coordenadas.push({ "Ciudad": this.Distancia.Destino, "Coordenadas": this.Distancia.Coordenadas[this.Distancia.Destino] });
    this.coordenadas.shift();

    /* Cambiando el centro del Mapa */
    const newLat = (this.Distancia.Coordenadas[this.Distancia.Origen].lat + this.Distancia.Coordenadas[this.Distancia.Destino].lat) / 2;
    const newLng = (this.Distancia.Coordenadas[this.Distancia.Origen].lng + this.Distancia.Coordenadas[this.Distancia.Destino].lng) / 2;
    this.center = { lat: newLat, lng: newLng };

    /* Detectando cambios y Mostrando la ruta */
    this.cdr.detectChanges();
    // Utiliza Geometry de la entrada Distancia
    this.path = Promise.resolve(this.decodePolyline(this.Distancia.Geometry));
    this.polylineOptions = await this.getPolylineOptions();
  }



  /* FUNCIONES */
  async getPolylineOptions(): Promise<google.maps.PolylineOptions> {
    const path = await this.path;
    if (path.length > 0) {
      return {
        ...this.defaultPolylineOptions,
        path: path
      }
    } else {
      return this.defaultPolylineOptions;
    }
  }

  decodePolyline(encodedPolyline: string) {
    const coordinates = polyline.decode(encodedPolyline) as number[][];
    return coordinates.map(coord => ({ lat: coord[0], lng: coord[1] }));
  }
}
