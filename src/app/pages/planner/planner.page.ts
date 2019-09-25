import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PlanService } from 'src/app/services/plan.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { AlertController, ToastController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';
import { tap } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-planner',
  templateUrl: './planner.page.html',
  styleUrls: ['./planner.page.scss'],
})
export class PlannerPage implements OnInit {

  title: Observable<any>;
  planID = null;
  plan = null;
  isShown: boolean;
  destinations: Observable<any>;
  currentUser = null;
  planOwner: any;
  planOwnerID = null;
  headerName = "My Destination";

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private planService: PlanService,
    private authService: AuthService,
    private afAuth: AngularFireAuth,
    private db: AngularFirestore,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController
  ) { }

  ngOnInit() {
    this.planID = this.route.snapshot.params['id'];
    if(this.planID == 0 || this.planID == null){
      return;
    }
    else{
      //console.log(this.planID);
      this.destinations = this.planService.getDestinations(this.planID);
      this.db.doc(`allPlans/${this.planID}`).valueChanges().pipe(
        tap(res => {
          this.isShown = res['isShown'];
          this.headerName = res['title'];
          this.planOwner = res['owner'];
          this.planOwnerID = this.planOwner.id;
          //console.log("planOwnerID: " + this.planOwnerID);
          //console.log("currentUser: " + this.currentUser);
        })
      ).subscribe();
    }

    
    this.currentUser = this.authService.currentUserId;
    
    this.route.params.subscribe(data => {
      this.planService.getOneGroup(data.id).subscribe(res => {
        this.plan = res;
        //console.log(this.plan);
      })
    });

    this.afAuth.auth.onAuthStateChanged(user => {
      if(user){
        //console.log(user);
      }
      else{
        console.log("not logged in");
      }
    });

  }

  goToPage(){
    this.router.navigate(["/tripplanner/" + this.planID]);
  }

  goToPlannerEdit(destID){
    this.router.navigate(["/planneredit/", {id: this.planID, id2: destID}]);
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
            this.planService.deletePlan(this.plan.id).subscribe( res => {
              this.router.navigate(["/tabs/tab2"]);
            });
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

  sharePlan(bool){
    this.planService.shareYourPlan(this.planID, bool);
    this.router.navigate(["/tabs/tab2"]);
  }

}
