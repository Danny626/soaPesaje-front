import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import jwt_decode from "jwt-decode";
import { Subscription } from 'rxjs';
import { Balanza } from '../_model/balanza';
import { BalanzaUsuario } from '../_model/balanzaUsuario';
import { Recinto } from '../_model/recinto';
import { TOKEN_NAME } from './../_shared/var.constant';
import { BalanzaUsuarioService } from './balanza-usuario.service';
import { BalanzaService } from './balanza.service';
import { LoginService } from './login.service';
import { ParametrosService } from './parametros.service';
import { RecintoService } from './recinto.service';

@Injectable({
  providedIn: 'root'
})
export class GuardPesajeService {

  placa: string;
  codBalanza: string;
  codRecinto: string;
  loginDirecto: boolean = false;
  private subscription: Subscription;

  constructor(
    private loginService: LoginService,
    private balanzaUsuarioService: BalanzaUsuarioService,
    private parametrosService: ParametrosService,
    private balanzaService: BalanzaService,
    private recintoService: RecintoService,
    private router: Router,
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const helper = new JwtHelperService();
    /* const rutaPesaje = `pages/${route.url[0].path}`; */
    const rutaPesaje = `pages/pesaje`;
    const rpta = this.loginService.estaLogeado();    
      
    const usuario = route.queryParams.usuario;
    const placa = route.queryParams.placa;
    const cBalanza = route.queryParams.balanza;
    const cRecinto = route.queryParams.recinto;

    if (!rpta) {
      sessionStorage.clear();
      if ( usuario !== undefined && placa !== undefined) {
        this.setInfoPlaca(placa);
        this.setInfoCodBalanza(cBalanza);
        this.setInfoLoginDirecto(true);
        return this.login(usuario, rutaPesaje, cRecinto, cBalanza);
      } else {
        this.router.navigate(['login']);
        return false;
      }
    } else {
      const token = JSON.parse(sessionStorage.getItem(TOKEN_NAME));
      if (!helper.isTokenExpired(token.access_token)) {
        if ( usuario !== undefined && placa !== undefined ) {
          this.setInfoPlaca(placa);
          this.setInfoCodBalanza(cBalanza);
          this.setInfoLoginDirecto(true);

          this.establecerParametrosConexion(cRecinto, cBalanza);
        }

        const decodedToken = jwt_decode(token.access_token);
        return true;
      } else {
        sessionStorage.clear();
        if ( usuario !== undefined && placa !== undefined ) {
          //return this.login(usuario, rutaPesaje, cRecinto, cBalanza);
          return this.login(usuario, rutaPesaje, cRecinto, cBalanza);
        } else {
          this.router.navigate(['login']);
          return false;
        }
      }
    }
    
  }

  get infoPlaca(): string {
    return this.placa;
  }

  setInfoPlaca(placa: string) {
    this.placa = placa;
  }

  get infoCodBalanza(): string {
    return this.codBalanza;
  }

  setInfoCodRecinto(recinto: string) {
    this.codRecinto = recinto;
  }

  get infoCodRecinto(): string {
    return this.codRecinto;
  }

  setInfoCodBalanza(balanza: string) {
    this.codBalanza = balanza;
  }

  get infoLoginDirecto(): boolean {
    return this.loginDirecto;
  }

  setInfoLoginDirecto(loginDirecto: boolean) {
    this.loginDirecto = loginDirecto;
  }

  login(userName: string, rutaPesaje: string, cRecinto: string, cBalanza: string) {
    this.balanzaUsuarioService.obtenerUsuarioPorNombreUsuario(userName)
        .subscribe((usuarioData: BalanzaUsuario) => {
          this.loginService.login(usuarioData.balanzaUsuarioPK.usrCod, usuarioData.busPasswd)
              .subscribe(loginData => {
                if (loginData) {
                  const token = JSON.stringify(loginData);
                  sessionStorage.setItem(TOKEN_NAME, token);
                  this.establecerParametrosConexion(cRecinto, cBalanza);
                  this.router.navigate([rutaPesaje]);
                  return true;
                } else {
                  return false;
                }
              });
        });
  }

  establecerParametrosConexion(codRecinto: string, cBalanza: string) {
    // this.parametrosService.varConexion.next(conexion);
    this.balanzaService.buscarPorBlzCod(cBalanza).subscribe((bal: Balanza) => {
      this.parametrosService.setBalanza(bal).subscribe(data => {
          
        this.recintoService.buscarPorCodRecinto(codRecinto).subscribe(
          (rec: Recinto) => {
            this.parametrosService.varRecinto.next(rec);
    
            if (bal != null) {
              sessionStorage.setItem('balanza', JSON.stringify(bal));
              this.parametrosService.varBalanza.next(bal);
            } else {
              sessionStorage.setItem('balanza', null);
              this.parametrosService.varBalanza.next(null);
            }
        
            // sessionStorage.setItem('conexion', JSON.stringify(conexion));
            sessionStorage.setItem('recinto', rec.nombre);
            this.parametrosService.mensaje.next('Parámetros establecidos');
    
        });
      });
    });
    
    
  }

}
