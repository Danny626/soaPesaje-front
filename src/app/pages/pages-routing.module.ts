import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { PagesComponent } from './pages.component';
import { NotFoundComponent } from './miscellaneous/not-found/not-found.component';
import { InicioComponent } from './inicio/inicio.component';
import { PesajeComponent } from './pesaje/pesaje.component';
import { AduanaComponent } from './aduana/aduana.component';
import { RecintoComponent } from './recinto/recinto.component';
import { BalanzaComponent } from './balanza/balanza.component';
import { ConexionComponent } from './conexion/conexion.component';
import { ParametroComponent } from './parametro/parametro.component';
import { UsuarioComponent } from './usuario/usuario.component';
import { GuardService } from '../_service/guard.service';
import { GuardPesajeService } from '../_service/guard-pesaje.service';

const routes: Routes = [{
  path: '',
  component: PagesComponent,
  children: [
    /**
     * Componentes soaPesaje
     */
    {
      path: 'inicio',
      component: InicioComponent,
      canActivate: [GuardService]
    }, {
      path: 'pesaje',
      component: PesajeComponent,
      canActivate: [GuardPesajeService]
    }, {
      path: 'aduana',
      component: AduanaComponent,
      canActivate: [GuardService]
    }, {
      path: 'recinto',
      component: RecintoComponent,
      canActivate: [GuardService]
    }, {
      path: 'balanza',
      component: BalanzaComponent,
      canActivate: [GuardService]
    }, {
      path: 'conexion',
      component: ConexionComponent,
      canActivate: [GuardService]
    }, {
      path: 'parametro',
      component: ParametroComponent,
      canActivate: [GuardService]
    }, {
      path: 'usuario',
      component: UsuarioComponent,
      canActivate: [GuardService]
    },

    /* {
      path: 'inicio',
      loadChildren: () => import('./inicio/inicio.module')
        .then(m => m.InicioModule),
    },
    {
      path: 'pesaje',
      loadChildren: () => import('./pesaje/pesaje.module')
        .then(m => m.PesajeModule),
    },
    {
      path: 'aduana',
      loadChildren: () => import('./aduana/aduana.module')
        .then(m => m.AduanaModule),
    },
    {
      path: 'recinto',
      loadChildren: () => import('./recinto/recinto.module')
        .then(m => m.RecintoModule),
    },
    {
      path: 'balanza',
      loadChildren: () => import('./balanza/balanza.module')
        .then(m => m.BalanzaModule),
    },
    {
      path: 'conexion',
      loadChildren: () => import('./conexion/conexion.module')
        .then(m => m.ConexionModule),
    },
    {
      path: 'parametro',
      loadChildren: () => import('./parametro/parametro.module')
        .then(m => m.ParametroModule),
    },
    {
      path: 'usuario',
      loadChildren: () => import('./usuario/usuario.module')
        .then(m => m.UsuarioModule),
    }, */
    /**
     * Componentes Template
     */
    /* {
      path: 'dashboard',
      component: ECommerceComponent,
    },
    {
      path: 'iot-dashboard',
      component: DashboardComponent,
    },
    {
      path: 'layout',
      loadChildren: () => import('./layout/layout.module')
        .then(m => m.LayoutModule),
    },
    {
      path: 'forms',
      loadChildren: () => import('./forms/forms.module')
        .then(m => m.FormsModule),
    },
    {
      path: 'ui-features',
      loadChildren: () => import('./ui-features/ui-features.module')
        .then(m => m.UiFeaturesModule),
    },
    {
      path: 'modal-overlays',
      loadChildren: () => import('./modal-overlays/modal-overlays.module')
        .then(m => m.ModalOverlaysModule),
    },
    {
      path: 'extra-components',
      loadChildren: () => import('./extra-components/extra-components.module')
        .then(m => m.ExtraComponentsModule),
    },
    {
      path: 'maps',
      loadChildren: () => import('./maps/maps.module')
        .then(m => m.MapsModule),
    },
    {
      path: 'charts',
      loadChildren: () => import('./charts/charts.module')
        .then(m => m.ChartsModule),
    },
    {
      path: 'editors',
      loadChildren: () => import('./editors/editors.module')
        .then(m => m.EditorsModule),
    },
    {
      path: 'tables',
      loadChildren: () => import('./tables/tables.module')
        .then(m => m.TablesModule),
    },
    {
      path: 'miscellaneous',
      loadChildren: () => import('./miscellaneous/miscellaneous.module')
        .then(m => m.MiscellaneousModule),
    }, */
    {
      path: '',
      redirectTo: 'inicio',
      pathMatch: 'full',
    },
    {
      path: '**',
      component: NotFoundComponent,
    },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {
}
