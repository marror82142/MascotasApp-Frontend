import { Injectable } from '@angular/core';
import {usuario} from './usuario';
import {of, Observable} from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class usuarioService {
  private endpointUrl = 'http://localhost:8080/api/usuarios';
  private httpHeaders = new HttpHeaders({'Content-Type':'application/json'});
  constructor(private http: HttpClient ) { }

  getUsuarios(): Observable<usuario[]>{
    return this.http.get<usuario[]>(this.endpointUrl);
  }

  getUsuario(cedula: number): Observable<usuario>{
    return this.http.get<usuario>(`${this.endpointUrl}/${cedula}`)
  }

  create(usuario: usuario): Observable<usuario>{
    return this.http.post<usuario>(this.endpointUrl, usuario, {headers: this.httpHeaders});
  }
  
  update(usuario: usuario): Observable<usuario>{
    return this.http.put<usuario>(`${this.endpointUrl}/${usuario.cedula}`, usuario, {headers: this.httpHeaders})
  }

  delete(cedula: number): Observable<usuario>{
    return this.http.delete<usuario>(`${this.endpointUrl}/${cedula}`, {headers: this.httpHeaders})
  }

}

