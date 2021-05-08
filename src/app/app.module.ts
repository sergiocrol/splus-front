import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';

import { AppComponent } from './app.component';
import { NavigationComponent } from './navigation/navigation.component';

import { AppRoutingModule } from './app-routing.module';
import { AuthModule } from './auth/auth.module';
import { SharedModule } from './shared/shared.module';
import { LottieModule } from 'ngx-lottie';
import player from 'lottie-web';

import { UIService } from './shared/ui.service';
import { AuthService } from './auth/auth.service';
import { CookieService } from 'ngx-cookie-service';
import { ExcelService } from './community/discussions/excel.service';

import { reducers } from './app.reducer';
import { environment } from '../environments/environment';
import { CommunityService } from './community/community.service';
import { DashboardService } from './dashboard/dashboard.service';
import { FinderService } from './finder/finder.service';
import { FooterComponent } from './footer/footer.component';
import { FinderComponent } from './finder/finder.component';
import { UserFinderComponent } from './finder/user-finder/user-finder.component';

export function tokenGetter() {
  return localStorage.getItem('esbApitoken');
}

export function playerFactory() {
  return player;
}

@NgModule({
  declarations: [
    AppComponent,
    NavigationComponent,
    FooterComponent,
    FinderComponent,
    UserFinderComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AuthModule,
    BrowserAnimationsModule,
    SharedModule,
    HttpClientModule,
    LottieModule.forRoot({ player: playerFactory }),
    StoreModule.forRoot(reducers),
    StoreDevtoolsModule.instrument({
      maxAge: 25,
      logOnly: environment.production,
    }),
  ],
  providers: [
    UIService,
    AuthService,
    CommunityService,
    CookieService,
    ExcelService,
    DashboardService,
    FinderService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
