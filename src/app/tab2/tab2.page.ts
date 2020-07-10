import { Component, Input, ChangeDetectorRef, ChangeDetectionStrategy} from '@angular/core';
import { BatteryStatus } from '@ionic-native/battery-status/ngx';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class Tab2Page {
  state = "Selecione o estado desejado";
  show(state){    
    this.state = state;
  }
  get(uf){
    console.log(uf);
  }
  
  battery = 100;
  plugged = false;
 
  subscription = this.batteryStatus.onChange().subscribe(status => {
    console.log(status.level, status.isPlugged);
    this.battery = status.level;
    this.plugged = status.isPlugged;
    this.changeDetector.markForCheck();
 });

  constructor(public batteryStatus: BatteryStatus, public changeDetector: ChangeDetectorRef) {} 
  
  ionViewOnDidLoad() {
    this.changeDetector.detectChanges();
  }

  ngOnInit() {    
    setInterval(() => {
      this.changeDetector.detectChanges();
    }, 60000);
  }
}