import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { Client } from '@stomp/stompjs';
import { ServerDataSource } from 'ng2-smart-table';
import { Observable, Subject, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import * as SockJS from 'sockjs-client';
import { PesajesSincronizadosDTO } from '../_dto/pesajesSincronizadosDTO';
import { AuxPesaje } from '../_model/auxPesaje';
import { Pesaje } from '../_model/pesaje';
import { HOST, TOKEN_NAME } from '../_shared/var.constant';
import { Balanza } from './../_model/balanza';

export interface UserQuery {
  search: string;
  registration: Date;
}

@Injectable({
  providedIn: 'root',
})
export class PesajeService implements OnDestroy {

  url: string = `${HOST}/pesaje`;
  urlTrade: string = `${HOST}/trade`;
  urlCas: string = `${HOST}/cas`;
  pesajeCambio = new Subject<Pesaje[]>();
  mensaje = new Subject<string>();
  private localAuxPesaje: AuxPesaje;

  private stompClient = new Client();
  private valorPeso: number;
  private subject = new Subject<AuxPesaje>();
  public subjectObservable$ = this.subject.asObservable();
  private subscription: Subscription;

  constructor(private http: HttpClient) { }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  connect() {
    this.subscription = this.habilitaScheduled().subscribe(data => {
      this.stompClient.webSocketFactory = function () {
        // return new SockJS('http://localhost:8080/gkz-stomp-endpoint');
        return new SockJS(`${HOST}/gkz-stomp-endpoint`);
      };

      const _this = this;
      // this.stompClient.debug = null;
      this.stompClient.debug = () => { };
      this.stompClient.onConnect = function (frame) {
        _this.setConnected(true);
        console.log('Connected: ' + frame);


        this.subscription = _this.stompClient.subscribe('/topic/peso', function (peso) {
          let datoPeso = peso.body;
          
          if ( datoPeso !== '' && datoPeso && datoPeso != null ) {
            _this.showPeso(datoPeso);
          }

        });

      };

      this.stompClient.activate();
    });
  }

  setConnected(connected: boolean) {
    if (connected) {
      this.valorPeso = 0;
    }
  }

  disconnect() {
    if (this.stompClient != null) {
      if (sessionStorage.getItem('balanza') != null) {
        let objBalanza: Balanza;
        objBalanza = JSON.parse(sessionStorage.getItem('balanza'));
        if (objBalanza.tipo === 'TRADE') {
          this.subscription = this.desconectarTrade().subscribe(data => {
            console.log('Disconnecting Trade');
            this.stompClient.deactivate();
          });
        }
        if (objBalanza.tipo === 'CAS') {
          this.subscription = this.desconectarCas().subscribe(data => {
            console.log('Disconnecting Cas');
            this.stompClient.deactivate();
          });
        }
      }
    }
    this.setConnected(false);
    console.log('Disconnected!');
  }

  habilitaScheduled() {
    const access_token = JSON.parse(sessionStorage.getItem(TOKEN_NAME)).access_token;
    return this.http.post(`${this.url}/habilitaScheduled`, 'habilitar', {
      headers: new HttpHeaders().set('Authorization', `bearer ${access_token}`)
        .set('Content-Type', 'application/json'),
    });
  }

  sendName() {
    // this.stompClient.publish({ destination: '/gkz/hello', body: JSON.stringify({ 'name': this.name }) });
  }

  showPeso(dato: string) {
    // this.valorPeso = message;
    if (this.localAuxPesaje == null) {
      this.localAuxPesaje = new AuxPesaje();
    }
    this.localAuxPesaje.pesoBalanza = Number(dato.replace(/\D/g, ''));
    this.subject.next(this.localAuxPesaje);
  }

  registrar(pesaje: Pesaje) {
    const access_token = JSON.parse(sessionStorage.getItem(TOKEN_NAME)).access_token;
    return this.http.post(this.url, pesaje, {
      headers: new HttpHeaders().set('Authorization', `bearer ${access_token}`)
        .set('Content-Type', 'application/json'),
    });
  }

  listarPesajes(p: number, s: number) {
    const access_token = JSON.parse(sessionStorage.getItem(TOKEN_NAME)).access_token;
    return this.http.get<Pesaje[]>(`${this.url}?page=${p}&size=${s}`, {
      headers: new HttpHeaders().set('Authorization', `bearer ${access_token}`)
        .set('Content-Type', 'application/json'),
    }).pipe(
      map((data: any) => data.content)
    );
  }

  sendAuxPesaje(auxPesaje: AuxPesaje) {
    this.localAuxPesaje = auxPesaje;
    this.subject.next(auxPesaje);
  }

  getAuxPesaje(): Observable<AuxPesaje> {
    return this.subject.asObservable();
  }

  generarBoleta(idPesaje: number, nombreRecinto: string, nombreUsuario: string) {
    const access_token = JSON.parse(sessionStorage.getItem(TOKEN_NAME)).access_token;
    return this.http.get(`${this.url}/generarBoleta/${idPesaje}/${nombreRecinto}/${nombreUsuario}`, {
      responseType: 'blob',
      headers: new HttpHeaders().set('Authorization', `bearer ${access_token}`).set('Content-Type', 'application/json'),
    });
  }

  modificar(pesaje: Pesaje) {
    const access_token = JSON.parse(sessionStorage.getItem(TOKEN_NAME)).access_token;
    return this.http.put(this.url, pesaje, {
      headers: new HttpHeaders().set('Authorization', `bearer ${access_token}`)
        .set('Content-Type', 'application/json'),
    });
  }

  eliminar(id: number) {
    const access_token = JSON.parse(sessionStorage.getItem(TOKEN_NAME)).access_token;
    return this.http.delete(`${this.url}/${id}`, {
      headers: new HttpHeaders().set('Authorization', `bearer ${access_token}`)
        .set('Content-Type', 'application/json'),
    });
  }

  desconectarTrade() {
    const access_token = JSON.parse(sessionStorage.getItem(TOKEN_NAME)).access_token;
    return this.http.post(`${this.urlTrade}/desconectaTRADE`, 'desconecta', {
      headers: new HttpHeaders().set('Authorization', `bearer ${access_token}`)
        .set('Content-Type', 'application/json'),
    });
  }

  desconectarCas() {
    const access_token = JSON.parse(sessionStorage.getItem(TOKEN_NAME)).access_token;
    return this.http.post(`${this.urlCas}/desconectaCAS`, 'desconecta', {
      headers: new HttpHeaders().set('Authorization', `bearer ${access_token}`)
        .set('Content-Type', 'application/json'),
    });
  }

  listarPesajesPaginado() {
    return new ServerDataSource(this.http, 
      {
        endPoint: `${this.url}`, 
        dataKey: 'content', 
        pagerPageKey: 'page', 
        pagerLimitKey: 'size',
        totalKey: 'totalElements'
      });
  }

  listarPesajesNoSincronizados() {
    return new ServerDataSource(this.http, 
      {
        endPoint: `${this.url}/listaNoSincronizados`, 
        dataKey: 'content', 
        pagerPageKey: 'page', 
        pagerLimitKey: 'size',
        totalKey: 'totalElements'
      });
  }

  sincronizarTodos() {
    const access_token = JSON.parse(sessionStorage.getItem(TOKEN_NAME)).access_token;

    return this.http.get<PesajesSincronizadosDTO>(`${this.url}/sincTodos`, {
      headers: new HttpHeaders().set('Authorization', `bearer ${access_token}`)
        .set('Content-Type', 'application/json'),
    });
  }

}
