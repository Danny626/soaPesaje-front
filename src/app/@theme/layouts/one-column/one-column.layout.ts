import { Component } from '@angular/core';
import { GuardPesajeService } from '../../../_service/guard-pesaje.service';

@Component({
  selector: 'ngx-one-column-layout',
  styleUrls: ['./one-column.layout.scss'],
  template: `
    <nb-layout windowMode>
      <nb-layout-header fixed *ngIf="!isLoginDirecto()">
        <ngx-header></ngx-header>
        <ngx-toggle-settings-button></ngx-toggle-settings-button>
      </nb-layout-header>

      <nb-layout-header class="headerSettings" *ngIf="isLoginDirecto()">
        <ngx-toggle-settings-button></ngx-toggle-settings-button>
      </nb-layout-header>

      <nb-sidebar class="menu-sidebar" tag="menu-sidebar" responsive *ngIf="!isLoginDirecto()">
        <ng-content select="nb-menu"></ng-content>
      </nb-sidebar>

      <nb-layout-column>
        <ng-content select="router-outlet"></ng-content>
      </nb-layout-column>

      <!-- <nb-layout-footer fixed>
        <ngx-footer></ngx-footer>
      </nb-layout-footer> -->

      <nb-sidebar class="settings-sidebar"
                  tag="settings-sidebar"
                  state="collapsed"
                  fixed
                  [end]="isSettingsSidebarPositionEnd()">
        <ngx-theme-settings></ngx-theme-settings>
      </nb-sidebar>
    </nb-layout>
  `,
})
export class OneColumnLayoutComponent {

  sidebar: any = {};
  
  constructor(
    private guardPesajeService: GuardPesajeService
  ) {};

  isMenuSidebarPositionEnd(): boolean {
    return this.sidebar.id === 'end';
  }

  isSettingsSidebarPositionEnd(): boolean {
    return !this.isMenuSidebarPositionEnd();
  }

  isLoginDirecto(): boolean {
    return this.guardPesajeService.infoLoginDirecto;
  }
}
