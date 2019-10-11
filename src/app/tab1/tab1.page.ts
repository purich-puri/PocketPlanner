import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PlanService } from '../services/plan.service';
import { Observable } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';
import { AuthService } from '../services/auth.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {

  plans: Observable<any>;
  data: any;


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

    this.planService.getAllPlans();
  }

  // startSearch(ev: any){
  //   //console.log(ev.target.value);
  //   // let serVal = ev.target.value;
  //   // if(serVal != ''){
  //   //   this.plans = this.data.filter((a) => {
  //   //     return (a.title.toLowerCase().indexOf(serVal.toLowerCase()) > -1);
  //   //   })
  //   // }
  // }

}
