import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NbWindowService } from '@nebular/theme';
import jwt_decode from 'jwt-decode';
import { ToastrService } from 'ngx-toastr';
import { AuxPesaje } from '../../../_model/auxPesaje';
import { Balanza } from '../../../_model/balanza';
import { Pesaje } from '../../../_model/pesaje';
import { Usuario } from '../../../_model/usuario';
import { PesajeService } from '../../../_service/pesaje.service';
import { TOKEN_NAME } from '../../../_shared/var.constant';
import { WindowComponent } from '../window/window.component';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'ngx-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.scss'],
})
export class RegistroComponent implements OnInit, OnDestroy {

  private alive = true;
  private localAuxPesaje: AuxPesaje;
  varPeso: number;
  form: FormGroup;
  edicion: boolean = false;
  pesaje: Pesaje;
  hoy: Date;
  balanza: Balanza;
  private subscription: Subscription;

  constructor(private pesajeService: PesajeService,
    private windowService: NbWindowService,
    private toastr: ToastrService,
    private route: ActivatedRoute
  ) {
    this.route.queryParams
      .subscribe(params => {
        console.log(params);

        this.form = new FormGroup({
          'peso': new FormControl(''),
          'proceso': new FormControl('', [Validators.required]),
          'placa': new FormControl(params.placa === undefined ? '' : params.placa, [Validators.required]),
          'obs': new FormControl('', [Validators.required]),
        });
      }
    );

    this.pesaje = new Pesaje;
    this.localAuxPesaje = new AuxPesaje();
    this.balanza = new Balanza;
  }

  ngOnInit() {
    this.subscription = this.pesajeService.getAuxPesaje().subscribe(auxPesaje => {
      this.localAuxPesaje = auxPesaje;
    });
  }

  ngOnDestroy() {
    this.alive = false;
    this.subscription.unsubscribe();
  }

  private initForm() {
  }

  registrar() {
    this.hoy = new Date();

    if (this.localAuxPesaje.tabActivo === 'Peso Balanza') {
      this.varPeso = this.localAuxPesaje.pesoBalanza;

      if (sessionStorage.getItem('balanza') == null) {
        this.pesajeService.mensaje.next('Falta el Parámetro Balanza.');
        this.toastr.error('Falta el Parámetro General Balanza',
          'Error', { timeOut: 5000 });
      } else {
        this.balanza = JSON.parse(sessionStorage.getItem('balanza'));
      }
    }

    if (this.localAuxPesaje.tabActivo === 'Peso Manual') {
      this.varPeso = this.localAuxPesaje.pesoManual;
      this.balanza = null;
    }

    if (this.varPeso === 0 || this.varPeso == null) {
      this.pesajeService.mensaje.next('Capture un Peso ya sea de Balanza o Manual.');
      this.toastr.error('Capture un Peso ya sea de Balanza o Manual',
        'Error', { timeOut: 5000 });
    } else {
      this.pesaje.peso = this.varPeso;
      this.pesaje.pesoTara = 0;
      this.pesaje.pesoNeto = 0;
      const tzoffset = (new Date()).getTimezoneOffset() * 60000;
      const localISOTime = (new Date(Date.now() - tzoffset)).toISOString();
      this.pesaje.fecha = localISOTime;
      this.pesaje.placa = this.form.value['placa'];
      this.pesaje.observacion = this.form.value['obs'];
      this.pesaje.gestion = this.hoy.getFullYear().toString();
      this.pesaje.estado = 'ACT';
      this.pesaje.envioServidor = 'NO';
      this.pesaje.fechaServidor = null;
      this.pesaje.operacion = this.form.value['proceso'];
      const user = new Usuario;
      const tk = JSON.parse(sessionStorage.getItem(TOKEN_NAME));
      const decodedToken = jwt_decode(tk.access_token);
      console.log('el decodedToken es: ', decodedToken);
      user.username = 'danny';
      this.pesaje.usuario = user;
      this.pesaje.balanza = this.balanza;
      this.subscription = this.pesajeService.registrar(this.pesaje).subscribe(data => {
        this.subscription = this.pesajeService.listarPesajes().subscribe(pesajes => {
          this.pesajeService.pesajeCambio.next(pesajes);
          this.pesajeService.mensaje.next('Se registró');
          this.toastr.success('Se registró correctamente. Enseguida se mostrará la ventana de impresión',
            'Éxito', { timeOut: 5000 });
          this.imprimirPesaje(data);
        });
      });
    }
  }

  getDecodedAccessToken(token: string): any {
    try{
        return jwt_decode(token);
    }
    catch(Error){
        return null;
    }
  }

  imprimirPesaje(data) {
    this.subscription = this.pesajeService.generarBoleta(
      data.id,
      // data.balanza.aduana.recinto.nombre,
      sessionStorage.getItem('recinto'),
      data.usuario.username).subscribe(dataBoleta => {
        this.imprimirPDF(dataBoleta);
      });
  }

  imprimirPDF(src) {
    const binaryData = [];
    binaryData.push(src);
    const blobUrl = window.URL.createObjectURL(new Blob(binaryData, { type: 'application/pdf' }));
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.src = blobUrl;
    document.body.appendChild(iframe);
    iframe.contentWindow.print();
  }

  limpiar() {
    this.form = new FormGroup({
      'peso': new FormControl(''),
      'proceso': new FormControl('', [Validators.required]),
      'placa': new FormControl('', [Validators.required]),
      'obs': new FormControl('', [Validators.required]),
    });
  }

  openWindowPesajes() {
    this.windowService.open(WindowComponent, { title: `Pesajes`, closeOnBackdropClick: false });
  }

}
