import { Component, OnInit, NgZone } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { LoadingController, ToastController } from '@ionic/angular';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { PlanService } from 'src/app/services/plan.service';
import { AngularFireAuth } from '@angular/fire/auth';


declare var google;

@Component({
  selector: 'app-tripplanner',
  templateUrl: './tripplanner.page.html',
  styleUrls: ['./tripplanner.page.scss'],
})
export class TripplannerPage implements OnInit {

  planID = null;
  startInput: string;
  endInput: string;

  directionsService = new google.maps.DirectionsService;
  directionsDisplay = new google.maps.DirectionsRenderer;
  googleAutocomplete = new google.maps.places.AutocompleteService();

  destinationPlaceId = null;

  originAutocomplete = new google.maps.places.Autocomplete(this.startInput);
  // destinationAutocomplete = new google.maps.places.Autocomplete(this.endInput);

  autocompleteItems: any[];
  autocompleteItems2: any[];
  location: any;
    
  mapRef = null;
  newmap = null;

  transitOption = 'TRANSIT';

  constructor(
    private geoLocation: Geolocation,
    private loadCtrl: LoadingController,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private planService: PlanService,
    private afAuth: AngularFireAuth,
    private toastCtrl: ToastController,
    private zone: NgZone
  ) { 
    this.autocompleteItems = [];
    this.autocompleteItems2 = [];
  }

  ngOnInit() {   
    this.loadMap();

    this.planID = this.route.snapshot.params['id'];
    if(this.planID){
      //console.log(this.planID);
    };
  }

  ionViewWillEnter(){
    this.loadMap();
  }

  startListen(){
    //this.setupPlaceChangedListener(this.originAutocomplete);
    if (this.startInput == '' || this.startInput == null || this.startInput.trim() == '') {
      this.autocompleteItems = [];
      return;
    }
    this.googleAutocomplete.getPlacePredictions({ input: this.startInput },
    (predictions, status) => {
      this.autocompleteItems = [];
      this.zone.run(() => {
        predictions.forEach((prediction) => {
          this.autocompleteItems.push(prediction);
        });
      });
    });
    
  }

  startListen2(){
    //this.setupPlaceChangedListener(this.originAutocomplete);
    if (this.endInput == '' || this.endInput == null || this.endInput.trim() == '') {
      this.autocompleteItems2 = [];
      return;
    }
    this.googleAutocomplete.getPlacePredictions({ input: this.endInput },
    (predictions, status) => {
      this.autocompleteItems2 = [];
      this.zone.run(() => {
        predictions.forEach((prediction) => {
          this.autocompleteItems2.push(prediction);
        });
      });
    });
  }

  selectSearchResult(item) {
    //console.log(item)
    this.location = item
    this.startInput = this.location.description;
    this.autocompleteItems = [];
    this.calculateAndDisplayRoute();
  }

  selectSearchResult2(item) {
    //console.log(item)
    this.location = item
    this.endInput = this.location.description;
    this.autocompleteItems2 = [];
    this.calculateAndDisplayRoute();
  }

//DOES NOT WORK
  // setupPlaceChangedListener(autocomplete){
  //   autocomplete.setFields(['place_id']);
  //   autocomplete.bindTo('bounds', this.newmap);

  //   google.maps.event.addListener(autocomplete, 'place_changed',() =>{
  //     var place = autocomplete.getPlace();
  //     console.log(place);
  // });     
  // }

  saveDestinationOnline(){
    // console.log(this.startInput);
    // console.log(this.endInput);
    if(this.startInput == null || this.startInput == '' || this.startInput.trim() == ''|| 
       this.endInput == null || this.endInput == '' || this.endInput.trim() == ''){
      let toast = this.toastCtrl.create({
        duration: 2000,
        color: 'danger',
        message: 'please fill in all field!'
      });
      toast.then(toast =>  toast.present());
      return
    }

    const that = this;
    this.directionsService.route(
      {
        origin: this.startInput,
        destination: this.endInput,
        travelMode: this.transitOption
      }, (response, status) => {
        if(status === 'OK'){
        // that.directionsDisplay.setDirections(response);
        // console.log(response);
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
        else{
          //console.log("failed due to: " + status);
          this.transitOption = 'DRIVING';
          this.saveDestinationOnline();
          
        }
      }
    )
  }

  async calculateAndDisplayRoute(){
    if(this.startInput == null || this.endInput == null){
      return
    }
    else{
      const that = this;
      this.directionsService.route(
        {
          origin: this.startInput,
          destination: this.endInput,
          travelMode: this.transitOption
        }, (response, status) => {
          if(status === 'OK'){
          that.directionsDisplay.setDirections(response);
          //console.log(response);
          }
          else{
            //console.log("failed due to: " + status);
            this.transitOption = 'DRIVING'
            this.calculateAndDisplayRoute();
            this.transitOption = 'TRANSIT'
          }
        }
      )
    }
  }

  async loadMap(){
    const loadingBar = await this.loadCtrl.create();
    loadingBar.present();
    const newmyLatLng = await this.getLocation();
    this.newmap = new google.maps.Map(document.getElementById('map'), {
      center: newmyLatLng,
      zoom: 15,
      streetViewControl: false,
      mapTypeControl: false,
      fullscreenControl: false
    });
    google.maps.event.addListenerOnce( this.newmap, 'idle', () => {
      //console.log("do something once map is loaded");
      loadingBar.dismiss();
    });
    this.directionsDisplay.setMap(this.newmap);
    this.directionsDisplay.setPanel(document.getElementById('bottomPanel'));
  }

//REDUNDANT
  // async loadMap(){
  //   const loadingBar = await this.loadCtrl.create();
  //   loadingBar.present();
    
  //   const myLatLng = await this.getLocation();
  //   //console.log(myLatLng);
  //   const mapElement: HTMLElement = document.getElementById('map');
  //   this.mapRef = new google.maps.Map( mapElement, { 
  //     center: myLatLng,
  //     zoom: 15,
  //     streetViewControl: false,
  //     mapTypeControl: false,
  //     fullscreenControl: false
  //   } );
  //   google.maps.event.addListenerOnce( this.mapRef, 'idle', () => {
  //     //console.log("do something once map is loaded");
  //     loadingBar.dismiss();
  //   } );
  //   this.directionsDisplay.setMap(this.mapRef);
  //   this.directionsDisplay.setPanel(document.getElementById('bottomPanel'));
  // }

  async getLocation(){
    const myPosition = await this.geoLocation.getCurrentPosition();
    return {
      lat: myPosition.coords.latitude,
      lng: myPosition.coords.longitude
    }
  }

}
