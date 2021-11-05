import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

const sharedComponents = [];

@NgModule({
  declarations: [sharedComponents],
  imports: [
    CommonModule,
  ],
  exports: [sharedComponents],
  entryComponents: [sharedComponents],
})
export class SharedModule { }
