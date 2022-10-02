import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { RegisterComponent } from './register/register.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';//Para el datepicker ngx-bootstrap
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { NavComponent } from './nav/nav.component';
import { SourceEditComponent } from './mysources/source-edit/source-edit.component';
import { SourceDetailComponent } from './mysources/source-detail/source-detail.component';
import {RouterModule} from '@angular/router';
import { appRoutes } from './routes';
import { AuthService } from './_services/auth.service';
import { AlertifyService } from './_services/alertify.service';
import { AuthGuard } from './_guards/auth.guard';
import { ErrorInterceptorProvider } from './_services/error.interceptor';
import { PreventUnsavedChanges } from './_guards/prevent-unsaved-changes.guard';
import { BrowserModule, HammerGestureConfig, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
import { PropertyListComponent } from './myproperties/property-list/property-list.component';
import { PropertyListResolver } from './_resolver/property-list.resolver';
import { SourceEditResolver } from './_resolver/source-edit.resolver';
import { SourceAddComponent } from './mysources/source-add/source-add.component';
import { HasRoleDirective } from './_directives/hasRole.directive';
import { JwtModule } from '@auth0/angular-jwt';
import { AuthInterceptor } from './_services/auth.interceptor';

export class CustomHammerConfig extends HammerGestureConfig  {
  override overrides = {
      pinch: { enable: false },
      rotate: { enable: false }
  };
}


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    RegisterComponent,
    NavComponent,
    SourceEditComponent,
    SourceDetailComponent,
    PropertyListComponent,
    SourceAddComponent,
    HasRoleDirective,
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,    
    RouterModule.forRoot(appRoutes),    
    JwtModule.forRoot({
      config: {
        tokenGetter:  () => localStorage.getItem('token'),
        authScheme: 'Bearer ',
        allowedDomains:['https://localhost:5001'],
        skipWhenExpired: true,
        throwNoTokenError: true,
        disallowedRoutes: ['https://localhost:5001/api/auth/']
      }
    }),
  ],
  providers: [
    AuthService,
    AlertifyService,
    AlertifyService,
    AuthGuard,
    ErrorInterceptorProvider,
    PreventUnsavedChanges,
    {
      provide: HAMMER_GESTURE_CONFIG, useClass: CustomHammerConfig
    },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true},
    PropertyListResolver,
    SourceEditResolver
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
