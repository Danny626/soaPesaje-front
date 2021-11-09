import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { NbDialogRef } from '@nebular/theme';
import { ServerDataSource } from 'ng2-smart-table';
import { PostServerDataSource } from '../../../../_dataSource/postserverdatasource';
import { ParamsBusquedaDTO } from '../../../../_dto/paramsBusquedaDTO';
import { Usuario } from '../../../../_model/usuario';
import { PesajeService } from '../../../../_service/pesaje.service';
import { UsuarioService } from '../../../../_service/usuario.service';

@Component({
  selector: 'ngx-busqueda-pesajes',
  templateUrl: './busqueda-pesajes.component.html',
  styleUrls: ['./busqueda-pesajes.component.scss']
})
export class BusquedaPesajesComponent implements OnInit {

  @Input() title: string;

  source: ServerDataSource;
  form: FormGroup;
  usuarios: Usuario[];

  constructor(
    private dialogRef: NbDialogRef<any>,
    public usuarioService: UsuarioService,
    public pesajeService: PesajeService,
  ) {
    this.form = new FormGroup({
      'fechas': new FormControl(),
      'operacion': new FormControl([]),
      'placa': new FormControl(''),
      'usuario': new FormControl([]),
    });
  }

  ngOnInit(): void {
    this.usuarioService.listarUsuarios().subscribe((resp: Usuario[]) => {
      this.usuarios = resp;
    });
  }

  buscarPesajes() {
    const paramsBusqueda: ParamsBusquedaDTO = {
      placa: this.form.value['placa'],
      fechaInicial: null,
      fechaFinal: null,
      operacion: this.form.value['operacion'],
      nombreUsuario: this.form.value['usuario'],
    }
    
    if ( this.form.value['fechas'] !== null ) {
      paramsBusqueda.fechaInicial = this.form.value['fechas'].start;
      
      if ( this.form.value['fechas'].end ) {
        paramsBusqueda.fechaFinal = this.form.value['fechas'].end;
      } else {
        paramsBusqueda.fechaFinal = this.form.value['fechas'].start;
      }
    }


    this.source = this.pesajeService.buscarPesajesPaginado(paramsBusqueda);
    this.pesajeService.dataSourceCambio.next(this.source);

    this.cerrarBusqueda();
    
  }

  cerrarBusqueda() {
    this.dialogRef.close();
  }

}
