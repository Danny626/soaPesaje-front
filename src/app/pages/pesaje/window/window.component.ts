import { DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { NbToastrService } from '@nebular/theme';
import { ServerDataSource } from 'ng2-smart-table';
import { Subscription } from 'rxjs';
import { PesajesSincronizadosDTO } from '../../../_dto/pesajesSincronizadosDTO';
import { Balanza } from '../../../_model/balanza';
import { ObjJSON } from '../../../_model/objJSON';
import { Pesaje } from '../../../_model/pesaje';
import { BalanzaService } from '../../../_service/balanza.service';
import { PesajeService } from '../../../_service/pesaje.service';

@Component({
  selector: 'ngx-window',
  templateUrl: './window.component.html',
  styleUrls: ['./window.component.scss'],
  providers: [DatePipe],
})
export class WindowComponent implements OnInit, OnDestroy {

  source: ServerDataSource;
  listaBalanza: ObjJSON[] = [];
  pesaje: Pesaje;
  balanzas: Balanza[] = [];
  selectedRows: Pesaje[];
  pageSize: number = 5;
  flagVerSinc: boolean = false;
  private subscription: Subscription;

  settings = {
    selectMode: this.flagVerSinc == true ? 'multi':'single',
    hideSubHeader: true,
    pager:{
      display: true,
      perPage: this.pageSize,
    },
    actions: {
      add: false,
      custom: [
        {
          name: 'imprAction',
          title: '<i class="fa fa-print" title="Imprimir"></i>',
        },
      ],
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

  constructor(private pesajeService: PesajeService,
    private balanzaService: BalanzaService,
    private toastrService: NbToastrService) {
  }

  ngOnInit() {
    this.pesaje = new Pesaje;

    this.cargarPesajes();

    /* this.subscription = this.pesajeService.pesajeCambio.subscribe(pesajes => {
      this.source.load(pesajes);
    }); */

    /* this.subscription = this.pesajeService.listarPesajes(this.pageNumber, this.pageSize).subscribe(pesajes => {
      this.source.load(pesajes); */

    this.subscription = this.balanzaService.listarBalanzas().subscribe(balanzas => {
      this.balanzas = balanzas;
      for (const item of balanzas) {
        this.listaBalanza.push({ title: item.nombre, value: item.id });
      }

      this.settings = {
        selectMode: this.flagVerSinc == true ? 'multi':'single',
        hideSubHeader: true,
        pager:{
          display: true,
          perPage: this.pageSize,
        },
        actions: {
          add: false,
          custom: [
            {
              name: 'imprAction',
              title: '<i class="fa fa-print" title="Imprimir"></i>',
            },
          ],
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
          peso: {
            title: 'Peso',
            type: 'number',
          },
          fecha: {
            title: 'Fecha',
            editable: false,
            valuePrepareFunction: (created) => {
              return new DatePipe('es-BO').transform(new Date(created), 'dd/MM/yyyy HH:mm:ss');
            },
          },
          placa: {
            title: 'Placa',
            type: 'string',
          },
          envioServidor: {
            title: 'Sinc',
            type: 'string',
          },
          operacion: {
            title: 'Operación',
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
          usuario: {
            title: 'Usuario',
            type: 'html',
            editable: false,
            valuePrepareFunction: (cell, row) => cell.username,
          },
        },
      };
    });
   /*  }); */
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  cargarPesajes() {
    this.source = this.pesajeService.listarPesajesPaginado();
    this.flagVerSinc = false;
    this.cargarNuevoSetting();
  }

  eliminarPesaje(event) {
    if (window.confirm('Está seguro de eliminar el registro?')) {
      this.subscription = this.pesajeService.eliminar(this.pesaje.id).subscribe(data => {
        /* this.subscription = this.pesajeService.listarPesajes(this.pageNumber, this.pageSize).subscribe(pesajes => { */
        /* this.source.load(pesajes); */
        /* this.pesajeService.pesajeCambio.next(pesajes); */
        this.cargarPesajes();
        this.pesajeService.mensaje.next('Se eliminó');
        event.confirm.resolve(event.newData);
      });
      /* }); */
    } else {
      event.confirm.reject();
    }
  }

  crearPesaje(event) {
    for (const item of this.balanzas) {
      if (item.id.toString() === event.newData.balanza.toString()) {
        this.pesaje.balanza = item;
      }
    }
    this.pesaje.envioServidor = event.newData.envioServidor;
    this.pesaje.estado = '';
    this.pesaje.fecha = event.newData.fecha;
    this.pesaje.fechaServidor = '';
    this.pesaje.gestion = '';
    this.pesaje.observacion = event.newData.observacion;
    this.pesaje.operacion = event.newData.operacion;
    this.pesaje.peso = event.newData.peso;
    this.pesaje.pesoNeto = 0;
    this.pesaje.pesoTara = 0;
    this.pesaje.placa = event.newData.placa;

    this.pesaje.usuario = JSON.parse(sessionStorage.getItem('usuario'));

    this.subscription = this.pesajeService.registrar(this.pesaje).subscribe(data => {
      /* this.subscription = this.pesajeService.listarPesajes(this.pageNumber, this.pageSize).subscribe(pesajes => { */
      /* this.source.load(pesajes);
      this.pesajeService.pesajeCambio.next(pesajes); */
      this.cargarPesajes();
      this.pesajeService.mensaje.next('Se registró');
      event.confirm.resolve(event.newData);
      /* }); */
    });
  }

  // imprimirPesaje(event) {
  //   this.visible = false;
  //   this.pesajeService.generarBoleta(
  //     event.data.id,
  //     event.data.balanza.aduana.recinto.nombre,
  //     event.data.usuario.nombre).subscribe(data => {
  //       let reader = new FileReader();
  //       reader.onload = (e: any) => {
  //         this.pdfSrc = e.target.result; // base64
  //       };
  //       reader.readAsArrayBuffer(data);
  //     });
  // }

  imprimirPesaje(event) {
    this.subscription = this.pesajeService.generarBoleta(
      event.data.id,
      event.data.balanza.aduana.recinto.nombre,
      event.data.usuario.nombre).subscribe(data => {
        this.imprimirPDF(data);
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

  editarPesaje(event) {
    this.pesaje = event.data;
    // this.pesaje.observacion = event.newData.observacion;
    this.pesaje.operacion = event.newData.operacion;
    this.pesaje.peso = event.newData.peso;
    this.pesaje.placa = event.newData.placa;
    this.pesaje.envioServidor = event.newData.envioServidor;

    this.subscription = this.pesajeService.modificar(this.pesaje).subscribe(data => {
      /* this.subscription = this.pesajeService.listarPesajes(this.pageNumber, this.pageSize).subscribe(pesajes => { */
        /* this.source.load(pesajes);
        this.pesajeService.pesajeCambio.next(pesajes); */
        this.cargarPesajes();
        this.pesajeService.mensaje.next('Se modificó');
        event.confirm.resolve(event.newData);
      /* }); */
    });
  }

  onUserRowSelect(event) {
    this.selectedRows = event.selected;
  }

  cargarPesajesNoSincronizados() {
    this.flagVerSinc = true;
    this.cargarNuevoSetting();
    this.source = this.pesajeService.listarPesajesNoSincronizados();
  }

  cargarNuevoSetting() {
    let newSettings = {
      selectMode: this.flagVerSinc == true ? 'multi':'single',
      hideSubHeader: true,
      pager:{
        display: true,
        perPage: this.pageSize,
      },
      actions: {
        add: false,
        custom: [
          {
            name: 'imprAction',
            title: '<i class="fa fa-print" title="Imprimir"></i>',
          },
        ],
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
        peso: {
          title: 'Peso',
          type: 'number',
        },
        fecha: {
          title: 'Fecha',
          editable: false,
          valuePrepareFunction: (created) => {
            return new DatePipe('es-BO').transform(new Date(created), 'dd/MM/yyyy HH:mm:ss');
          },
        },
        placa: {
          title: 'Placa',
          type: 'string',
        },
        envioServidor: {
          title: 'Sinc',
          type: 'string',
        },
        operacion: {
          title: 'Operación',
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
        usuario: {
          title: 'Usuario',
          type: 'html',
          editable: false,
          valuePrepareFunction: (cell, row) => cell.username,
        },
      },
    };

    this.settings = Object.assign({}, newSettings);
  }

  sincronizarTodos() {
    this.subscription = this.pesajeService.sincronizarTodos().subscribe( (resp: PesajesSincronizadosDTO) => {
      
      if ( resp.cantError !== 0 ) {
        this.toastrService.show(
          `${resp.cantError} de ${resp.cantidad} no pudieron ser sincronizados. Intente nuevamente por favor.`,
          `Error`,
          {
            status: 'danger',
            duration: 5000
          }
        );
      }

      if ( resp.cantError === 0 ) {
        this.toastrService.show(
          `Se sincronizaron ${resp.cantSinc} de ${resp.cantidad} registros correctamente.`,
          `Éxito`,
          {
            status: 'success',
            duration: 5000
          }
        );
      }
      
    });
  }

  sincronizarSeleccionados() {
    this.subscription = this.pesajeService.sincronizarSeleccionados(this.selectedRows).subscribe((resp: PesajesSincronizadosDTO) => {
      if ( resp.cantError !== 0 ) {
        this.toastrService.show(
          `${resp.cantError} de ${resp.cantidad} no pudieron ser sincronizados. Intente nuevamente por favor.`,
          `Error`,
          {
            status: 'danger',
            duration: 5000
          }
        );
      }

      if ( resp.cantError === 0 ) {
        this.toastrService.show(
          `Se sincronizaron ${resp.cantSinc} de ${resp.cantidad} registros correctamente.`,
          `Éxito`,
          {
            status: 'success',
            duration: 5000
          }
        );
      }
    })
  }

}
