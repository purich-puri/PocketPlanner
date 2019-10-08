import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  registerForm: FormGroup;

  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private router: Router,
    private alertctrl: AlertController,
    private toastctrl: ToastController
  ) { }

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      email:[ '', [Validators.required, Validators.email] ],
      password:[ '', [Validators.required, Validators.minLength(6)] ],
      passwordCheck:[ '', [Validators.required, Validators.minLength(6)] ],
      nickname:[ '', [Validators.required] ] 
    });
  }

  register() {
    this.authService.isNicknameAvailable(this.registerForm.value.nickname).subscribe(res => {
      if (res.length > 0) {
        let alert = this.alertctrl.create({
          header: 'Error',
          message: 'Nickname is already taken',
          buttons: ['CONFIRM']
        });
        alert.then(alert => alert.present());
      } else {
        if(this.registerForm.get('password').value == this.registerForm.get('passwordCheck').value){
          this.authService.convertAnon(this.registerForm.value).then(async (res) => {
            let toast = await this.toastctrl.create({
              duration: 2000,
              color: 'natureGreen',
              message: 'Successfully created a new Account!'
            });
            toast.present();
            this.router.navigateByUrl('');
          }, async (err) => {
            let alert = await this.alertctrl.create({
              header: 'Error',
              message: err.message,
              buttons: ['CONFIRM']
            });
            alert.present();
          })
        }
        else{
          let toast = this.toastctrl.create({
            duration: 2000,
            color: 'danger',
            message: 'Password incorrect!'
          });
          toast.then(toast => toast.present());
        }
      }
    })
  }

}
