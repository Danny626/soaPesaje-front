import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'ngx-paginator',
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.scss']
})
export class PaginatorComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  pageChanged(event) {
    console.log(event);
  }

}
