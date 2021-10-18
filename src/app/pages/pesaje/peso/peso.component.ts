import { Component, OnDestroy, OnInit } from '@angular/core';
import { NbThemeService } from '@nebular/theme';
import { forkJoin, Subscription } from 'rxjs';
import { takeWhile } from 'rxjs/operators';
import { Temperature, TemperatureHumidityData } from '../../../@core/data/temperature-humidity';
import { AuxPesaje } from '../../../_model/auxPesaje';
import { PesajeService } from './../../../_service/pesaje.service';


@Component({
  selector: 'ngx-peso',
  styleUrls: ['./peso.component.scss'],
  templateUrl: './peso.component.html',
})
export class PesoComponent implements OnDestroy, OnInit {

  private alive = true;
  disabled = true;
  pesoManual: number;
  localAuxPesaje: AuxPesaje;

  humidityData: Temperature;
  temperatureData: Temperature;
  temperature: number;
  temperatureOff = true;
  temperatureMode = 'cool';

  colors: any;
  themeSubscription: any;

  theme: any;
  private subscription: Subscription;

  constructor(private themeService: NbThemeService,
    private temperatureHumidityService: TemperatureHumidityData, private pesajeService: PesajeService) {
      this.themeService.getJsTheme()
      .pipe(takeWhile(() => this.alive))
      .subscribe(config => {
      this.theme = config.variables.temperature;
    });

    forkJoin(
      this.temperatureHumidityService.getTemperatureData(),
      this.temperatureHumidityService.getHumidityData(),
    )
      .subscribe(([temperatureData, humidityData]: [Temperature, Temperature]) => {
        this.temperatureData = temperatureData;
        this.temperature = this.temperatureData.value;
      });

    this.localAuxPesaje = new AuxPesaje();
  }

  ngOnInit() {
    this.subscription = this.pesajeService.getAuxPesaje().subscribe(auxPesaje => {
      this.localAuxPesaje = auxPesaje;
    });
  }

  ngOnDestroy() {
    this.alive = false;
    this.subscription.unsubscribe();
  }

  encender(flag: boolean) {
    this.temperatureOff = flag;
    if (!flag) {
      this.pesajeService.connect();
      this.subscription = this.pesajeService.subjectObservable$.subscribe(auxPesaje => {
        this.temperature = auxPesaje.pesoBalanza;
      });
    } else {
      this.pesajeService.disconnect();
    }
  }

  tabActivo(event: any) {
    this.localAuxPesaje.tabActivo = event.tabTitle;
    this.pesajeService.sendAuxPesaje(this.localAuxPesaje);
  }

  enviaPesoManual(event: any) {
    this.localAuxPesaje.pesoManual = event;
    this.pesajeService.sendAuxPesaje(this.localAuxPesaje);
  }

  verificaBalanza() {
    if (sessionStorage.getItem('balanza')) {
      return true;
    } else {
      return false;
    }
  }

}
