import { NgModule } from '@angular/core';

import { NgxEchartsModule } from 'ngx-echarts';

import { ThemeModule } from '../../@theme/theme.module';
import { 
  NbCardModule,
  NbDatepickerModule,
  NbIconModule,
  NbInputModule,
  NbRadioModule,
  NbSelectModule
 } from '@nebular/theme';

import { PesajeComponent } from './pesaje.component';
import { PesoComponent } from './peso/peso.component';
import { WindowComponent } from './window/window.component';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { NbWindowModule, NbDialogModule, NbTabsetModule } from '@nebular/theme';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { DialogBoletaComponent } from './dialog-boleta/dialog-boleta.component';
import { RegistroComponent } from './registro/registro.component';
import { PesoDraggerComponent } from './peso/peso-dragger/peso-dragger.component';
import { SharedModule } from '../../_shared/shared.module';
import { BusquedaPesajesComponent } from './window/busqueda-pesajes/busqueda-pesajes.component';

@NgModule({
  imports: [
    ThemeModule,
    NgxEchartsModule,
    Ng2SmartTableModule,
    NbWindowModule.forChild(),
    PdfViewerModule,
    NbDialogModule.forChild(),
    NbCardModule,
    NbTabsetModule,
    NbIconModule,
    NbRadioModule,
    SharedModule,
    NbDatepickerModule,
    NbInputModule,
    NbSelectModule,
  ],
  declarations: [
    PesajeComponent,
    PesoComponent,
    WindowComponent,
    DialogBoletaComponent,
    RegistroComponent,
    PesoDraggerComponent,
    BusquedaPesajesComponent,
  ],
  entryComponents: [
    DialogBoletaComponent,
    RegistroComponent,
    PesoDraggerComponent,
  ],
})
export class PesajeModule { }
