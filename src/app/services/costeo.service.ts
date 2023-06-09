import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CosteoService {

  private apiUrl: string = 'http://localhost:4000/';

  constructor(private http: HttpClient) { }

  Costear(costear: any): Observable<any> {
    return this.http.post<any>(this.apiUrl + 'costeo', costear);
  }

  comprobar(comprobacion: any): Observable<any> {
    return this.http.post<any>(this.apiUrl + 'comprobar', comprobacion);
  }

  Distancia(ciudades: any): Observable<any> {
    return this.http.post<any>(this.apiUrl + 'distancia', ciudades)
  }

  Peaje(peajes: any): Observable<any> {
    return this.http.post<any>(this.apiUrl + 'peaje', peajes)
  }

  compensacion(compenacion: any): Observable<any> {
    return this.http.post<any>(this.apiUrl + 'compensacion', compenacion)
  }
}
