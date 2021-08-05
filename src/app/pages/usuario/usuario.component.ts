import { Component, OnDestroy, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { Subscription } from 'rxjs';
import { Usuario } from '../../_model/usuario';
import { UsuarioService } from '../../_service/usuario.service';

@Component({
  selector: 'ngx-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.scss'],
})
export class UsuarioComponent implements OnInit, OnDestroy {

  source: LocalDataSource;
  usuario: Usuario;
  private subscription: Subscription;

  settings = {
    actions: {
      add: false,
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

  constructor(private usuarioService: UsuarioService) {
    this.source = new LocalDataSource();
  }

  ngOnInit() {
    this.usuario = new Usuario;

    this.subscription = this.usuarioService.listarUsuarios().subscribe(usuarios => {
      this.source.load(usuarios);
      // });

      this.settings = {
        actions: {
          add: false,
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
          username: {
            title: 'Usuario',
            type: 'string',
          },
          enabled: {
            title: 'Habilitado',
            type: 'boolean',
            editor: {
              type: 'list',
              config: {
                list: [{ value: 'true', title: 'Habilitado' }, { value: 'false', title: 'Inhabilitado' }],
              },
            },
          },
        },
      };
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  eliminarUsuario(event) {
    if (window.confirm('Are you sure you want to delete?')) {
      this.subscription = this.usuarioService.eliminar(this.usuario.id).subscribe(data => {
        this.subscription = this.usuarioService.listarUsuarios().subscribe(usuarios => {
          this.source = new LocalDataSource();
          this.source.load(usuarios);
          this.usuarioService.usuarioCambio.next(usuarios);
          this.usuarioService.mensaje.next('Se eliminó');
          event.confirm.resolve(event.newData);
        });
      });
    } else {
      event.confirm.reject();
    }
  }

  editarUsuario(event) {
    this.usuario = event.data;
    this.usuario.username = event.newData.username;
    this.usuario.enabled = event.newData.enabled;

    this.subscription = this.usuarioService.modificar(this.usuario).subscribe(data => {
      this.subscription = this.usuarioService.listarUsuarios().subscribe(usuarios => {
        this.source = new LocalDataSource();
        this.source.load(usuarios);
        this.usuarioService.usuarioCambio.next(usuarios);
        this.usuarioService.mensaje.next('Se modificó');
        event.confirm.resolve(event.newData);
      });
    });
  }

}
