import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { PlannerofflinePage } from './planneroffline.page';

const routes: Routes = [
  {
    path: '',
    component: PlannerofflinePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [PlannerofflinePage]
})
export class PlannerofflinePageModule {}
