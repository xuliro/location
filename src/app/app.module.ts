import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { BatteryStatus } from '@ionic-native/battery-status/ngx';
import { FormsModule } from '@angular/forms';
import { AppMinimize } from '@ionic-native/app-minimize/ngx';
import { BackgroundMode } from '@ionic-native/background-mode/ngx';
import { HttpClientModule } from '@angular/common/http';
import { HTTP } from '@ionic-native/http/ngx';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule, HttpClientModule, IonicModule.forRoot(), AppRoutingModule, FormsModule],
  providers: [
    StatusBar,
    AppMinimize,
    BackgroundMode,
    Geolocation,
    HTTP,
    BatteryStatus,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  private static url: string = "187.20.183.162";
  //private static url: string = "192.168.0.16";
  static getUrl(){
    return this.url;
  }
}
