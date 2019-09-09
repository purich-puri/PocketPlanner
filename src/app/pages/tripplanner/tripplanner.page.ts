import { Component, OnInit, NgZone, AfterViewInit } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { LoadingController, ToastController } from '@ionic/angular';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { PlanService } from 'src/app/services/plan.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable } from 'rxjs';

declare var google;

@Component({
  selector: 'app-tripplanner',
  templateUrl: './tripplanner.page.html',
  styleUrls: ['./tripplanner.page.scss'],
})
export class TripplannerPage implements OnInit, AfterViewInit {

  planID = null;
  startInput: string;
  endInput: string;

  directionsService = new google.maps.DirectionsService;
  directionsDisplay = new google.maps.DirectionsRenderer;

  originPlaceId = null;
  destinationPlaceId = null;
  //originInput = document.getElementById('startInput');
  //destinationInput = document.getElementById('endInput');

  originAutocomplete = new google.maps.places.Autocomplete(this.startInput);
  destinationAutocomplete = new google.maps.places.Autocomplete(this.endInput);
  
  mapRef = null;

  constructor(
    private geoLocation: Geolocation,
    private loadCtrl: LoadingController,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private planService: PlanService,
    private afAuth: AngularFireAuth,
    private toastCtrl: ToastController
  ) { 

  }

  ngOnInit() {   
    this.loadMap();

    this.planID = this.route.snapshot.params['id'];
    if(this.planID){
      console.log(this.planID);
    };
  }

  ngAfterViewInit(){
    this.setupPlaceChangedListener(this.originAutocomplete, 'ORIG');
    this.setupPlaceChangedListener(this.destinationAutocomplete, 'DEST');
  }

  setupPlaceChangedListener(autocomplete, mode){
    var me = this;
  autocomplete.bindTo('bounds', this.loadMap);

  autocomplete.addListener('place_changed', () => {
    var place = autocomplete.getPlace();

    if (!place.place_id) {
      return;
    }
    if (mode == 'ORIG') {
      me.originPlaceId = place.place_id;
    } else {
      me.destinationPlaceId = place.place_id;
    }
  });
  }



  saveDestinationOnline(){
    console.log(this.startInput);
    console.log(this.endInput);

    this.planService.saveDestination(this.planID , this.startInput, this.endInput)
    .then(async res => {
      this.router.navigate(["/planner/" + this.planID]);
      let toast = await this.toastCtrl.create({
        duration: 1000,
        color: 'success',
        message: 'destination saved!'
      });
      toast.present();
    })
  }

  async calculateAndDisplayRoute(){
    if(this.startInput == null || this.endInput == null){
      let toast = await this.toastCtrl.create({
        duration: 2000,
        color: 'danger',
        message: 'Please fill all destination'
      });
      toast.present();
    }
    else{
      const that = this;
      this.directionsService.route(
        {
          origin: this.startInput,
          destination: this.endInput,
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
