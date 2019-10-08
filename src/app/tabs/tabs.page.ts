import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage implements OnInit {

  constructor(
    private afAuth: AngularFireAuth,
    private authService: AuthService
  ) {}

  ngOnInit(){
    // this.afAuth.auth.onAuthStateChanged(user => {
    //   if(user){
    //     console.log(user);
    //   }
    //   else{
    //     this.authService.createAnonID();
    //   }
    // });
  }

}
