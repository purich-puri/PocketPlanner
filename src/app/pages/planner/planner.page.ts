import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PlanService } from 'src/app/services/plan.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { AlertController, ToastController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-planner',
  templateUrl: './planner.page.html',
  styleUrls: ['./planner.page.scss'],
})
export class PlannerPage implements OnInit {

  title: Observable<any>;
  planID = null;
  destinations: Observable<any>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private planService: PlanService,
    private afAuth: AngularFireAuth,
    private db: AngularFirestore,
    private auth: AuthService,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController
  ) { }

  ngOnInit() {
    this.planID = this.route.snapshot.params['id'];
    if(this.planID){
      // console.log(this.planID);
    };

    this.afAuth.auth.onAuthStateChanged(user => {
      if(user){
        //console.log(user);
        this.destinations = this.planService.getDestinations(this.planID);
      }
      else{
        console.log("not logged in");
      }
    });

  }

  goToPage(){
    this.router.navigate(["/tripplanner/" + this.title]);
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
            this.planService.deletePlan(this.planID);
            this.router.navigate(["/tabs/tab2"]);

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

  sharePlan(){
    this.planService.shareYourPlan(this.planID);
  }

}
