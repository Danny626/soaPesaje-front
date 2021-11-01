import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaginatorComponent } from './paginator/paginator.component';

const sharedComponents = [PaginatorComponent];

@NgModule({
  declarations: [sharedComponents],
  imports: [
    CommonModule,
  ],
  exports: [sharedComponents],
  entryComponents: [sharedComponents],
})
export class SharedModule { }
