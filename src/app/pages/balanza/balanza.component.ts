import { Component, OnDestroy, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { Subscription } from 'rxjs';
import { Aduana } from '../../_model/aduana';
import { Balanza } from '../../_model/balanza';
import { ObjJSON } from '../../_model/objJSON';
import { AduanaService } from '../../_service/aduana.service';
import { BalanzaService } from '../../_service/balanza.service';

@Component({
  selector: 'ngx-balanza',
  templateUrl: './balanza.component.html',
  styleUrls: ['./balanza.component.scss'],
})
export class BalanzaComponent implements OnInit, OnDestroy {

  listaAduana: ObjJSON[] = [];
  aduanas: Aduana[] = [];
  source: LocalDataSource;
  balanza: Balanza;
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

  constructor(private aduanaService: AduanaService, private balanzaService: BalanzaService) {
    this.source = new LocalDataSource();
  }

  ngOnInit() {
    this.balanza = new Balanza;

    this.subscription = this.balanzaService.listarBalanzas().subscribe(balanzas => {
      this.source.load(balanzas);

      this.subscription = this.aduanaService.listarAduanasPorEstado('ACTIVO').subscribe(aduanas => {
        this.aduanas = aduanas;
        for (const item of aduanas) {
          this.listaAduana.push({ title: item.nombre, value: item.id });
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
            codigo: {
              title: 'Código',
              type: 'string',
            },
            tipo: {
              title: 'Tipo',
              type: 'string',
              editor: {
                type: 'list',
                config: {
                  list: [{ value: 'TRADE', title: 'TRADE' }, { value: 'CAS', title: 'CAS' }],
                },
              },
            },
            aduana: {
              title: 'Aduana',
              type: 'html',
              valuePrepareFunction: (cell, row) => cell.nombre,
              editor: {
                type: 'list',
                config: {
                  list: this.listaAduana,
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

  eliminarBalanza(event) {
    if (window.confirm('Está seguro de dar de baja?')) {
      this.subscription = this.balanzaService.eliminar(this.balanza.id).subscribe(data => {
        this.subscription = this.balanzaService.listarBalanzas().subscribe(balanzas => {
          this.source = new LocalDataSource();
          this.source.load(balanzas);
          this.balanzaService.balanzaCambio.next(balanzas);
          this.balanzaService.mensaje.next('Se eliminó');
          event.confirm.resolve(event.newData);
        });
      });
    } else {
      event.confirm.reject();
    }
  }

  crearBalanza(event) {
    this.balanza.nombre = event.newData.nombre;
    this.balanza.codigo = event.newData.codigo;
    this.balanza.tipo = event.newData.tipo;
    this.balanza.estado = 'ACTIVO';
    const tzoffset = (new Date()).getTimezoneOffset() * 60000;
    const localISOTime = (new Date(Date.now() - tzoffset)).toISOString();
    this.balanza.fecha = localISOTime;

    for (const item of this.aduanas) {
      if (item.id.toString() === event.newData.aduana.toString()) {
        this.balanza.aduana = item;
      }
    }

    this.subscription = this.balanzaService.registrar(this.balanza).subscribe(data => {
      this.subscription = this.balanzaService.listarBalanzas().subscribe(balanzas => {
        this.source = new LocalDataSource();
        this.source.load(balanzas);
        this.balanzaService.balanzaCambio.next(balanzas);
        this.balanzaService.mensaje.next('Se registró');
        event.confirm.resolve(event.newData);
      });
    });
  }

  editarBalanza(event) {
    this.balanza = event.data;
    this.balanza.nombre = event.newData.nombre;
    this.balanza.codigo = event.newData.codigo;
    this.balanza.aduana = event.newData.aduana;
    this.balanza.tipo = event.newData.tipo;

    this.subscription = this.balanzaService.modificar(this.balanza).subscribe(data => {
      this.subscription = this.balanzaService.listarBalanzas().subscribe(balanzas => {
        this.source = new LocalDataSource();
        this.source.load(balanzas);
        this.balanzaService.balanzaCambio.next(balanzas);
        this.balanzaService.mensaje.next('Se modificó');
        event.confirm.resolve(event.newData);
      });
    });
  }

}
