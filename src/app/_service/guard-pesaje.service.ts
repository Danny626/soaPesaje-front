import { Injectable } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, Params, Router, RouterStateSnapshot } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import jwt_decode from "jwt-decode";
import { BalanzaUsuario } from '../_model/balanzaUsuario';
import { TOKEN_NAME } from './../_shared/var.constant';
import { BalanzaUsuarioService } from './balanza-usuario.service';
import { LoginService } from './login.service';

@Injectable({
  providedIn: 'root'
})
export class GuardPesajeService {

  constructor(
    private loginService: LoginService,
    private balanzaUsuarioService: BalanzaUsuarioService,
    private router: Router,
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const helper = new JwtHelperService();
    /* const rutaPesaje = `pages/${route.url[0].path}`; */
    const rutaPesaje = `pages/pesaje`;
    const rpta = this.loginService.estaLogeado();    
      
    const usuario = route.queryParams.usuario;
    const placa = route.queryParams.placa;

    if (!rpta) {
      sessionStorage.clear();
      if ( usuario !== undefined && placa !== undefined) {
        return this.login(usuario, rutaPesaje);
      } else {
        this.router.navigate(['login']);
        return false;
      }
    } else {
      const token = JSON.parse(sessionStorage.getItem(TOKEN_NAME));
      if (!helper.isTokenExpired(token.access_token)) {
        const decodedToken = jwt_decode(token.access_token);
        return true;
      } else {
        sessionStorage.clear();
        if ( usuario !== undefined && placa !== undefined ) {
          return this.login(usuario, rutaPesaje);
        } else {
          this.router.navigate(['login']);
          return false;
        }
      }
    }
    
  }

  login(userName: string, rutaPesaje: string) {
    this.balanzaUsuarioService.obtenerUsuarioPorNombreUsuario(userName)
        .subscribe((usuarioData: BalanzaUsuario) => {
          this.loginService.login(usuarioData.balanzaUsuarioPK.usrCod, usuarioData.busPasswd)
              .subscribe(loginData => {
                if (loginData) {
                  const token = JSON.stringify(loginData);
                  sessionStorage.setItem(TOKEN_NAME, token);
                  this.router.navigate([rutaPesaje]);
                  return true;
                } else {
                  return false;
                }
              });
        });
  }
}
