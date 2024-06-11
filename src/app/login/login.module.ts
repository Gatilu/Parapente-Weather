import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';

import { LoginPage } from './login.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule, // Ensure ReactiveFormsModule is imported here
    IonicModule,
    RouterModule.forChild([{ path: '', component: LoginPage }]) // Configure routing for LoginPage
  ],
  declarations: [LoginPage] // Declare LoginPage here
})
export class LoginPageModule {}
