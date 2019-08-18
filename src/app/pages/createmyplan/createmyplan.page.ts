import { Component, OnInit } from '@angular/core';
import { PlanService } from 'src/app/services/plan.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-createmyplan',
  templateUrl: './createmyplan.page.html',
  styleUrls: ['./createmyplan.page.scss'],
})
export class CreatemyplanPage implements OnInit {

  title = '';
  description = '';

  constructor(
    private planService: PlanService,
    private router: Router
  ) { }

  ngOnInit() {
  }

  createPlan(){
    this.planService.createPlan(this.title, this.description)
    .then( res => {
      this.router.navigate(['/tabs/tab2']);
    })
  }

}
