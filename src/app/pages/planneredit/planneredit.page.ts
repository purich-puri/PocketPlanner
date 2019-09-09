import { Component, OnInit } from '@angular/core';
import { AlertController, ToastController, LoadingController } from '@ionic/angular';
import { PlanService } from 'src/app/services/plan.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';
import { AuthService } from 'src/app/services/auth.service';

declare var google;

@Component({
  selector: 'app-planneredit',
  templateUrl: './planneredit.page.html',
  styleUrls: ['./planneredit.page.scss'],
})
export class PlannereditPage implements OnInit {

  planID = null;
  destID = null;
  destinations = '';

  startInput: string;
  endInput: string;
  mapRef= null;

  directionsService = new google.maps.DirectionsService;
  directionsDisplay = new google.maps.DirectionsRenderer;

  constructor(
    private geoLocation: Geolocation,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private loadCtrl: LoadingController,
    private planService: PlanService,
    private afAuth: AngularFireAuth,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.planID = this.route.snapshot.params['id'];
    this.destID = this.route.snapshot.params['id2'];
    if(this.destID && this.planID){
      console.log(this.planID);
      console.log(this.destID);
    }
    else{
      this.router.navigate(["/tripplanner"]);
    }

    this.afAuth.auth.onAuthStateChanged(user => {
      if(user){
        //console.log(user);
        this.startInput = this.destinations;
      }
      else{
        console.log("not logged in");
      }
    });

    this.loadMap();
    

  }

  async delete(){
    let alert = await this.alertCtrl.create({
      header: 'Delete',
      message: 'Are you sure you want to delete this trip plan?',
      backdropDismiss: false,
      buttons:[
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log("Cancelled delete");
          }
        },
        {
          text: 'DELETE',
          cssClass: 'alertDanger',
          handler: async () => {
            this.planService.deleteDestination(this.planID, this.destID);
            this.router.navigate(["/planner/" + this.planID]);

            let toast = await this.toastCtrl.create({
              duration: 2000,
              color: 'danger',
              message: 'Deleted'
            });
            toast.present();
          }
        }
      ]
    });
    await alert.present(); 
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
