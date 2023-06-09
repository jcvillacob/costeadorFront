import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SuggestionsService {
  arcgisSuggestionUrl = 'https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/suggest';


  constructor(private http: HttpClient) { }

  
  getSuggestions(ciudad: string): Observable<any> {
    const params = { "text": ciudad + ", COL", "outFields": "*", "maxSuggestions": 5, "f": "json" };
    const headers = {};
    return this.http.get<any>(this.arcgisSuggestionUrl, { params, headers });
  }
}
