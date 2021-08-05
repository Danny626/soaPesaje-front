import { Component, Input, OnInit } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';

@Component({
  selector: 'ngx-dialog-boleta',
  templateUrl: './dialog-boleta.component.html',
  styleUrls: ['./dialog-boleta.component.scss'],
})
export class DialogBoletaComponent implements OnInit {

  private pdfSrc: string = '';
  @Input() title: string;

  constructor(protected ref: NbDialogRef<DialogBoletaComponent>) { }

  ngOnInit() {
  }

  dismiss() {
    this.ref.close();
  }

}
