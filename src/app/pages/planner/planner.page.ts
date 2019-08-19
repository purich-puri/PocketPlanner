import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PlanService } from 'src/app/services/plan.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { AlertController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-planner',
  templateUrl: './planner.page.html',
  styleUrls: ['./planner.page.scss'],
})
export class PlannerPage implements OnInit {

  title: any;
  planID = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private planService: PlanService,
    private afAuth: AngularFireAuth,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController
  ) { }

  ngOnInit() {
    this.planID = this.route.snapshot.params['id'];
    if(this.planID){
      // console.log(this.planID);
      this.title = this.planID;
    }

  }

  goToPage(){
    this.router.navigate(["/tripplanner"]);
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
          handler: async () => {
            this.planService.deletePlan(this.planID);
            this.router.navigate(["/tabs/tab2"]);

            let toast = await this.toastCtrl.create({
              duration: 2000,
              color: 'danger',
              message: this.planID + ' Deleted'
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
