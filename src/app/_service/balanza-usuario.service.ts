import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { BalanzaUsuario } from '../_model/balanzaUsuario';
import { HOST } from '../_shared/var.constant';

@Injectable({
  providedIn: 'root'
})
export class BalanzaUsuarioService {

  url: string = `${HOST}/balanzaUsuario`;
  balanzaUsuarioCambio = new Subject<[]>();
  mensaje = new Subject<string>();

  constructor(
    private http: HttpClient
  ) { }

  obtenerUsuarioPorNombreUsuario(nombreUsuario: string) {
    return this.http.get<BalanzaUsuario>(`${this.url}/usuarioPorNombreUsuario/${nombreUsuario}`, {
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
    });
  }
}
