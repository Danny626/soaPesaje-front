import { Component } from '@angular/core';

import { StateService } from '../../../@core/utils';

@Component({
  selector: 'ngx-theme-settings',
  styleUrls: ['./theme-settings.component.scss'],
  template: `
    <span class="subheader">Parámetros</span>
    <div class="settings-row">
      <ngx-parametros></ngx-parametros>
    </div>
  `,
})
export class ThemeSettingsComponent {

  layouts = [];

  constructor(protected stateService: StateService) {
    this.stateService.getLayoutStates()
      .subscribe((layouts: any[]) => this.layouts = layouts);
  }

  layoutSelect(layout: any): boolean {
    this.layouts = this.layouts.map((l: any) => {
      l.selected = false;
      return l;
    });

    layout.selected = true;
    this.stateService.setLayoutState(layout);
    return false;
  }
}
