import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { AuthRoutingModule } from './auth-routing.module';
import { SharedModule } from '../shared/shared.module';
import { AuthService } from './auth.service';

@NgModule({
  declarations: [LoginComponent, SignupComponent],
  imports: [SharedModule, AuthRoutingModule],
})
export class AuthModule {}
