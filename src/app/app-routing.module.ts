import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './Auth/login/login.component';
import { RegisterComponent } from './Auth/register/register.component';
import { HomeDashboardComponent } from './layout/home-dashboard/home-dashboard.component';
import { authGuard } from './guard/auth.guard';
import { DashboardComponent } from './dashboard/dashboard.component';

const routes: Routes = [
  {
    path:'home',
    component:HomeDashboardComponent,
    canActivate:[authGuard],
    children: [
      { 
        canActivate:[authGuard],
        path: 'dashboard',
        component: DashboardComponent 
      }
    ]
  },
  {
    path:'login',
    component:LoginComponent
  },
  {
    path:'register',
    component:RegisterComponent
  },
  { path: '', redirectTo: 'home/dashboard', pathMatch: 'full' },
  { path: '**', redirectTo: 'home/dashboard' }
  // {
  //   path:'dashboard',
  //   component:DashboardComponent
  // }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
