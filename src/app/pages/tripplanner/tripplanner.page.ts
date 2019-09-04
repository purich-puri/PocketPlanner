import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { LoadingController } from '@ionic/angular';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';

declare var google;

@Component({
  selector: 'app-tripplanner',
  templateUrl: './tripplanner.page.html',
  styleUrls: ['./tripplanner.page.scss'],
})
export class TripplannerPage implements OnInit {

  directionsService = new google.maps.DirectionsService;
  directionsDisplay = new google.maps.DirectionsRenderer;
  directionForm: FormGroup;

  originPlaceId = null;
  destinationPlaceId = null;
  originInput = document.getElementById('startInput');
  destinationInput = document.getElementById('endInput');

  originAutocomplete = new google.maps.places.Autocomplete(this.originInput);
  destinationAutocomplete = new google.maps.places.Autocomplete(this.destinationInput);
  
  mapRef = null;

  constructor(
    private geoLocation: Geolocation,
    private loadCtrl: LoadingController,
    private formBuilder: FormBuilder
  ) { 
    this.createDirectionForm;
  }

  ngOnInit() {   
    this.loadMap();
    this.createDirectionForm();
  }

  createDirectionForm(){
    this.directionForm = this.formBuilder.group({
      startRoute: ['',Validators.required],
      endRoute: ['',Validators.required]
    });
  }

  calculateAndDisplayRoute(formValues){
    const that = this;
    this.directionsService.route(
     {
       origin: formValues.startRoute,
       destination: formValues.endRoute,
       travelMode: 'TRANSIT'
     }, (response, status) => {
       if(status === 'OK'){
        that.directionsDisplay.setDirections(response);
        console.log(response);
       }
       else{
         console.log("failed due to: " + status);
       }
     }
    )
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
    this.directionsDisplay.setMap(this.mapRef);
    this.directionsDisplay.setPanel(document.getElementById('bottomPanel'));
  }

  async getLocation(){
    const myPosition = await this.geoLocation.getCurrentPosition();
    return {
      lat: myPosition.coords.latitude,
      lng: myPosition.coords.longitude
    }
  }

}
