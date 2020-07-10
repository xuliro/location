import { Component, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { Platform } from '@ionic/angular';
import { AppMinimize } from '@ionic-native/app-minimize/ngx';
import { BackgroundMode } from '@ionic-native/background-mode/ngx';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class Tab3Page {
  positionsArray : Array<{desc:string, lat:number , lon:number, data: Date, id: number}> = [];
  trajetoArray   : Array<{desc:string, lat:number , lon:number, data: Date, id: number}> = [];
  lat = 0;
  lon = 0;
  desc = "";
  data = new Date;
  minDistance = Number.MAX_SAFE_INTEGER;
  pos = undefined;
  INTERVAL = 3000;
  LASTID = 7;
  PRECISION = 0.05; //0.05 ~ 50m | 0.01 ~ 5m | 0.005 ~ 2m | 0.001 ~ 1m
  lastId = this.LASTID;
  
  refreshPosition = setInterval(() => {
    this.changeDetector.detectChanges();
  }, 1000);

  constructor(private geolocation: Geolocation, private changeDetector: ChangeDetectorRef, private platform: Platform,
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
    this.changeDetector.detectChanges();
    this.startInterval(this.INTERVAL);
    this.setFixedPositions();
  }

  setFixedPositions(){
    this.positionsArray.push({desc: 'PORTARIA',            lat : -19.9085995, lon : -43.9212425, data: new Date, id: 0});
    this.positionsArray.push({desc: 'IGREJA',              lat : -19.9094514, lon : -43.9211431, data: new Date, id: 1});
    this.positionsArray.push({desc: 'PRACINHA',            lat : -19.9105974, lon : -43.9213554, data: new Date, id: 2});
    this.positionsArray.push({desc: 'BARÃO X CAMPESTRE',   lat : -19.9104510, lon : -43.9223549, data: new Date, id: 3});
    this.positionsArray.push({desc: 'BARÃO X STA BARBARA', lat : -19.9091935, lon : -43.9220772, data: new Date, id: 4});
    this.positionsArray.push({desc: 'BARÃO X BICAS',       lat : -19.9085199, lon : -43.9218706, data: new Date, id: 5});
    this.positionsArray.push({desc: 'STA MARTA X BICAS',   lat : -19.9083427, lon : -43.9211549, data: new Date, id: 6});
  }

  startInterval(time){
    this.refreshPosition = setInterval(() => {
      this.getPosition();
      this.changeDetector.detectChanges();
    }, time);
  }

  send(){
    this.positionsArray.push({desc: this.desc, lat : this.lat , lon : this.lon, data: new Date, id: this.lastId});
    this.lastId++;
    this.desc = "";
  }

  clear(){
    this.positionsArray = [];
    this.setFixedPositions();
    this.lastId = this.LASTID;
  }

  clearT(){
    this.trajetoArray = [];
  }
  
  getPosition() {
    this.geolocation.getCurrentPosition().then((resp) => {
      this.lat = resp.coords.latitude  == null ? 0 : resp.coords.latitude;
      this.lon = resp.coords.longitude == null ? 0 : resp.coords.longitude;
      this.data = new Date;
      this.pos = undefined;
      this.minDistance = Number.MAX_SAFE_INTEGER;
      for (let i=0; i< this.positionsArray.length; i++){
        let distance = this.getDistance(this.lat, this.lon, this.positionsArray[i].lat, this.positionsArray[i].lon);
        if (distance < this.PRECISION && distance < this.minDistance){
          this.pos = this.positionsArray[i];
          this.minDistance = distance;
        }
      }
      if (this.pos != undefined){
        if (this.trajetoArray.length == 0 || this.trajetoArray[this.trajetoArray.length-1].id !== this.pos.id){
          this.trajetoArray.push(this.pos);
          this.trajetoArray[this.trajetoArray.length-1].data = this.data;
        }
      }
      this.changeDetector.detectChanges();
     }).catch((error) => {
       console.log('Error getting location', error);
     });
  }

  degToRad(n)
  {
    return n * Math.PI / 180;
  }

  getDistance(lat1, lon1, lat2, lon2)
  {
    let R = 6371;
    let x = this.degToRad(lon2 - lon1) * Math.cos(this.degToRad(lat1 + lat2) / 2);
    let y = this.degToRad(lat2 - lat1);
    let d = Math.sqrt(x * x + y * y) * R;
    return d;
  }
}
