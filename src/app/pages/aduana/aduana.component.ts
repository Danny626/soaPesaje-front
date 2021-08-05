import { Component, OnDestroy, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { Subscription } from 'rxjs';
import { Aduana } from '../../_model/aduana';
import { ObjJSON } from '../../_model/objJSON';
import { Recinto } from '../../_model/recinto';
import { AduanaService } from '../../_service/aduana.service';
import { RecintoService } from '../../_service/recinto.service';

@Component({
  selector: 'ngx-aduana',
  templateUrl: './aduana.component.html',
  styleUrls: ['./aduana.component.scss'],
})
export class AduanaComponent implements OnInit, OnDestroy {

  listaRecinto: ObjJSON[] = [];
  recintos: Recinto[] = [];
  source: LocalDataSource;
  aduana: Aduana;
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

  constructor(private recintoService: RecintoService, private aduanaService: AduanaService) {
    this.source = new LocalDataSource();
  }

  ngOnInit() {
    this.aduana = new Aduana;

    this.subscription = this.aduanaService.listarAduanas().subscribe(aduanas => {
      this.source.load(aduanas);

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
            codigo: {
              title: 'Código',
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

  eliminarAduana(event) {
    if (window.confirm('Está seguro de dar de baja?')) {
      this.subscription = this.aduanaService.eliminar(event.data.id).subscribe(data => {
        this.subscription = this.aduanaService.listarAduanas().subscribe(aduanas => {
          this.source = new LocalDataSource();
          this.source.load(aduanas);
          this.aduanaService.aduanaCambio.next(aduanas);
          this.aduanaService.mensaje.next('Se eliminó');
          event.confirm.resolve(event.newData);
        });
      });
    } else {
      event.confirm.reject();
    }
  }

  editarAduana(event) {
    this.aduana = event.data;
    this.aduana.nombre = event.newData.nombre;
    this.aduana.codigo = event.newData.codigo;
    this.aduana.recinto = event.newData.recinto;

    this.subscription = this.aduanaService.modificar(this.aduana).subscribe(data => {
      this.subscription = this.aduanaService.listarAduanas().subscribe(aduanas => {
        this.source = new LocalDataSource();
        this.source.load(aduanas);
        this.aduanaService.aduanaCambio.next(aduanas);
        this.aduanaService.mensaje.next('Se modificó');
        event.confirm.resolve(event.newData);
      });
    });
  }

  crearAduana(event) {
    this.aduana.nombre = event.newData.nombre;
    this.aduana.codigo = event.newData.codigo;
    this.aduana.estado = 'ACTIVO';
    const tzoffset = (new Date()).getTimezoneOffset() * 60000;
    const localISOTime = (new Date(Date.now() - tzoffset)).toISOString();
    this.aduana.fecha = localISOTime;

    for (const item of this.recintos) {
      if (item.id.toString() === event.newData.recinto.toString()) {
        this.aduana.recinto = item;
      }
    }

    this.subscription = this.aduanaService.registrar(this.aduana).subscribe(data => {
      this.subscription = this.aduanaService.listarAduanas().subscribe(aduanas => {
        this.source = new LocalDataSource();
        this.source.load(aduanas);
        this.aduanaService.mensaje.next('Se registró');
        event.confirm.resolve(event.newData);
      });
    });
  }

}
