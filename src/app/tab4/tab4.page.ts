import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { ToastController, AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { async } from '@angular/core/testing';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-tab4',
  templateUrl: './tab4.page.html',
  styleUrls: ['./tab4.page.scss'],
})
export class Tab4Page implements OnInit {

  currentUser = null;
  nickname = null;
  email = null;

  constructor(
    private authService: AuthService,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController,
    private router: Router,
    private db: AngularFirestore,
    private afAuth: AngularFireAuth
  ) { }

  ngOnInit() {
    this.afAuth.auth.onAuthStateChanged(user => {
      if(user){
        this.currentUser = this.authService.currentUserId;
        //console.log(this.currentUser);
        this.db.doc(`users/${this.currentUser}`).valueChanges().pipe(
          tap(res => {
            this.nickname = res['nickname']
            this.email = res['email']
          })
        ).subscribe();
      }
      else{
      }
    });
  }

  ionViewWillEnter(){
    this.ngOnInit();
  }

  async updateNickname(){
    let alert = await this.alertCtrl.create({
      header: 'INSERT NEW NICKNAME',
      inputs: [{
        name: 'newNickname',
        type: 'text',
        placeholder: 'new nickname'
      }],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            //console.log('Confirm Cancel');
          }
        },
        {
          text: 'Ok',
          handler: (alertData) => { //takes the data 
            //console.log(alertData.newNickname);
            this.authService.updateUser(alertData.newNickname)
            .then(async (res) => {
              let toast = await this.toastCtrl.create({
                duration: 2000,
                color: 'natureGreen',
                message: 'nicname has been edited!'
              });
              toast.present();
            }).catch();
          }
        }


      ]
    });
    alert.present();
  }

  logOut(){
    this.authService.logOut()
    .then(async (res) => {
      console.log("logged out");
      let toast = await this.toastCtrl.create({
        duration: 2000,
        color: 'natureGreen',
        message: 'Good Bye!'
      });
      toast.present();
      this.router.navigate(['/login']);
    })
    .catch();
  }

  regist(){
    this.router.navigate(['/register']);
  }

}
