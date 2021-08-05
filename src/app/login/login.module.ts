import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './login.component';
import { NbLayoutModule } from '@nebular/theme';


@NgModule({
    imports: [
        FormsModule,
        ReactiveFormsModule,
        NbLayoutModule,
    ],
    declarations: [
        LoginComponent,
    ],
})
export class LoginModule { }
