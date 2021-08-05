import { NgModule } from '@angular/core';
import { Ng2SmartTableModule } from 'ng2-smart-table';

import { ThemeModule } from '../../@theme/theme.module';
import { AduanaComponent } from './aduana.component';
import { NbCardModule } from '@nebular/theme';

@NgModule({
    imports: [
        ThemeModule,
        Ng2SmartTableModule,
        NbCardModule
    ],
    declarations: [
        AduanaComponent,
    ],
})
export class AduanaModule { }
