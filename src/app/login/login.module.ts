import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NbLayoutModule } from '@nebular/theme';
import { LoginComponent } from './login.component';


@NgModule({
    imports: [
        FormsModule,
        ReactiveFormsModule,
        NbLayoutModule,
        CommonModule
    ],
    declarations: [
        LoginComponent,
    ],
})
export class LoginModule { }
