import { Component, OnInit } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { LoadingController } from '@ionic/angular';

declare var google;

@Component({
  selector: 'app-tripplanner',
  templateUrl: './tripplanner.page.html',
  styleUrls: ['./tripplanner.page.scss'],
})
export class TripplannerPage implements OnInit {

  mapRef = null;

  constructor(
    private geoLocation: Geolocation,
    private loadCtrl: LoadingController
  ) { }

  ngOnInit() {
    this.loadMap();
  }


  async loadMap(){
    const loadingBar = await this.loadCtrl.create();
    loadingBar.present();
    
    const myLatLng = await this.getLocation();
    console.log(myLatLng);
    const mapElement: HTMLElement = document.getElementById('map');
    this.mapRef = new google.maps.Map( mapElement, { 
      center: myLatLng,
      zoom: 15,
      streetViewControl: false,
      mapTypeControl: false,
      fullscreenControl: false
    } );
    google.maps.event
    .addListenerOnce( this.mapRef, 'idle', () => {
      console.log("do something once map is loaded");
      loadingBar.dismiss();
    } );
  }

  async getLocation(){
    const myPosition = await this.geoLocation.getCurrentPosition();
    return {
      lat: myPosition.coords.latitude,
      lng: myPosition.coords.longitude
    }
  }

}
