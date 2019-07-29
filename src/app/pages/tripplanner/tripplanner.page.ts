import { Component, OnInit } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';


@Component({
  selector: 'app-tripplanner',
  templateUrl: './tripplanner.page.html',
  styleUrls: ['./tripplanner.page.scss'],
})
export class TripplannerPage implements OnInit {

  constructor(
    private geoLocation: Geolocation
  ) { }

  ngOnInit() {
    this.loadMap();
  }


  async loadMap(){
    const myPosition = await this.geoLocation.getCurrentPosition();
    const myLatLng = {
      lat: myPosition.coords.latitude,
      lng: myPosition.coords.longitude
    }
    console.log(myLatLng);
  }

}
