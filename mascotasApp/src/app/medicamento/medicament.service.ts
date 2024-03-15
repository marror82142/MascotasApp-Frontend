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

  createMedicamento(medicamento: medicamento): Observable<medicamento>{
    return this.http.post<medicamento>((this.endpointUrl), medicamento, {headers: this.httpHeaders});
  }
  
}
