import { Component, OnDestroy, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { Subscription } from 'rxjs';
import { Conexion } from '../../_model/conexion';
import { ObjJSON } from '../../_model/objJSON';
import { Recinto } from '../../_model/recinto';
import { ConexionService } from '../../_service/conexion.service';
import { RecintoService } from '../../_service/recinto.service';

@Component({
  selector: 'ngx-conexion',
  templateUrl: './conexion.component.html',
  styleUrls: ['./conexion.component.scss'],
})
export class ConexionComponent implements OnInit, OnDestroy {

  listaRecinto: ObjJSON[] = [];
  recintos: Recinto[] = [];
  source: LocalDataSource;
  conexion: Conexion;
  private subscription: Subscription;

  settings = {
    add: {
      addButtonContent: '<i class="nb-plus"></i>',
      createButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
      confirmCreate: true,
    },
    edit: {
      editButtonContent: '<i class="nb-edit"></i>',
      saveButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
      confirmSave: true,
    },
    delete: {
      deleteButtonContent: '<i class="nb-trash"></i>',
      confirmDelete: true,
    },
    columns: {},
  };

  constructor(private recintoService: RecintoService, private conexionService: ConexionService) {
    this.source = new LocalDataSource();
  }

  ngOnInit() {
    this.conexion = new Conexion;

    this.subscription = this.conexionService.listarConexiones().subscribe(conexiones => {
      this.source.load(conexiones);

      this.subscription = this.recintoService.listarRecintosPorEstado('ACTIVO').subscribe(recintos => {
        this.recintos = recintos;
        for (const item of recintos) {
          this.listaRecinto.push({ title: item.nombre, value: item.id });
        }
        this.settings = {
          add: {
            addButtonContent: '<i class="nb-plus">Nuevo</i>',
            createButtonContent: '<i class="nb-checkmark"></i>',
            cancelButtonContent: '<i class="nb-close"></i>',
            confirmCreate: true,
          },
          edit: {
            editButtonContent: '<i class="nb-edit"></i>',
            saveButtonContent: '<i class="nb-checkmark"></i>',
            cancelButtonContent: '<i class="nb-close"></i>',
            confirmSave: true,
          },
          delete: {
            deleteButtonContent: '<i class="nb-trash"></i>',
            confirmDelete: true,
          },
          columns: {
            nombre: {
              title: 'Nombre',
              type: 'string',
            },
            bd: {
              title: 'BD',
              type: 'string',
            },
            clave: {
              title: 'Clave',
              type: 'string',
            },
            ipMaquina: {
              title: 'IP',
              type: 'string',
            },
            nombreUsuario: {
              title: 'Usuario',
              type: 'string',
            },
            recinto: {
              title: 'Recinto',
              type: 'html',
              valuePrepareFunction: (cell, row) => cell.nombre,
              editor: {
                type: 'list',
                config: {
                  list: this.listaRecinto,
                },
              },
            },
          },
        };
      });
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  eliminarConexion(event) {
    if (window.confirm('Está seguro de dar de baja?')) {
      this.subscription = this.conexionService.eliminar(this.conexion.id).subscribe(data => {
        this.subscription = this.conexionService.listarConexiones().subscribe(conexiones => {
          this.source = new LocalDataSource();
          this.source.load(conexiones);
          this.conexionService.conexionCambio.next(conexiones);
          this.conexionService.mensaje.next('Se eliminó');
          event.confirm.resolve(event.newData);
        });
      });
    } else {
      event.confirm.reject();
    }
  }

  editarConexion(event) {
    this.conexion = event.data;
    this.conexion.nombre = event.newData.nombre;
    this.conexion.bd = event.newData.bd;
    this.conexion.clave = event.newData.clave;
    this.conexion.ipMaquina = event.newData.ipMaquina;
    this.conexion.nombre = event.newData.nombre;
    this.conexion.nombreUsuario = event.newData.nombreUsuario;

    this.subscription = this.conexionService.modificar(this.conexion).subscribe(data => {
      this.subscription = this.conexionService.listarConexiones().subscribe(conexiones => {
        this.source = new LocalDataSource();
        this.source.load(conexiones);
        this.conexionService.conexionCambio.next(conexiones);
        this.conexionService.mensaje.next('Se modificó');
        event.confirm.resolve(event.newData);
      });
    });
  }

  crearConexion(event) {
    this.conexion.nombre = event.newData.nombre;
    this.conexion.bd = event.newData.bd;
    this.conexion.clave = event.newData.clave;
    this.conexion.ipMaquina = event.newData.ipMaquina;
    this.conexion.nombre = event.newData.nombre;
    this.conexion.nombreUsuario = event.newData.nombreUsuario;
    this.conexion.estado = 'ACTIVO';
    const tzoffset = (new Date()).getTimezoneOffset() * 60000;
    const localISOTime = (new Date(Date.now() - tzoffset)).toISOString();
    this.conexion.fecha = localISOTime;

    for (let item of this.recintos) {
      if (item.id.toString() === event.newData.recinto.toString()) {
        this.conexion.recinto = item;
      }
    }
    this.subscription = this.conexionService.registrar(this.conexion).subscribe(data => {
      this.subscription = this.conexionService.listarConexiones().subscribe(conexiones => {
        this.source = new LocalDataSource();
        this.source.load(conexiones);
        this.conexionService.conexionCambio.next(conexiones);
        this.conexionService.mensaje.next('Se registró');
        event.confirm.resolve(event.newData);
      });
    });
  }
}
