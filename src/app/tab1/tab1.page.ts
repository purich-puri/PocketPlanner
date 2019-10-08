import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PlanService } from '../services/plan.service';
import { Observable } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';
import { AuthService } from '../services/auth.service';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {

  plans: Observable<any>;


  constructor(
    private router: Router,
    private planService: PlanService,
    private afAuth: AngularFireAuth,
    private db: AngularFirestore
  ) {}

  ngOnInit(){
    this.afAuth.auth.onAuthStateChanged(user => {
      if(user){
        //console.log(user);
      }
      else{
        //console.log("not logged in");
      }
    }); 

    this.plans = this.planService.getAllPlans();

  }

}
