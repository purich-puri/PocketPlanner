import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PlanService } from '../services/plan.service';
import { Observable } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit {

  plans: Observable<any>;

  constructor(
    private router: Router,
    private planService: PlanService,
    private afAuth: AngularFireAuth
  ) {}

  ngOnInit(){
    this.afAuth.auth.onAuthStateChanged(user => {
      if(user){
        //console.log(user);
        this.plans = this.planService.getPlans();
      }
      else{
        console.log("not logged in");
      }
    });
    
  }

  gotoPage(){
    this.router.navigate(['/createmyplan']);
  }
}
