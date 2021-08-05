import { NgModule } from '@angular/core';

import { NgxEchartsModule } from 'ngx-echarts';

import { ThemeModule } from '../../@theme/theme.module';
import { NbCardModule } from '@nebular/theme';
import { RecintoComponent } from './recinto.component';
import { Ng2SmartTableModule } from 'ng2-smart-table';

@NgModule({
    imports: [
        ThemeModule,
        NgxEchartsModule,
        Ng2SmartTableModule,
        NbCardModule
    ],
    declarations: [
        RecintoComponent,
    ],
})
export class RecintoModule { }
