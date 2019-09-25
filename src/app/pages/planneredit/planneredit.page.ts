import { Component, OnInit } from '@angular/core';
import { AlertController, ToastController, LoadingController } from '@ionic/angular';
import { PlanService } from 'src/app/services/plan.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';
import { AuthService } from 'src/app/services/auth.service';
import { tap } from 'rxjs/operators';

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

  currentUser = null;
  planOwner: any;
  planOwnerID = null;

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
    private authService: AuthService,
    private afAuth: AngularFireAuth,
    private router: Router,
    private route: ActivatedRoute,
    private db: AngularFirestore
  ) { }

  ngOnInit() {
    this.planID = this.route.snapshot.params['id'];
    this.destID = this.route.snapshot.params['id2'];

    this.afAuth.auth.onAuthStateChanged(user => {
      if(user){
        //console.log(user);
      }
      else{
        console.log("not logged in");
        this.db.doc(`allPlans/${this.planID}/destinations/${this.destID}`).valueChanges().pipe(
          tap(res => {
            this.startInput = res['startpoint'];
            this.endInput = res['endpoint'];
            this.calculateDistance();
          })
        ).subscribe();
        
      }
    });

    this.loadMap();
    this.currentUser = this.authService.currentUserId;
    this.getPlanner();

    
    
  }

  getPlanner(){
    if(this.planID == 0 || this.planID == null){
      return;
    }
    else{
      //console.log(this.planID);
      this.db.doc(`allPlans/${this.planID}/destinations/${this.destID}`).valueChanges().pipe(
        tap(res => {
          this.startInput = res['startpoint'];
          this.endInput = res['endpoint'];
        })
      ).subscribe();

      this.db.doc(`allPlans/${this.planID}`).valueChanges().pipe(
        tap(res => {
          this.planOwner = res['owner'];
          this.planOwnerID = this.planOwner.id;
        })
      ).subscribe();
      
    }
  }

  saveEdit(){
    this.planService.editDestination(this.planID, this.destID, this.startInput, this.endInput)
    .then(async (res) => {
      let toast = await this.toastCtrl.create({
        duration: 2000,
        color: 'primary',
        message: 'Edited destination has been saved!'
      });
      toast.present();
    })
    .catch();
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

  async calculateDistance(){
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
          //console.log(response);
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
    //console.log(myLatLng);
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
      //console.log("do something once map is loaded");
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
