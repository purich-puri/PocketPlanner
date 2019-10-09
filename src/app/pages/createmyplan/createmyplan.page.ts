import { Component, OnInit } from '@angular/core';
import { PlanService } from 'src/app/services/plan.service';
import { Router } from '@angular/router';
import { PickerController, ToastController } from '@ionic/angular';
import { PickerOptions } from '@ionic/core';
import { empty } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-createmyplan',
  templateUrl: './createmyplan.page.html',
  styleUrls: ['./createmyplan.page.scss'],
})
export class CreatemyplanPage implements OnInit {

  title = '';
  description = '';
  // countryName = 'pick a country';

  constructor(
    private planService: PlanService,
    private router: Router,
    private pickerCtrl: PickerController,
    private afAuth: AngularFireAuth,
    private authService: AuthService,
    private toastCtrl: ToastController
  ) { }

  ngOnInit() {
  
  }

  createPlan(){
    if(this.title != ''){
      this.afAuth.auth.onAuthStateChanged(user => {
        if(user){
          console.log(user);
          this.planService.createPlan(this.title, this.description)
          .then( res => {
            this.router.navigate(['/tabs/tab2']);
          })
        }
        else{
          this.authService.createAnonID()
          .then( res => {
            this.planService.createPlan(this.title, this.description)
            .then( res => {
              this.router.navigate(['/tabs/tab2']);
            })
          })
        }
      });
    }
    else{
      //console.log("title empty");
      let toast = this.toastCtrl.create({
        duration: 2000,
        color: 'danger',
        message: 'Title cannot be empty!'
      });
      toast.then(toast =>  toast.present());
    }
  }

  // async showPicker(){
  //   let pickOpt: PickerOptions = {
  //     backdropDismiss: false,
  //     buttons: [
  //       {
  //         text: 'Cancel',
  //         role: 'cancel',
  //       },
  //       {
  //         text: 'Done'
  //       }
  //     ],
  //     columns: [
  //       {
  //         name: 'countryName',
  //         options: [
  //           { text: 'countryName1', value: '1' },
  //           { text: 'countryName2', value: '2' },
  //         ]
  //       }
  //     ]
  //   };
  //   let picker = await this.pickerCtrl.create(pickOpt);
  //   picker.present();
  //   picker.onDidDismiss().then( async data => {
  //     let col = await picker.getColumn('countryName');
  //     this.countryName = col.options[col.selectedIndex].text
  //   });

  // }

}
