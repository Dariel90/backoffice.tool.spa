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
import { SelectRequiredValidatorDirective } from './_directives/select-required-validator.directive';
import { JwtModule } from '@auth0/angular-jwt';
import { AuthInterceptor } from './_services/auth.interceptor';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { PaginationModule,PaginationConfig  } from 'ngx-bootstrap/pagination';
import { SourceDetailsResolver } from './_resolver/source-detail.resolver';
import { MessageListComponent } from './mymessage/message-list/message-list.component';
import { MessageListResolver } from './_resolver/message-list.resolver';
import { NgxPaginationModule } from 'ngx-pagination';
import { BsModalService } from 'ngx-bootstrap/modal';
import { MessageAddComponent } from './mymessage/message-add/message-add.component';
import { MessageEditComponent } from './mymessage/message-edit/message-edit.component';
import { MessageEditResolver } from './_resolver/message-edit.resolver';
import { KafkaRegisterComponent } from './kafkatopic/kafka-register/kafka-register.component';
import { KafkaTopicResolver } from './_resolver/kafkatopic-resolver.resolver';
import { PropertyAddComponent } from './myproperties/property-add/property-add.component';
import { PropertyEditComponent } from './myproperties/property-edit/property-edit.component';
import { PropertyEditResolver } from './_resolver/property-edit.resolver';
import { PropertyMetadataAddComponent } from './myproperties/property.metadata-add/property.metadata-add.component';
import { PropertyMetadataListComponent } from './myproperties/property.metadata-list/property.metadata-list.component';
import { PropertiesMetadataListResolver } from './_resolver/property.metadatas-list.resolver';
import { PropertyMetadataEditComponent } from './myproperties/property.metadata-edit/property.metadata-edit.component';
import { PropertyMetadataEditResolver } from './_resolver/property.metadatas-edit.resolver';

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
    SelectRequiredValidatorDirective,
    MessageListComponent,
    MessageAddComponent,
    MessageEditComponent,
    KafkaRegisterComponent,
    PropertyAddComponent,
    PropertyEditComponent,
    PropertyMetadataAddComponent,
    PropertyMetadataListComponent,
    PropertyMetadataEditComponent,
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    ReactiveFormsModule,    
    BrowserAnimationsModule,
    FormsModule,
    BsDropdownModule.forRoot(),
    NgxPaginationModule,
    PaginationModule,
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
    BsModalService,
    PaginationConfig,
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
    SourceEditResolver,
    SourceDetailsResolver,
    MessageListResolver,
    MessageEditResolver,
    KafkaTopicResolver,
    PropertyEditResolver,
    PropertiesMetadataListResolver,
    PropertyMetadataEditResolver
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
