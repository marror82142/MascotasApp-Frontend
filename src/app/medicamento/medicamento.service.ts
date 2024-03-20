import { Injectable } from '@angular/core';
import {of, Observable} from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { medicamento } from './medicamento';


@Injectable({
  providedIn: 'root'
})
export class medicamentoService {
  private endpointUrl = 'http://localhost:8080/api/medicamento';
  private httpHeaders = new HttpHeaders({'Content-Type':'application/json'});
  constructor(private http: HttpClient ) { }

  create(medicamento: medicamento): Observable<medicamento>{
    return this.http.post<medicamento>((this.endpointUrl), medicamento, {headers: this.httpHeaders});
  }

  getMedicamentos(): Observable<medicamento[]>{
    return this.http.get<medicamento[]>(this.endpointUrl);
  }

  getMedicamento(id: number): Observable<medicamento>{
    return this.http.get<medicamento>(`${this.endpointUrl}/${id}`)
  }
  
  update(medicamento: medicamento): Observable<medicamento>{
    return this.http.put<medicamento>(`${this.endpointUrl}/${medicamento.id}`, medicamento, {headers: this.httpHeaders})
  }

  delete(id: number): Observable<medicamento>{
    return this.http.delete<medicamento>(`${this.endpointUrl}/${id}`, {headers: this.httpHeaders})
  }
  
}
