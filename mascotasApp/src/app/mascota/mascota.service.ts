import { Injectable } from '@angular/core';
import {mascota} from './mascota';
import {of, Observable} from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class mascotaService {
  private endpointUrl = 'http://localhost:8080/api/mascotas';
  private httpHeaders = new HttpHeaders({'Content-Type':'application/json'});
  constructor(private http: HttpClient ) { }

  getMascotas(): Observable<mascota[]>{
    return this.http.get<mascota[]>(this.endpointUrl);
  }

  getMascota(id: number): Observable<mascota>{
    return this.http.get<mascota>(`${this.endpointUrl}/${id}`)
  }

  create(mascota: mascota): Observable<mascota>{
    return this.http.post<mascota>(this.endpointUrl, mascota, {headers: this.httpHeaders});
  }
  
  update(mascota: mascota): Observable<mascota>{
    return this.http.put<mascota>(`${this.endpointUrl}/${mascota.id}`, mascota, {headers: this.httpHeaders})
  }

  delete(id: number): Observable<mascota>{
    return this.http.delete<mascota>(`${this.endpointUrl}/${id}`, {headers: this.httpHeaders})
  }

}

