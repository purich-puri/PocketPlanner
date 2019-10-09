import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { ActivatedRoute, Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';
import { PlanService } from 'src/app/services/plan.service';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-tab2description',
  templateUrl: './tab2description.page.html',
  styleUrls: ['./tab2description.page.scss'],
})
export class Tab2descriptionPage implements OnInit {
  descriptionText = "";
  headerName = "";
  planOwner: any;
  planOwnerID = null;
  currentUser = null;
  planID = null;

  constructor(
    private authService: AuthService,
    private planService: PlanService,
    private afAuth: AngularFireAuth,
    private db: AngularFirestore,
    private route: ActivatedRoute,
    private toastCtrl: ToastController,
    private router: Router
  ) { }

  ngOnInit() {
    this.planID = this.route.snapshot.params['id'];

    if(this.planID == 0 || this.planID == null){
      this.descriptionText == "Unable to retrieve data";
    }
    else{
      //console.log(this.planID);
      this.db.doc(`allPlans/${this.planID}`).valueChanges().pipe(
        tap(res => {
          this.descriptionText = res['description'];
          this.headerName = res['title'];
          this.planOwner = res['owner'];
          this.planOwnerID = this.planOwner.id;
          //console.log(this.planOwnerID);
          if(this.descriptionText == ""){
            this.descriptionText = "There is no description written on this plan."
          }
          else{
            this.descriptionText = res['description'];
          }
        })
      ).subscribe();
    }

    this.afAuth.auth.onAuthStateChanged(user => {
      if(user){
        this.currentUser = this.authService.currentUserId;
        //console.log(this.currentUser);
      }
      else{
      }
    });
      
  }

  editDescription(title, description){
    this.planService.editDescriptionInfo(this.planID, title, description)
    .then(async (res) => {
      let toast = await this.toastCtrl.create({
        duration: 2000,
        color: 'natureGreen',
        message: 'Description has been edited!'
      });
      toast.present();
    })
    .catch();
  
  }

}
