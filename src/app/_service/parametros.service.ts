import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Balanza } from '../_model/balanza';
import { Conexion } from '../_model/conexion';
import { HOST, TOKEN_NAME } from '../_shared/var.constant';
import { Recinto } from '../_model/recinto';

@Injectable({
  providedIn: 'root',
})
export class ParametrosService {

  url: string = `${HOST}/parametros`;
  varConexion = new Subject<Conexion>();
  varBalanza = new Subject<Balanza>();
  varRecinto = new Subject<Recinto>();
  mensaje = new Subject<string>();

  constructor(private http: HttpClient) { }

  setBalanza(balanza: Balanza) {
    const access_token = JSON.parse(sessionStorage.getItem(TOKEN_NAME)).access_token;
    return this.http.post(this.url, balanza, {
      headers: new HttpHeaders().set('Authorization', `bearer ${access_token}`)
        .set('Content-Type', 'application/json'),
    });
  }
}
