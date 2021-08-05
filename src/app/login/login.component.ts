import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Usuario } from '../_model/usuario';
import { LoginService } from '../_service/login.service';
import { UsuarioService } from '../_service/usuario.service';
import { TOKEN_NAME } from '../_shared/var.constant';
import { Subscription } from 'rxjs';

@Component({
  selector: 'ngx-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {

  loginForm: FormGroup;
  registroForm: FormGroup;
  private subscription: Subscription;

  constructor(
    private loginService: LoginService,
    private router: Router,
    private usuarioService: UsuarioService,
    private toastr: ToastrService,
  ) {
  }

  ngOnInit() {
    this.loginForm = new FormGroup({
      'email': new FormControl(''),
      'password': new FormControl(''),
    });
    this.registroForm = new FormGroup({
      'email': new FormControl(''),
      'usuario': new FormControl(''),
      'password1': new FormControl(''),
      'password2': new FormControl(''),
    });
  }

  ngOnDestroy(){
    this.subscription.unsubscribe();
  }

  login() {
    let email: string = '';
    email = this.loginForm.value['email'];
    let passw: string = '';
    passw = this.loginForm.value['password'];
    this.subscription = this.loginService.login(email, passw).subscribe(data => {
      if (data) {
        const token = JSON.stringify(data);
        sessionStorage.setItem(TOKEN_NAME, token);

        // const tk = JSON.parse(sessionStorage.getItem(TOKEN_NAME));
        // const decodedToken = decode(tk.access_token);
        // sessionStorage.setItem('usuario', decodedToken.user_name);
        this.router.navigate(['pages']);
      }
    });
  }

  crearUsuario() {
    if (this.registroForm.value['password1'] === this.registroForm.value['password2']) {
      let usuario: Usuario;
      usuario = new Usuario;
      usuario.enabled = 'true';
      usuario.password = this.registroForm.value['password1'];
      usuario.username = this.registroForm.value['usuario'];
      this.subscription = this.usuarioService.registrar(usuario).subscribe(data => {
        this.usuarioService.mensaje.next('Se registró');
        this.toastr.success('Se registró', 'Éxito', { timeOut: 5000 });
      });
    } else {
      this.usuarioService.mensaje.next('Error verifique las contraseñas.');
      this.toastr.error('Error verifique las contraseñas.', 'Error', { timeOut: 5000 });
    }
  }
}
