import { Component, OnDestroy, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { Subscription } from 'rxjs';
import { Balanza } from '../../_model/balanza';
import { ObjJSON } from '../../_model/objJSON';
import { Parametro } from '../../_model/parametro';
import { ParametroService } from '../../_service/parametro.service';
import { BalanzaService } from './../../_service/balanza.service';

@Component({
  selector: 'ngx-parametro',
  templateUrl: './parametro.component.html',
  styleUrls: ['./parametro.component.scss'],
})
export class ParametroComponent implements OnInit, OnDestroy {

  listaBalanza: ObjJSON[] = [];
  balanzas: Balanza[] = [];
  source: LocalDataSource;
  parametro: Parametro;
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

  constructor(private balanzaService: BalanzaService, private parametroService: ParametroService) {
    this.source = new LocalDataSource();
  }

  ngOnInit() {
    this.parametro = new Parametro;

    this.subscription = this.parametroService.listarParametros().subscribe(parametros => {
      this.source.load(parametros);

      this.subscription = this.balanzaService.listarBalanzas().subscribe(balanzas => {
        this.balanzas = balanzas;
        for (let item of balanzas) {
          this.listaBalanza.push({ title: item.nombre, value: item.id });
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
            puerto: {
              title: 'Puerto',
              type: 'string',
            },
            baudRate: {
              title: 'BaudRate',
              type: 'string',
            },
            paridad: {
              title: 'Paridad',
              type: 'string',
            },
            stopBits: {
              title: 'StopBits',
              type: 'string',
            },
            byteSize: {
              title: 'ByteSize',
              type: 'string',
            },
            balanza: {
              title: 'Balanza',
              type: 'html',
              valuePrepareFunction: (cell, row) => cell.nombre,
              editor: {
                type: 'list',
                config: {
                  list: this.listaBalanza,
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

  eliminarParametro(event) {
    if (window.confirm('Are you sure you want to delete?')) {
      this.subscription = this.parametroService.eliminar(this.parametro.id).subscribe(data => {
        this.subscription = this.parametroService.listarParametros().subscribe(parametros => {
          this.source = new LocalDataSource();
          this.source.load(parametros);
          this.parametroService.parametroCambio.next(parametros);
          this.parametroService.mensaje.next('Se eliminó');
          event.confirm.resolve(event.newData);
        });
      });
    } else {
      event.confirm.reject();
    }
  }

  editarParametro(event) {
    this.parametro = event.data;
    this.parametro.puerto = event.newData.puerto;
    this.parametro.baudRate = event.newData.baudRate;
    this.parametro.paridad = event.newData.paridad;
    this.parametro.stopBits = event.newData.stopBits;
    this.parametro.byteSize = event.newData.byteSize;

    this.subscription = this.parametroService.modificar(this.parametro).subscribe(data => {
      this.subscription = this.parametroService.listarParametros().subscribe(parametros => {
        this.source = new LocalDataSource();
        this.source.load(parametros);
        this.parametroService.parametroCambio.next(parametros);
        this.parametroService.mensaje.next('Se modificó');
        event.confirm.resolve(event.newData);
      });
    });
  }

  crearParametro(event) {
    this.parametro.puerto = event.newData.puerto;
    this.parametro.baudRate = event.newData.baudRate;
    this.parametro.paridad = event.newData.paridad;
    this.parametro.stopBits = event.newData.stopBits;
    this.parametro.byteSize = event.newData.byteSize;

    for (let item of this.balanzas) {
      if (item.id.toString() === event.newData.balanza.toString()) {
        this.parametro.balanza = item;
      }
    }

    this.subscription = this.parametroService.registrar(this.parametro).subscribe(data => {
      this.subscription = this.parametroService.listarParametros().subscribe(parametros => {
        this.source = new LocalDataSource();
        this.source.load(parametros);
        this.parametroService.mensaje.next('Se registró');
        event.confirm.resolve(event.newData);
      });
    });
  }

}
