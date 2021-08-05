import { Component, OnDestroy, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { Subscription } from 'rxjs';
import { Ciudad } from '../../_model/ciudad';
import { ObjJSON } from '../../_model/objJSON';
import { Recinto } from '../../_model/recinto';
import { CiudadService } from '../../_service/ciudad.service';
import { RecintoService } from '../../_service/recinto.service';

@Component({
  selector: 'ngx-recinto',
  templateUrl: './recinto.component.html',
  styleUrls: ['./recinto.component.scss'],
})
export class RecintoComponent implements OnInit, OnDestroy {

  listaCiudad: ObjJSON[] = [];
  ciudades: Ciudad[] = [];
  // private objListaCiudad: ListaCiudad;
  source: LocalDataSource;
  recinto: Recinto;
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

  constructor(private ciudadService: CiudadService, private recintoService: RecintoService) {
    this.source = new LocalDataSource();
  }

  ngOnInit() {
    this.recinto = new Recinto;

    this.subscription = this.recintoService.listarRecintos().subscribe(recintos => {
      this.source.load(recintos);
      // });

      this.subscription = this.ciudadService.listarCiudades().subscribe(ciudades => {
        this.ciudades = ciudades;
        // console.log(this.ciudades);
        for (let i = 0; i < ciudades.length; i++) {
          // this.objListaCiudad = new ListaCiudad;
          // this.objListaCiudad.title = ciudades[i].nombre;
          // this.objListaCiudad.value = ciudades[i].id;
          // this.listaCiudad.push(this.objListaCiudad);
          this.listaCiudad.push({ title: ciudades[i].nombre, value: ciudades[i].id });
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
            codRec: {
              title: 'Código',
              type: 'string',
            },
            tipo: {
              title: 'Tipo',
              type: 'string',
              editor: {
                type: 'list',
                config: {
                  list: [{ value: 'INTERIOR', title: 'INTERIOR' }, { value: 'FRONTERA', title: 'FRONTERA' }],
                },
              },
            },
            ciudad: {
              title: 'Ciudad',
              type: 'html',
              valuePrepareFunction: (cell, row) => cell.nombre,
              editor: {
                type: 'list',
                config: {
                  list: this.listaCiudad,
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

  eliminarRecinto(event) {
    if (window.confirm('Está seguro de dar de baja?')) {
      this.subscription = this.recintoService.eliminar(this.recinto.id).subscribe(data => {
        this.subscription = this.recintoService.listarRecintos().subscribe(recintos => {
          this.source = new LocalDataSource();
          this.source.load(recintos);
          this.recintoService.recintoCambio.next(recintos);
          this.recintoService.mensaje.next('Se eliminó');
          event.confirm.resolve(event.newData);
        });
      });
    } else {
      event.confirm.reject();
    }
  }

  editarRecinto(event) {
    this.recinto = event.data;
    this.recinto.nombre = event.newData.nombre;
    this.recinto.codRec = event.newData.codRec;
    this.recinto.tipo = event.newData.tipo;
    this.recinto.ciudad = event.newData.ciudad;

    this.subscription = this.recintoService.modificar(this.recinto).subscribe(data => {
      this.subscription = this.recintoService.listarRecintos().subscribe(recintos => {
        this.source = new LocalDataSource();
        this.source.load(recintos);
        this.recintoService.recintoCambio.next(recintos);
        this.recintoService.mensaje.next('Se modificó');
        event.confirm.resolve(event.newData);
      });
    });
  }

  crearRecinto(event) {
    this.recinto.nombre = event.newData.nombre;
    this.recinto.codRec = event.newData.codRec;
    this.recinto.estado = 'ACTIVO';
    const tzoffset = (new Date()).getTimezoneOffset() * 60000;
    const localISOTime = (new Date(Date.now() - tzoffset)).toISOString();
    this.recinto.fecha = localISOTime;
    this.recinto.tipo = event.newData.tipo;
    for (let i = 0; i < this.ciudades.length; i++) {
      if (this.ciudades[i].id.toString() === event.newData.ciudad.toString()) {
        this.recinto.ciudad = this.ciudades[i];
      }
    }

    this.subscription = this.recintoService.registrar(this.recinto).subscribe(data => {
      this.subscription = this.recintoService.listarRecintos().subscribe(recintos => {
        this.source = new LocalDataSource();
        this.source.load(recintos);
        this.recintoService.mensaje.next('Se registró');
        this.recintoService.recintoCambio.next(recintos);
        event.confirm.resolve(event.newData);
      });
    });
  }

}
