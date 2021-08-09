/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { NbMenuService } from '@nebular/theme';
import { Subscription } from 'rxjs';
import { AnalyticsService } from './@core/utils/analytics.service';
import { SeoService } from './@core/utils/seo.service';
import { LoginService } from './_service/login.service';

@Component({
  selector: 'ngx-app',
  template: '<router-outlet></router-outlet>',
})
export class AppComponent implements OnInit, OnDestroy {

  private subscription: Subscription;

  constructor(
    private analytics: AnalyticsService, 
    private seoService: SeoService,
    private menuService: NbMenuService,
    private loginService: LoginService
  ) {
  }

  ngOnInit(): void {
    this.analytics.trackPageViews();
    this.seoService.trackCanonicalChanges();
    this.subscription = this.menuService.onItemClick()
      .subscribe((event) => {
        this.onContecxtItemSelection(event.item.title);
      });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  onContecxtItemSelection(title) {
    if (title === 'Cerrar sesión') {
      this.loginService.cerrarSesion();
    }
  }
}
