import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FrasesService {

  private apiUrl: string = 'http://localhost:4000/frase/';

  constructor(private http: HttpClient) { }

  getRandomQuote(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }
}
