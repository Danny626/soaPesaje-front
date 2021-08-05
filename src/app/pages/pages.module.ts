import { NgModule } from '@angular/core';
import { NbMenuModule } from '@nebular/theme';

import { ThemeModule } from '../@theme/theme.module';
import { PagesComponent } from './pages.component';
import { DashboardModule } from './dashboard/dashboard.module';
import { ECommerceModule } from './e-commerce/e-commerce.module';
import { PagesRoutingModule } from './pages-routing.module';
import { MiscellaneousModule } from './miscellaneous/miscellaneous.module';
import { ParametroModule } from './parametro/parametro.module';
import { UsuarioModule } from './usuario/usuario.module';
import { ConexionModule } from './conexion/conexion.module';
import { BalanzaModule } from './balanza/balanza.module';
import { RecintoModule } from './recinto/recinto.module';
import { AduanaModule } from './aduana/aduana.module';
import { PesajeModule } from './pesaje/pesaje.module';
import { InicioModule } from './inicio/inicio.module';

@NgModule({
  imports: [
    PagesRoutingModule,
    ThemeModule,
    NbMenuModule,
    DashboardModule,
    ECommerceModule,
    MiscellaneousModule,
    InicioModule,
    PesajeModule,
    AduanaModule,
    RecintoModule,
    BalanzaModule,
    ConexionModule,
    UsuarioModule,
    ParametroModule,
  ],
  declarations: [
    PagesComponent,
  ],
})
export class PagesModule {
}
