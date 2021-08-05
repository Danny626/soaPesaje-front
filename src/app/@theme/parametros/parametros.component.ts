import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Balanza } from '../../_model/balanza';
import { Conexion } from '../../_model/conexion';
import { Recinto } from '../../_model/recinto';
import { BalanzaService } from '../../_service/balanza.service';
import { ConexionService } from '../../_service/conexion.service';
import { ParametrosService } from '../../_service/parametros.service';
import { RecintoService } from '../../_service/recinto.service';

@Component({
  selector: 'ngx-parametros',
  templateUrl: './parametros.component.html',
  styleUrls: ['./parametros.component.scss'],
})
export class ParametrosComponent implements OnInit, OnDestroy {

  selectedConexion: Conexion;
  conexiones: Conexion[] = [];
  selectedBalanza: Balanza;
  balanzas: Balanza[] = [];
  recintos: Recinto[] = [];
  selectedRecinto: Recinto;
  form: FormGroup;
  private subscription: Subscription;

  constructor(private conexionService: ConexionService, private balanzaService: BalanzaService,
    private parametrosService: ParametrosService, private recintoService: RecintoService) {
    this.form = new FormGroup({
      'conexion': new FormControl(''),
      'balanza': new FormControl(''),
      'recinto': new FormControl(''),
    });
    this.selectedBalanza = new Balanza;
    this.selectedConexion = new Conexion;
    this.selectedRecinto = new Recinto;
  }

  ngOnInit() {
    if (sessionStorage.getItem('recinto') != null) {
      this.selectedRecinto = JSON.parse(sessionStorage.getItem('recinto'));
      this.form.patchValue({
        'recinto': this.selectedRecinto,
      });
    }
    if (sessionStorage.getItem('balanza') != null) {
      this.selectedBalanza = JSON.parse(sessionStorage.getItem('balanza'));
      this.form.patchValue({
        'balanza': this.selectedBalanza,
      });
    }
    if (sessionStorage.getItem('conexion') != null) {
      this.selectedConexion = JSON.parse(sessionStorage.getItem('conexion'));
      this.form.patchValue({
        'conexion': this.selectedConexion,
      });
    }

    this.subscription = this.recintoService.recintoCambio.subscribe(recintos => {
      this.recintos = recintos;
    });

    this.subscription = this.recintoService.listarRecintos().subscribe(recintos => {
      this.recintos = recintos;
    });

    this.subscription = this.conexionService.conexionCambio.subscribe(conexiones => {
      this.conexiones = conexiones;
    });

    this.subscription = this.conexionService.listarConexiones().subscribe(conexiones => {
      this.conexiones = conexiones;
    });

    this.subscription = this.balanzaService.balanzaCambio.subscribe(balanzas => {
      this.balanzas = balanzas;
    });

    this.subscription = this.balanzaService.listarBalanzas().subscribe(balanzas => {
      this.balanzas = balanzas;
    });

  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  aceptar() {
    if (this.form.value['balanza'] == null || this.form.value['balanza'] === '') {
      this.operacionesGuardado();
    } else {
      this.subscription = this.parametrosService.setBalanza(this.form.value['balanza']).subscribe(data => {
        this.operacionesGuardado();
      });
    }
  }

  operacionesGuardado() {
    this.parametrosService.varConexion.next(this.form.value['conexion']);
    this.parametrosService.varRecinto.next(this.form.value['recinto']);
    if (this.form.value['balanza'] != null) {
      this.selectedBalanza = this.form.value['balanza'];
      sessionStorage.setItem('balanza', JSON.stringify(this.selectedBalanza));
      this.parametrosService.varBalanza.next(this.form.value['balanza']);
    } else {
      this.selectedBalanza = null;
      sessionStorage.setItem('balanza', null);
      this.parametrosService.varBalanza.next(null);
    }
    this.selectedConexion = this.form.value['conexion'];
    this.selectedRecinto = this.form.value['recinto'];
    sessionStorage.setItem('conexion', JSON.stringify(this.selectedConexion));
    sessionStorage.setItem('recinto', this.selectedRecinto.nombre);
    this.parametrosService.mensaje.next('Parámetros establecidos');
  }

  estadoBotonEstablecer() {
    return (this.form.value['recinto'] === '' || this.form.value['conexion'] === '');
  }

}
