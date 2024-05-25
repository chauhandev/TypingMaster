import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignupComponent } from './components/signup/signup.component';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AuthGuard } from './guards/authgaurd.guard';

const routes: Routes = [
 { path :'',redirectTo :'login',pathMatch:'full' },
 { path :'signup',component: SignupComponent ,canActivate:[AuthGuard] },
 { path :'login',component: LoginComponent ,canActivate:[AuthGuard]},
 { path :'dashboard',component: DashboardComponent ,canActivate:[AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
