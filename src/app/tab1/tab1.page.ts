import { Component, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { AlertController, Platform } from '@ionic/angular';
import { AppMinimize } from '@ionic-native/app-minimize/ngx';
import { BackgroundMode } from '@ionic-native/background-mode/ngx';
import { AppModule } from '../app.module';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { BatteryStatus } from '@ionic-native/battery-status/ngx';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class Tab1Page {
  lat = 0;
  lon = 0;
  vel = 0;
  alt = 0;
  hea = 0;
  battery = 100;
  plugged = true;
  data = new Date;
  isCheckIn = false;
  placa = "";
  errorMessage = false;

  CONSTSRV = AppModule.getUrl();
  srv = this.CONSTSRV;

  refreshPosition = setInterval(() => { 
    this.changeDetector.detectChanges();
  }, 1000);

  refreshBattery = this.batteryStatus.onChange().subscribe(status => {
    this.battery = status.level;
    this.plugged = status.isPlugged;
    this.changeDetector.markForCheck();
 });

  constructor(private geolocation: Geolocation, private batteryStatus: BatteryStatus, private changeDetector: ChangeDetectorRef, 
              private platform: Platform, private httpClient: HttpClient,
              private appMinimize: AppMinimize, private backgroundMode: BackgroundMode) {
    this.platform.backButton.subscribe(()=>{
      this.backgroundMode.enable();
      this.appMinimize.minimize(); //minimiza a aplicação
    })
  }
 
  ionViewOnDidLoad() {
    this.changeDetector.detectChanges();
  }

  ngOnInit() {    
    clearInterval(this.refreshPosition);
  }

  startInterval(time){    
    this.refreshPosition = setInterval(() => {               
      this.getPosition();      
      this.sendLocation();
      this.changeDetector.detectChanges();
    }, time);
  }

  checkIn(){
    var url = "https://" + this.srv + ":5001/api/Veiculos/buscar?placa=" + this.placa;
    this.httpClient.get(url).subscribe(data => this.validaPLaca(data)) 
  }

  checkOut(){
    this.isCheckIn = false;
    this.placa = "";
    clearInterval(this.refreshPosition);
  }

  validaPLaca(veiculo){
    if (veiculo != null){      
      this.isCheckIn = true;
      this.errorMessage = false;
      this.getPosition();
      this.changeDetector.detectChanges();
      this.startInterval(120000);
    }
    else{
      this.errorMessage = true;
      this.changeDetector.detectChanges();
      clearInterval(this.refreshPosition);
    }    
  }
  
  getPosition() {
    this.geolocation.getCurrentPosition().then((resp) => {
      this.lat = resp.coords.latitude  == null ? 0 : resp.coords.latitude;
      this.lon = resp.coords.longitude == null ? 0 : resp.coords.longitude;
      this.alt = resp.coords.altitude  == null ? 0 : resp.coords.altitude;
      this.vel = resp.coords.speed     == null ? 0 : resp.coords.speed;
      this.hea = resp.coords.heading   == null ? 0 : resp.coords.heading;
      this.data = new Date;

      this.changeDetector.detectChanges();
     }).catch((error) => {
       console.log('Error getting location', error);
     });
  }

  sendLocation(){
    var url = "https://" + this.srv + ":5001/api/Posicao";    
   
    let postData = {
          "Placa": this.placa,
          "Latitude": this.lat.toString(),
          "Longitude": this.lon.toString(),
          "Velocidade": this.vel.toString(), 
          "Altura": this.alt.toString(),
          "Direcao": this.hea.toString(),
          "Bateria": this.battery,
          "Carregando": this.plugged,
          "Data": new Date
    }

    this.httpClient.post(url, postData, {
      headers : new HttpHeaders({
        'Content-Type': 'application/json'          
      })
    })
      .subscribe(data => {
          console.log(JSON.stringify(postData));
      },error => {
        console.log(error);
      });      
  }
  
  sair() {    
      navigator['app'].exitApp();
  }
}
