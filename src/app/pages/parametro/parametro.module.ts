import { NgModule } from '@angular/core';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { NbCardModule } from '@nebular/theme';

import { ThemeModule } from '../../@theme/theme.module';
import { ParametroComponent } from './parametro.component';

@NgModule({
    imports: [
        ThemeModule,
        Ng2SmartTableModule,
        NbCardModule
    ],
    declarations: [
        ParametroComponent,
    ],
})
export class ParametroModule { }
