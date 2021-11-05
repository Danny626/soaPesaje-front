import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Usuario } from '../../../../_model/usuario';
import { UsuarioService } from '../../../../_service/usuario.service';

@Component({
  selector: 'ngx-busqueda-pesajes',
  templateUrl: './busqueda-pesajes.component.html',
  styleUrls: ['./busqueda-pesajes.component.scss']
})
export class BusquedaPesajesComponent implements OnInit {

  form: FormGroup;
  usuarios: Usuario[];

  constructor(
    public usuarioService: UsuarioService
  ) {
    this.form = new FormGroup({
      'fechas': new FormControl(''),
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

  }

}
