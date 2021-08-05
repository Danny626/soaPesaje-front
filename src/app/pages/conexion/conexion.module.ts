import { NgModule } from '@angular/core';

import { NgxEchartsModule } from 'ngx-echarts';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { NbCardModule } from '@nebular/theme';

import { ThemeModule } from '../../@theme/theme.module';
import { ConexionComponent } from './conexion.component';

@NgModule({
    imports: [
        ThemeModule,
        NgxEchartsModule,
        Ng2SmartTableModule,
        NbCardModule
    ],
    declarations: [
        ConexionComponent,
    ],
})
export class ConexionModule { }
