import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import {HomepageComponent} from "./homepage/homepage.component";
import {RecordsComponent} from "./records/records.component";
import {RegisterComponent} from "./register/register.component";
import {LoginComponent} from "./login/login.component";
import {PreferencesComponent} from "./preferences/preferences.component";
import {PlayComponent} from "./play/play.component";

const routes: Routes = [
  {path: '', component: HomepageComponent},
  {path: 'records', component: RecordsComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'login', component: LoginComponent},
  {path: 'preferences', component: PreferencesComponent},
  {path: 'play', component: PlayComponent},
  {path: '**',redirectTo: ''}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
