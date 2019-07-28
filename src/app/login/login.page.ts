import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  loginForm: FormGroup;

  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private router: Router,
    private alertctrl: AlertController,
    private toastctrl: ToastController

  ) { }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email:[ '', [Validators.required, Validators.email] ],
      password:[ '', [Validators.required, Validators.minLength(6)] ]
    });
  }

  login(){
    this.authService.login(this.loginForm.value)
    .then( (response) => {
      //succesful
      this.router.navigate(['']);
    },
    async (err) => {
      let alert = await this.alertctrl.create({
        header: 'Error',
        message: err.message,
        buttons: ['OK']
      });
      alert.present();
    })
  }

}