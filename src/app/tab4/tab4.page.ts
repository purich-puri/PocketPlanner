import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { ToastController, AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { async } from '@angular/core/testing';

@Component({
  selector: 'app-tab4',
  templateUrl: './tab4.page.html',
  styleUrls: ['./tab4.page.scss'],
})
export class Tab4Page implements OnInit {

  constructor(
    private authService: AuthService,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController,
    private router: Router
  ) { }

  ngOnInit() {
  }

  logOut(){
    this.authService.logOut()
    .then(async (res) => {
      console.log("logged out");
      let toast = await this.toastCtrl.create({
        duration: 2000,
        color: 'primary',
        message: 'Good Bye!'
      });
      toast.present();
      this.router.navigate(['']);
    })
    .catch();
  }

}
