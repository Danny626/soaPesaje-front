import { NgModule } from '@angular/core';

import { NgxEchartsModule } from 'ngx-echarts';

import { ThemeModule } from '../../@theme/theme.module';
import { BalanzaComponent } from './balanza.component';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { NbCardModule } from '@nebular/theme';

@NgModule({
    imports: [
        ThemeModule,
        NgxEchartsModule,
        Ng2SmartTableModule,
        NbCardModule
    ],
    declarations: [
        BalanzaComponent,
    ],
})
export class BalanzaModule { }
