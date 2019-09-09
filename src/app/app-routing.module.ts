import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  },
  { path: 'login', loadChildren: './login/login.module#LoginPageModule' },
  { path: 'register', loadChildren: './register/register.module#RegisterPageModule' },
  { 
    path: 'tab4', 
    loadChildren: './tab4/tab4.module#Tab4PageModule',
    canActivate: [AuthGuard]
  },
  { path: 'tripplanner', loadChildren: './pages/tripplanner/tripplanner.module#TripplannerPageModule' },
  { path: 'tripplanner/:id', loadChildren: './pages/tripplanner/tripplanner.module#TripplannerPageModule' },
  { path: 'createmyplan', loadChildren: './pages/createmyplan/createmyplan.module#CreatemyplanPageModule' },
  { path: 'planner/:id', loadChildren: './pages/planner/planner.module#PlannerPageModule' },
  { path: 'tab2description', loadChildren: './pages/tab2description/tab2description.module#Tab2descriptionPageModule' },
  { path: 'tab2description/:id', loadChildren: './pages/tab2description/tab2description.module#Tab2descriptionPageModule' },
  { path: 'planneredit', loadChildren: './pages/planneredit/planneredit.module#PlannereditPageModule' },
  { path: 'planneredit/:id/:id2', loadChildren: './pages/planneredit/planneredit.module#PlannereditPageModule' }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
